import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

// Excalidraw MCP disabled for P&ID demo — re-enable for "Open Generative UI" examples
export const aguiMiddleware = [
  // new MCPAppsMiddleware({
  //   mcpServers: [
  //     {
  //       type: "http",
  //       url: process.env.MCP_SERVER_URL || "https://mcp.excalidraw.com",
  //       serverId: "example_mcp_app",
  //     },
  //   ],
  // }),
];
