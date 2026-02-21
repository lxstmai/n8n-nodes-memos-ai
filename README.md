# n8n-nodes-memos-ai

An advanced n8n community node that seamlessly integrates your workflows with the [Memos](https://www.usememos.com/) privacy-first, lightweight note-taking service.

This node is built from the ground up to be **Fully AI Agent Compatible**. It uses highly optimized schemas and property descriptions so that the native n8n AI Agent can intelligently use it as a Tool to search, read, create, update, and organize your Memos.

## Features

- **AI Wand Ready**: Fully supports the `{{ $fromAI(...) }}` dynamic injection on all fields (Visibility, Pinned, Order By, Filter, etc.).
- **Smart Filtering & Sorting**: Supports AIP-160 filter syntax to allow complex searches right from n8n.
- **Dynamic Updates**: Fields are optional when updating, meaning the AI Agent can update just the text, or just the `pinned` status independently.
- **Short ID Resolution**: Extracts Memo IDs cleanly, whether the AI supplies `memos/12345` or just `12345`.

## Available Operations

- **List Memos**: Search and filter existing memos using AIP-160.
- **Get Memo**: Retrieve detailed information for a specific memo by ID.
- **Create Memo**: Create a new memo, define its visibility (Public/Workspace/Private), and pin it instantly. Tags are supported inline via markdown (`#tag`).
- **Update Memo**: Modify an existing memo's text, visibility, or pinned status.
- **Delete Memo**: Permanently delete a memo.
- **List/Get Users**: Retrieve users from your Memos instance.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

To install this node from your n8n interface:
1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-memos` or your own GitHub repository link.
4. Click **Install**.

## Credentials

1. Go to your Memos instance.
2. Navigate to **Settings > Access Tokens**.
3. Create a Personal Access Token.
4. In n8n, create new credentials for **Memos API** and paste your Server URL (e.g., `https://memos.example.com`) and the token.

## Usage with AI Agent

1. Add an **AI Agent** node in n8n.
2. Connect the **Memos** node as a Tool to the AI Agent.
3. For parameters like *Visibility* or *Pinned*, click the gear icon (⚙️) -> **Add Expression** and enter the `$fromAI("fieldName")` expression as requested in the field's description.
4. Prompt the AI Agent to interact with your Memos!

## License

MIT
