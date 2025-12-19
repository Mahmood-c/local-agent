import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { json, z } from "zod";
import path from "path";
import fs from "fs/promises";

const API_BASE_URL = "http://127.0.0.1:1234/v1/responses";
const USER_AGENT = "local-agent/1.0";
const WORKSPACE_ROOT = process.cwd();

function resolveSafePath(relativePath: string): string {
  const resolved = path.resolve(WORKSPACE_ROOT, relativePath);

  if (!resolved.startsWith(WORKSPACE_ROOT)) {
    throw new Error("Access outside workspace is not allowed");
  }

  return resolved;
}
// Create server instance
const server = new McpServer({
  name: "local-agent",
  version: "1.0.0",
}, {
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},

  }
});

server.registerTool(
  "explain_file",
  {
    description: "explain a file from the workspace using markdown",
    inputSchema: {
      path: z.string().describe("Relative path to file"),
    },
  },
  async ({ path }) => {
    const safePath = resolveSafePath(path);
    const question = await fs.readFile(safePath, "utf-8");
    const answer: any = await post(question);

    return {
      content: [
        {
          type: "text",
          text: answer.output[0].content[0].text,
        },
      ],
    };
  },
);



async function runServer() {

  const transporter = new StdioServerTransport();
  await server.connect(transporter);


}



async function post(input: string) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {

      "User-Agent": USER_AGENT,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "",
      input: input
    })
  });
  const json = await res.json();

  return json;

}

if (require.main === module) {
  runServer().catch(err => {
    console.error(err);
    process.exit(1);
  });
}