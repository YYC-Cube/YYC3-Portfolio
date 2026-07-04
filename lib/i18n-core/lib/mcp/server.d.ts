interface MCPMessage {
    jsonrpc: "2.0";
    id?: string | number;
    method?: string;
    params?: Record<string, unknown>;
    result?: unknown;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}
interface MCPTool {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: Record<string, {
            type: string;
            description?: string;
            enum?: string[];
        }>;
        required?: string[];
    };
}
interface MCPResource {
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
}
interface MCPTransport {
    connected: boolean;
    connect(): Promise<void>;
    send(message: MCPMessage): Promise<void>;
    onMessage(handler: (message: MCPMessage) => void): void;
    close(): Promise<void>;
}
interface MCPServerConfig {
    name: string;
    version: string;
    transport: MCPTransport;
    capabilities?: {
        tools?: boolean;
        resources?: boolean;
        prompts?: boolean;
    };
}
interface MCPToolResult {
    content: Array<{
        type: "text" | "image" | "resource";
        text?: string;
        data?: string;
        mimeType?: string;
    }>;
    isError?: boolean;
}

type ToolHandler = (args: Record<string, unknown>) => Promise<MCPToolResult>;
interface MCPToolRegistration {
    tool: MCPTool;
    handler: ToolHandler;
}
declare class MCPServer {
    private config;
    private transport;
    private toolRegistrations;
    private resources;
    private isRunning;
    private onDisconnect?;
    constructor(config: MCPServerConfig);
    registerTool(tool: MCPTool, handler: ToolHandler): void;
    registerResource(resource: MCPResource): void;
    getTools(): MCPTool[];
    getResources(): MCPResource[];
    start(): Promise<void>;
    stop(): Promise<void>;
    /** Check if server is running and transport is connected */
    get connected(): boolean;
    /** Attempt to reconnect the transport */
    reconnect(): Promise<void>;
    /** Handle transport disconnect detected externally */
    handleDisconnect(): void;
    private handleMessage;
    private handleInitialize;
    private handleToolCall;
    private handleResourceRead;
    private sendResponse;
    private sendError;
}

export { MCPServer, type MCPToolRegistration, type ToolHandler };
