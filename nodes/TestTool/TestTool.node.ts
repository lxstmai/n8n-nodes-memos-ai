import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class TestTool implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Test Tool (AI Toggle)',
        name: 'testTool',
        icon: 'fa:vial',
        group: ['transform'],
        version: 1,
        description: 'A dummy node to test the AI wand toggle.',
        defaults: {
            name: 'Test Tool',
        },
        inputs: ['main'],
        outputs: ['main'],
        // @ts-ignore
        usableAsTool: true,
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Test Types', value: 'testTypes', action: 'Test various input types' }
                ],
                default: 'testTypes',
            },
            {
                displayName: 'String Field',
                name: 'typeString',
                type: 'string',
                default: '',
                description: 'A basic string field',
            },
            {
                displayName: 'String With Options',
                name: 'typeStringOptions',
                type: 'options',
                options: [
                    { name: 'Opt 1', value: 'opt1' },
                    { name: 'Opt 2', value: 'opt2' }
                ],
                default: 'opt1',
                description: 'Looks like string but uses options',
            },
            {
                displayName: 'Boolean Field',
                name: 'typeBoolean',
                type: 'boolean',
                default: false,
                description: 'A basic boolean field',
            },
            {
                displayName: 'Number Field',
                name: 'typeNumber',
                type: 'number',
                default: 0,
                description: 'A basic number field',
            },
            {
                displayName: 'Empty String Default',
                name: 'typeStringEmpty',
                type: 'string',
                default: '',
                description: 'A string with empty default',
            }
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const result: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            result.push({
                json: {
                    typeString: this.getNodeParameter('typeString', i, ''),
                    typeStringOptions: this.getNodeParameter('typeStringOptions', i, ''),
                    typeBoolean: this.getNodeParameter('typeBoolean', i, false),
                    typeNumber: this.getNodeParameter('typeNumber', i, 0),
                    typeStringEmpty: this.getNodeParameter('typeStringEmpty', i, ''),
                },
            });
        }

        return [result];
    }
}
