#!/usr/bin/env node
/**
 * Firecrawl + To-do MCP Server
 *
 * Exposes tools that Claude can call via the Model Context Protocol:
 *   - todo_list        List all to-do items
 *   - todo_add         Add a to-do item (optionally scraping a URL for context)
 *   - todo_complete    Mark a to-do as done
 *   - todo_delete      Delete a to-do
 *   - todo_update      Update title/notes on a to-do
 *   - firecrawl_scrape Scrape a URL and return its markdown content
 *   - firecrawl_search Search the web and return result snippets
 *
 * Usage: node src/mcp-server.js   (stdio transport — point Claude Code at it)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  listTodos,
  addTodo,
  completeTodo,
  deleteTodo,
  updateTodo,
} from "./todo-store.js";
import { scrapeUrl, searchWeb } from "./firecrawl-client.js";

const server = new Server(
  { name: "todo-firecrawl", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── Tool definitions ───────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "todo_list",
      description: "List all to-do items, optionally filtered by done status.",
      inputSchema: {
        type: "object",
        properties: {
          filter: {
            type: "string",
            enum: ["all", "pending", "done"],
            description: "Which items to return (default: all)",
          },
        },
      },
    },
    {
      name: "todo_add",
      description:
        "Add a new to-do item. If a URL is provided and scrape_url is true, Firecrawl will fetch the page and store a markdown summary as notes.",
      inputSchema: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", description: "Short title for the task" },
          url: {
            type: "string",
            description: "Optional URL related to the task",
          },
          notes: {
            type: "string",
            description: "Optional extra notes (ignored when scrape_url=true)",
          },
          scrape_url: {
            type: "boolean",
            description: "If true and url is set, scrape the URL for notes",
          },
        },
      },
    },
    {
      name: "todo_complete",
      description: "Mark a to-do item as done.",
      inputSchema: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "number", description: "ID of the to-do to complete" },
        },
      },
    },
    {
      name: "todo_delete",
      description: "Delete a to-do item permanently.",
      inputSchema: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "number", description: "ID of the to-do to delete" },
        },
      },
    },
    {
      name: "todo_update",
      description: "Update the title or notes of an existing to-do.",
      inputSchema: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "number", description: "ID of the to-do to update" },
          title: { type: "string" },
          notes: { type: "string" },
        },
      },
    },
    {
      name: "firecrawl_scrape",
      description:
        "Scrape a webpage with Firecrawl and return its markdown content.",
      inputSchema: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string", description: "URL to scrape" },
        },
      },
    },
    {
      name: "firecrawl_search",
      description: "Search the web via Firecrawl and return result snippets.",
      inputSchema: {
        type: "object",
        required: ["query"],
        properties: {
          query: { type: "string", description: "Search query" },
          limit: {
            type: "number",
            description: "Max results to return (default 5)",
          },
        },
      },
    },
  ],
}));

// ── Tool execution ─────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "todo_list": {
        const todos = listTodos();
        const filter = args?.filter ?? "all";
        const filtered =
          filter === "pending"
            ? todos.filter((t) => !t.done)
            : filter === "done"
            ? todos.filter((t) => t.done)
            : todos;
        return { content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }] };
      }

      case "todo_add": {
        let notes = args.notes ?? null;
        if (args.scrape_url && args.url) {
          const scraped = await scrapeUrl(args.url);
          notes = scraped?.markdown?.slice(0, 4000) ?? null;
        }
        const todo = addTodo({ title: args.title, url: args.url, notes });
        return { content: [{ type: "text", text: JSON.stringify(todo, null, 2) }] };
      }

      case "todo_complete": {
        const todo = completeTodo(args.id);
        return { content: [{ type: "text", text: JSON.stringify(todo, null, 2) }] };
      }

      case "todo_delete": {
        const todo = deleteTodo(args.id);
        return {
          content: [{ type: "text", text: `Deleted: ${JSON.stringify(todo)}` }],
        };
      }

      case "todo_update": {
        const { id, ...fields } = args;
        const todo = updateTodo(id, fields);
        return { content: [{ type: "text", text: JSON.stringify(todo, null, 2) }] };
      }

      case "firecrawl_scrape": {
        const result = await scrapeUrl(args.url);
        const markdown = result?.markdown ?? "(no content)";
        return { content: [{ type: "text", text: markdown }] };
      }

      case "firecrawl_search": {
        const results = await searchWeb(args.query, { limit: args.limit ?? 5 });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

// ── Start ──────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("todo-firecrawl MCP server running on stdio");
