import { IAllExecuteFunctions, IDataObject, IHttpRequestMethods, IHttpRequestOptions } from 'n8n-workflow';

type MemosCredentials = {
	server: string;
	accessToken: string;
};

export async function apiRequest(
	this: IAllExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IHttpRequestOptions['body'],
	query?: IHttpRequestOptions['qs'],
) {
	const credentials = (await this.getCredentials('memosApi')) as MemosCredentials;
	const baseURL = `${credentials.server.replace(/\/+$/, '')}/api/v1`;

	if (!endpoint.startsWith('/')) {
		endpoint = '/' + endpoint;
	}

	const options: IHttpRequestOptions = {
		url: endpoint,
		baseURL,
		headers: {
			'User-Agent': 'n8n',
		},
		method,
		body,
		qs: query,
		json: true,
	};
	return this.helpers.httpRequestWithAuthentication.call(this, 'memosApi', options);
}

export async function apiUploadRequest(
	this: IAllExecuteFunctions,
	endpoint: string,
	formData: IDataObject,
) {
	const credentials = (await this.getCredentials('memosApi')) as MemosCredentials;
	const baseURL = `${credentials.server.replace(/\/+$/, '')}/api/v1`;

	if (!endpoint.startsWith('/')) {
		endpoint = '/' + endpoint;
	}

	const options: any = {
		url: endpoint,
		baseURL,
		headers: {
			'User-Agent': 'n8n',
		},
		method: 'POST',
	};
	options.formData = formData;

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'memosApi', options);

	try {
		if (typeof response === 'string') {
			return JSON.parse(response);
		}
		return response;
	} catch (error) {
		return response;
	}
}
