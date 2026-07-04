import { logger } from '../../chunk-3NJY7HIT.js';

// src/lib/mcp/server.ts
var MCPServer = class {
  config;
  transport;
  toolRegistrations = /* @__PURE__ */ new Map();
  resources = [];
  isRunning = false;
  onDisconnect;
  constructor(config) {
    this.config = config;
    this.transport = config.transport;
    this.onDisconnect = config.onDisconnect;
  }
  registerTool(tool, handler) {
    this.toolRegistrations.set(tool.name, { tool, handler });
    logger.info(`MCP tool registered: "${tool.name}"`);
  }
  registerResource(resource) {
    this.resources.push(resource);
  }
  getTools() {
    return Array.from(this.toolRegistrations.values()).map((r) => r.tool);
  }
  getResources() {
    return [...this.resources];
  }
  async start() {
    this.transport.onMessage((message) => {
      this.handleMessage(message).catch((error) => {
        logger.error(`MCP message handling error: ${error}`);
      });
    });
    await this.transport.connect();
    this.isRunning = true;
    logger.info(`MCP Server "${this.config.name}" v${this.config.version} started`);
  }
  async stop() {
    this.isRunning = false;
    await this.transport.close();
    logger.info(`MCP Server "${this.config.name}" stopped`);
  }
  /** Check if server is running and transport is connected */
  get connected() {
    return this.isRunning && this.transport.connected;
  }
  /** Attempt to reconnect the transport */
  async reconnect() {
    if (this.isRunning) {
      logger.warn(`MCP Server "${this.config.name}" already running, stopping first...`);
      await this.stop();
    }
    await this.start();
  }
  /** Handle transport disconnect detected externally */
  handleDisconnect() {
    this.isRunning = false;
    logger.warn(`MCP Server "${this.config.name}" transport disconnected`);
    if (this.onDisconnect) {
      this.onDisconnect();
    }
  }
  async handleMessage(message) {
    if (message.method) {
      switch (message.method) {
        case "initialize":
          await this.handleInitialize(message);
          break;
        case "notifications/initialized":
          break;
        case "tools/list":
          await this.sendResponse(message.id, { tools: this.getTools() });
          break;
        case "tools/call":
          await this.handleToolCall(message);
          break;
        case "resources/list":
          await this.sendResponse(message.id, { resources: this.resources });
          break;
        case "resources/read":
          await this.handleResourceRead(message);
          break;
        case "ping":
          await this.sendResponse(message.id, {});
          break;
        default:
          await this.sendError(message.id, -32601, `Method not found: ${message.method}`);
      }
    }
  }
  async handleInitialize(message) {
    const serverInfo = {
      name: this.config.name,
      version: this.config.version,
      protocolVersion: "2024-11-05"
    };
    const capabilities = {
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false }
    };
    await this.sendResponse(message.id, {
      protocolVersion: "2024-11-05",
      capabilities,
      serverInfo
    });
  }
  async handleToolCall(message) {
    const params = message.params ?? {};
    const toolName = params.name;
    const args = params.arguments ?? {};
    const registration = this.toolRegistrations.get(toolName);
    if (!registration) {
      await this.sendError(message.id, -32602, `Unknown tool: ${toolName}`);
      return;
    }
    try {
      const result = await registration.handler(args);
      await this.sendResponse(message.id, result);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      await this.sendResponse(message.id, {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true
      });
    }
  }
  async handleResourceRead(message) {
    const params = message.params ?? {};
    const uri = params.uri;
    const resource = this.resources.find((r) => r.uri === uri);
    if (!resource) {
      await this.sendError(message.id, -32602, `Resource not found: ${uri}`);
      return;
    }
    await this.sendResponse(message.id, {
      contents: [{ uri, mimeType: resource.mimeType ?? "text/plain", text: "" }]
    });
  }
  async sendResponse(id, result) {
    if (id === void 0) return;
    const response = { jsonrpc: "2.0", id, result };
    await this.transport.send(response);
  }
  async sendError(id, code, message) {
    if (id === void 0) return;
    const response = {
      jsonrpc: "2.0",
      id,
      error: { code, message }
    };
    await this.transport.send(response);
  }
};

export { MCPServer };
//# sourceMappingURL=server.js.map
//# sourceMappingURL=server.js.map