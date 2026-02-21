import {
	IAuthenticate,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MemosApi implements ICredentialType {
	name = 'memosApi';
	displayName = 'Memos API';
	documentationUrl = 'https://www.usememos.com/docs/security/access-tokens';
	properties: INodeProperties[] = [
		{
			displayName: 'Server',
			name: 'server',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticate = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{ $credentials.accessToken }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.server }}/api/v1',
			url: '/auth/status',
			method: 'POST',
		},
	};
}
