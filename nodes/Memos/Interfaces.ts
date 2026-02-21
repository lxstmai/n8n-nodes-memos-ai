import { AllEntities, PropertiesOf } from 'n8n-workflow';

export type MemosMap = {
	user: 'listUsers' | 'getUser';
	memo: 'listMemos' | 'getMemo' | 'createMemo' | 'updateMemo' | 'deleteMemo';
};

export type MemosAction = AllEntities<MemosMap>;
export type MemosProperties = PropertiesOf<MemosAction>;

export type RowStatus = 'ACTIVE' | 'ARCHIVED' | 'ROW_STATUS_UNSPECIFIED';
export type UserRole = 'HOST' | 'ADMIN' | 'USER' | 'ROLE_UNSPECIFIED';
export type Visibility = 'PUBLIC' | 'WORKSPACE' | 'PRIVATE';

export interface ResourceModel {
	name: string;
	uid: string;
	createTime: string;
	filename: string;
	content: string;
	externalLink: string;
	type: string;
	size: string;
	memo: string;
}

export interface UserModel {
	name: string;
	id: number;
	role: UserRole;
	username: string;
	email: string;
	nickname: string;
	avatarUrl: string;
	description: string;
	password: string;
	rowStatus: RowStatus;
	createTime: string;
	updateTime: string;
}

export interface Memo {
	name: string;
	uid: string;
	rowStatus: RowStatus;
	creator: string;
	createTime: string;
	updateTime: string;
	displayTime: string;
	content: string;
	nodes: any[];
	visibility: Visibility;
	tags: string[];
	pinned: boolean;
	resources: ResourceModel[];
	relations: any[];
	reactions: any[];
	property: {
		tags: string[];
		hasLink: boolean;
		hasTaskList: boolean;
		hasCode: boolean;
		hasIncompleteTasks: boolean;
	};
}

export interface WebhookModel {
	id: number;
	creatorId: number;
	createTime: string;
	updateTime: string;
	rowStatus: RowStatus;
	name: string;
	url: string;
}

export interface WebhookPayload {
	url: string;
	activityType: string;
	creatorId: number;
	createTime: string;
	memo: Memo;
}
