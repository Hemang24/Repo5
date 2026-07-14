# To-do List + Firecrawl MCP Integration

A to-do list application that connects Claude AI to Firecrawl via the Model Context Protocol (MCP), enabling Claude to manage tasks and scrape web content.

## Features

- **To-do management** — add, complete, delete, and update tasks
- **Firecrawl integration** — Claude can scrape URLs and attach summaries to tasks
- **Web search** — Claude can search the web and create tasks from results
- **Two usage modes:**
  - **Interactive CLI** — chat with Claude directly (`npm start`)
  - **MCP server** — plug the server into Claude Code or any MCP host (`npm run mcp`)

## Setup

```bash
npm install
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and FIRECRAWL_API_KEY
```

Get your keys:
- Anthropic: https://console.anthropic.com
- Firecrawl: https://firecrawl.dev

## Usage

### Interactive CLI

```bash
npm start
```

Example prompts:
```
You: Show me my to-do list
You: Add a task to read the Firecrawl docs at https://docs.firecrawl.dev
You: Mark task 1234567890 as done
You: Search the web for "best productivity tips" and add the top result as a task
```

### MCP Server (Claude Code)

Register the server in Claude Code:

```bash
claude mcp add todo-firecrawl node src/mcp-server.js
```

Or point Claude Code at `.claude/mcp-config.json` for automatic configuration.

Once registered, Claude Code gains these tools:
| Tool | Description |
|------|-------------|
| `todo_list` | List all / pending / done tasks |
| `todo_add` | Add a task (with optional URL scraping) |
| `todo_complete` | Mark a task done |
| `todo_delete` | Delete a task |
| `todo_update` | Edit title or notes |
| `firecrawl_scrape` | Scrape a URL → markdown |
| `firecrawl_search` | Web search → snippets |

## Project Structure

```
src/
  index.js          # Interactive Claude CLI
  mcp-server.js     # MCP server (stdio transport)
  todo-store.js     # JSON-file to-do persistence
  firecrawl-client.js  # Firecrawl API wrapper
.claude/
  mcp-config.json   # MCP server config for Claude Code
```
