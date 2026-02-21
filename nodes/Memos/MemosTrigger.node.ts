/* eslint-disable n8n-nodes-base/node-class-description-icon-not-svg */
import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeOperationError,
} from 'n8n-workflow';
import { apiRequest } from './GenericFunctions';
import { WebhookModel } from './Interfaces';

export class MemosTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Memos Trigger',
		name: 'memosTrigger',
		icon: 'file:memos.png',
		group: ['trigger'],
		version: 1,
		description: 'Handle Memos events via webhooks',
		defaults: {
			name: 'Memos Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'memosApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [],
	};
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return false;
				}

				const endpoint = `/webhooks/${webhookData.webhookId}`;
				try {
					const webhook = (await apiRequest.call(this, 'GET', endpoint)) as WebhookModel;
					if (webhook.url !== webhookUrl) {
						delete webhookData.webhookId;
						return false;
					}
				} catch (error) {
					if (error.cause.httpCode === '404') {
						delete webhookData.webhookId;
						return false;
					}
					throw error;
				}
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (webhookUrl.includes('//localhost')) {
					throw new NodeOperationError(
						this.getNode(),
						'The Webhook can not work on "localhost". Please, either setup n8n on a custom domain or start with "--tunnel"!',
					);
				}

				const endpoint = '/webhooks';
				const body = {
					name: 'Memos Trigger',
					url: webhookUrl,
				};
				const webhookData = this.getWorkflowStaticData('node');
				let responseData: WebhookModel;
				try {
					responseData = await apiRequest.call(this, 'POST', endpoint, body);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error);
				}

				webhookData.webhookId = responseData.id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return true;
				}

				const endpoint = `/webhooks/${webhookData.webhookId}`;
				try {
					await apiRequest.call(this, 'DELETE', endpoint);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error);
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as {
			activityType: string;
		};

		const returnData: IDataObject[] = [bodyData];

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
