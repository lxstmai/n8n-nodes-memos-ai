/* eslint-disable n8n-nodes-base/node-class-description-icon-not-svg */
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { MemosAction } from './Interfaces';
import { apiRequest } from './GenericFunctions';

export class Memos implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Memos',
		name: 'memos',
		icon: 'file:memos.png',
		description: 'Interact with Memos API. Use this tool to list, create, get, update, and delete memos.',
		subtitle: '={{ $parameter["operation"] }}',
		version: 1,
		defaults: {
			name: 'Memos',
		},
		// @ts-ignore
		usableAsTool: true,
		group: ['transform'],
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'memosApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'memos',
				options: [
					{
						name: 'User',
						value: 'users',
					},
					{
						name: 'Memo',
						value: 'memos',
					},
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'listUsers',
				options: [
					{
						name: 'List Users',
						value: 'listUsers',
						action: 'List users',
					},
					{
						name: 'Get User',
						value: 'getUser',
						action: 'Get user',
					},
				],
				displayOptions: {
					show: {
						resource: ['users'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'listMemos',
				options: [
					{
						name: 'List Memos',
						value: 'listMemos',
						action: 'List memos',
					},
					{
						name: 'Get Memo',
						value: 'getMemo',
						action: 'Get memo',
					},
					{
						name: 'Create Memo',
						value: 'createMemo',
						action: 'Create a memo',
					},
					{
						name: 'Update Memo',
						value: 'updateMemo',
						action: 'Update a memo',
					},
					{
						name: 'Delete Memo',
						value: 'deleteMemo',
						action: 'Delete a memo',
					},
				],
				displayOptions: {
					show: {
						resource: ['memos'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['memos'],
						operation: ['listMemos'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['memos'],
						operation: ['listMemos'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 10,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				placeholder: 'row_status == "NORMAL"',
				description: 'Filter expression (AIP-160). For multiple conditions, use `&&` (AND) and `||` (OR). Do NOT use the words AND/OR. Examples: `visibility == "PRIVATE" && content.contains("test")`. CRITICAL FOR AI: The Memos API DOES NOT support filtering by `create_time` or `update_time`. DO NOT use time-based filters here. Supported fields: visibility, content, pinned, creator, row_status.',
				displayOptions: {
					show: {
						resource: ['memos'],
						operation: ['listMemos'],
					},
				},
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				default: '',
				placeholder: 'create_time desc',
				description: 'Sorting criteria (AIP-160). Example: `create_time desc` or `update_time asc`.',
				displayOptions: {
					show: {
						resource: ['memos'],
						operation: ['listMemos'],
					},
				},
			},
			{
				displayName: 'Resource Name (or ID)',
				name: 'resourceName',
				type: 'string',
				default: '',
				required: true,
				description: 'The resource name (e.g., memos/example123) or just the ID (e.g., example123). If only ID is provided, "memos/" will be added automatically.',
				hint: 'example123 or memos/example123',
				displayOptions: {
					show: {
						operation: ['getUser', 'getMemo', 'updateMemo', 'deleteMemo'],
					},
				},
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The markdown content for the memo. To add tags, simply include `#tagname` in the text. Leave empty for update if you do not want to change it.',
				displayOptions: {
					show: {
						operation: ['createMemo', 'updateMemo'],
					},
				},
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'string',
				default: 'PRIVATE',
				description: 'The visibility level of the memo (PUBLIC, WORKSPACE, or PRIVATE).',
				displayOptions: {
					show: {
						operation: ['createMemo'],
					},
				},
			},
			{
				displayName: 'Pinned',
				name: 'pinned',
				type: 'boolean',
				default: false,
				description: 'Whether the memo should be pinned immediately upon creation.',
				displayOptions: {
					show: {
						operation: ['createMemo'],
					},
				},
			},
			{
				displayName: 'Visibility (Update)',
				name: 'updateVisibility',
				type: 'string',
				default: '',
				description: 'The visibility level of the memo (PUBLIC, WORKSPACE, PRIVATE). Leave empty to skip updating.',
				displayOptions: {
					show: {
						operation: ['updateMemo'],
					},
				},
			},
			{
				displayName: 'Pinned (Update)',
				name: 'updatePinned',
				type: 'string',
				default: '',
				description: 'Whether the memo is pinned. Leave empty to skip updating.',
				displayOptions: {
					show: {
						operation: ['updateMemo'],
					},
				},
			},
			{
				displayName: 'Include Binary File',
				name: 'includeBinaryFile',
				type: 'boolean',
				default: false,
				description: 'Whether to upload and attach a binary file to the memo. Set to true if a file is provided.',
				displayOptions: {
					show: {
						operation: ['createMemo', 'updateMemo'],
					},
				},
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				description: 'Name of the binary property which contains the data for the file to be uploaded',
				displayOptions: {
					show: {
						operation: ['createMemo', 'updateMemo'],
						includeBinaryFile: [true],
					},
				},
			},

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource');

		const result: INodeExecutionData[] = [];
		for (let index = 0; index < items.length; index++) {
			const operation = this.getNodeParameter('operation', index);
			const action = { resource, operation } as MemosAction;

			let data: IDataObject;
			switch (action.operation) {
				case 'listUsers':
					data = await apiRequest.call(this, 'GET', 'users');
					break;

				case 'listMemos':
					const returnAll = this.getNodeParameter('returnAll', index) as boolean;
					const filter = this.getNodeParameter('filter', index) as string;
					const orderBy = this.getNodeParameter('orderBy', index, '') as string;
					const qs: IDataObject = {};
					if (filter) {
						qs.filter = filter;
					}
					if (orderBy) {
						qs.orderBy = orderBy;
					}

					if (returnAll) {
						data = await apiRequest.call(this, 'GET', 'memos', {}, qs);
						// For simple n8n nodes, often the API returns an array or an object with an array
						// Memos API returns { memos: [], nextPageToken: "" }
						let response = data as { memos: any[]; nextPageToken?: string };
						const allMemos = [...(response.memos || [])];

						while (response.nextPageToken) {
							qs.pageToken = response.nextPageToken;
							data = await apiRequest.call(this, 'GET', 'memos', {}, qs);
							response = data as { memos: any[]; nextPageToken?: string };
							allMemos.push(...(response.memos || []));
						}
						data = { memos: allMemos };
					} else {
						qs.pageSize = this.getNodeParameter('limit', index) as number;
						data = await apiRequest.call(this, 'GET', 'memos', {}, qs);
					}
					break;
				case 'getUser':
				case 'getMemo':
					let getName = this.getNodeParameter('resourceName', index) as string;
					if (getName && !getName.includes('/')) {
						getName = `${resource}/${getName}`;
					}
					data = await apiRequest.call(this, 'GET', getName);
					break;
				case 'createMemo':
					const createBody: IDataObject = {};
					const createContent = this.getNodeParameter('content', index, '');
					if (createContent && String(createContent).trim() !== '') {
						createBody.content = String(createContent);
					}
					const createVis = this.getNodeParameter('visibility', index, '');
					if (createVis && String(createVis).trim() !== '') {
						createBody.visibility = String(createVis).toUpperCase();
					} else {
						createBody.visibility = 'PRIVATE'; // Default if none provided
					}
					const createPinned = this.getNodeParameter('pinned', index, 'false');
					if (String(createPinned).toLowerCase() === 'true') {
						createBody.pinned = true;
					}

					if (this.getNodeParameter('includeBinaryFile', index, false)) {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
						const item = items[index];
						if (item.binary !== undefined && item.binary[binaryPropertyName] !== undefined) {
							const binaryData = item.binary[binaryPropertyName];
							const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

							const payload = {
								filename: binaryData.fileName || 'upload.bin',
								type: binaryData.mimeType,
								content: buffer.toString('base64'),
							};

							const uploadResponse = await apiRequest.call(this, 'POST', 'attachments', payload);

							if (uploadResponse && uploadResponse.name) {
								createBody.attachments = [{ name: uploadResponse.name }];
							}
						}
					}

					data = await apiRequest.call(this, 'POST', 'memos', createBody);
					break;
				case 'updateMemo':
					let updateName = this.getNodeParameter('resourceName', index) as string;
					if (updateName && !String(updateName).includes('/')) {
						updateName = `${resource}/${updateName}`;
					}
					const updateBody: IDataObject = {};
					const updateMask: string[] = [];

					const updateContent = this.getNodeParameter('content', index, '');
					if (updateContent && String(updateContent).trim() !== '') {
						updateBody.content = String(updateContent);
						updateMask.push('content');
					}

					const updateVis = this.getNodeParameter('updateVisibility', index, '');
					if (updateVis !== null && updateVis !== undefined && String(updateVis).trim() !== '') {
						updateBody.visibility = String(updateVis).toUpperCase();
						updateMask.push('visibility');
					}

					const updatePinned = this.getNodeParameter('updatePinned', index, '');
					if (updatePinned !== null && updatePinned !== undefined && String(updatePinned).trim() !== '') {
						updateBody.pinned = String(updatePinned).toLowerCase() === 'true';
						updateMask.push('pinned');
					}

					if (this.getNodeParameter('includeBinaryFile', index, false)) {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
						const item = items[index];
						if (item.binary !== undefined && item.binary[binaryPropertyName] !== undefined) {
							const binaryData = item.binary[binaryPropertyName];
							const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

							const payload = {
								filename: binaryData.fileName || 'upload.bin',
								type: binaryData.mimeType,
								content: buffer.toString('base64'),
							};

							const uploadResponse = await apiRequest.call(this, 'POST', 'attachments', payload);

							if (uploadResponse && uploadResponse.name) {
								updateBody.attachments = [{ name: uploadResponse.name }];
								updateMask.push('attachments');
							}
						}
					}

					const qsUpdate: IDataObject = {};
					if (updateMask.length > 0) {
						qsUpdate.updateMask = updateMask.join(',');
					}

					data = await apiRequest.call(this, 'PATCH', updateName, updateBody, qsUpdate);
					break;
				case 'deleteMemo':
					let deleteName = this.getNodeParameter('resourceName', index) as string;
					if (deleteName && !deleteName.includes('/')) {
						deleteName = `${resource}/${deleteName}`;
					}
					await apiRequest.call(this, 'DELETE', deleteName);
					data = { status: 'deleted', name: deleteName };
					break;
			}

			const json = this.helpers.returnJsonArray(data);
			const executionData = this.helpers.constructExecutionMetaData(json, {
				itemData: { item: index },
			});
			result.push(...executionData);
		}
		return [result];
	}
}
