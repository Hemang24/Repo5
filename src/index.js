#!/usr/bin/env node
/**
 * Interactive Claude + Firecrawl + To-do CLI
 *
 * Starts a conversation with Claude that has access to the to-do and
 * Firecrawl tools defined in mcp-server.js, but wired directly via the
 * Anthropic SDK's tool-use API so you can run this without a separate MCP
 * server process.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY   – your Anthropic API key
 *   FIRECRAWL_API_KEY   – your Firecrawl API key
 *
 * Usage: node src/index.js
 */

import readline from "readline/promises";
import Anthropic from "@anthropic-ai/sdk";
import {
  listTodos,
  addTodo,
  completeTodo,
  deleteTodo,
  updateTodo,
} from "./todo-store.js";
import { scrapeUrl, searchWeb } from "./firecrawl-client.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOOLS = [
  {
    name: "todo_list",
    description: "List to-do items (filter: all | pending | done).",
    input_schema: {
      type: "object",
      properties: {
        filter: { type: "string", enum: ["all", "pending", "done"] },
      },
    },
  },
  {
    name: "todo_add",
    description:
      "Add a new to-do item. Pass scrape_url:true with a url to auto-fetch notes via Firecrawl.",
    input_schema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        url: { type: "string" },
        notes: { type: "string" },
        scrape_url: { type: "boolean" },
      },
    },
  },
  {
    name: "todo_complete",
    description: "Mark a to-do as done.",
    input_schema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "number" } },
    },
  },
  {
    name: "todo_delete",
    description: "Delete a to-do permanently.",
    input_schema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "number" } },
    },
  },
  {
    name: "todo_update",
    description: "Update title or notes of a to-do.",
    input_schema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        notes: { type: "string" },
      },
    },
  },
  {
    name: "firecrawl_scrape",
    description: "Scrape a URL and return its markdown content.",
    input_schema: {
      type: "object",
      required: ["url"],
      properties: { url: { type: "string" } },
    },
  },
  {
    name: "firecrawl_search",
    description: "Search the web and return result snippets.",
    input_schema: {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string" },
        limit: { type: "number" },
      },
    },
  },
];

async function runTool(name, args) {
  switch (name) {
    case "todo_list": {
      const todos = listTodos();
      const f = args.filter ?? "all";
      return f === "pending"
        ? todos.filter((t) => !t.done)
        : f === "done"
        ? todos.filter((t) => t.done)
        : todos;
    }
    case "todo_add": {
      let notes = args.notes ?? null;
      if (args.scrape_url && args.url) {
        const scraped = await scrapeUrl(args.url);
        notes = scraped?.markdown?.slice(0, 4000) ?? null;
      }
      return addTodo({ title: args.title, url: args.url ?? null, notes });
    }
    case "todo_complete":
      return completeTodo(args.id);
    case "todo_delete":
      return deleteTodo(args.id);
    case "todo_update": {
      const { id, ...fields } = args;
      return updateTodo(id, fields);
    }
    case "firecrawl_scrape": {
      const result = await scrapeUrl(args.url);
      return result?.markdown ?? "(no content)";
    }
    case "firecrawl_search":
      return searchWeb(args.query, { limit: args.limit ?? 5 });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function chat(messages) {
  let response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system:
      "You are a helpful assistant with access to a to-do list and the Firecrawl web-scraping service. " +
      "Use the tools to manage tasks and fetch web content when the user asks. " +
      "When adding tasks that reference URLs, use scrape_url:true to fetch a summary automatically.",
    tools: TOOLS,
    messages,
  });

  while (response.stop_reason === "tool_use") {
    const toolUses = response.content.filter((b) => b.type === "tool_use");
    const toolResults = await Promise.all(
      toolUses.map(async (tu) => {
        let result;
        let isError = false;
        try {
          result = await runTool(tu.name, tu.input);
        } catch (err) {
          result = err.message;
          isError = true;
        }
        return {
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(result),
          is_error: isError,
        };
      })
    );

    messages = [
      ...messages,
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults },
    ];

    response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system:
        "You are a helpful assistant with access to a to-do list and the Firecrawl web-scraping service. " +
        "Use the tools to manage tasks and fetch web content when the user asks. " +
        "When adding tasks that reference URLs, use scrape_url:true to fetch a summary automatically.",
      tools: TOOLS,
      messages,
    });
  }

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  return { text, messages: [...messages, { role: "assistant", content: response.content }] };
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Claude To-do + Firecrawl assistant. Type "exit" to quit.\n');

  let messages = [];

  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput.toLowerCase() === "exit") break;
    if (!userInput.trim()) continue;

    messages.push({ role: "user", content: userInput });

    try {
      const { text, messages: updated } = await chat(messages);
      messages = updated;
      console.log(`\nClaude: ${text}\n`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      messages.pop();
    }
  }

  rl.close();
}

main();
