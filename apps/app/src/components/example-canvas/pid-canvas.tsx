"use client";

import { useCallback } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "@/components/generative-ui/pid-diagram";

type PIDNodeType = "tank" | "pump" | "heat_exchanger" | "valve";

function toFlowNodes(pidNodes: any[] = []): Node[] {
  return pidNodes.map((n) => ({
    id: n.id,
    type: n.type as PIDNodeType,
    position: n.position ?? { x: 0, y: 0 },
    data: { label: n.label },
  }));
}

function toFlowEdges(pidEdges: any[] = []): Edge[] {
  return pidEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: "#6b7280", strokeWidth: 2 },
    labelStyle: { fontSize: 10, fill: "#6b7280" },
  }));
}

// Inner component — remounts via key when agent sets a new diagram,
// so useNodesState always initializes with fresh data.
function PIDFlow({ pid, onNodesUpdate }: { pid: any; onNodesUpdate: (nodes: Node[]) => void }) {
  const [nodes, , onNodesChange] = useNodesState(toFlowNodes(pid.nodes));
  const [edges, , onEdgesChange] = useEdgesState(toFlowEdges(pid.edges ?? []));

  // Use `nodes` from state (all nodes with updated positions), not the third param
  // which is only the dragged subset.
  const onNodeDragStop = useCallback(() => {
    onNodesUpdate(nodes);
  }, [onNodesUpdate, nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDragStop={onNodeDragStop}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={20} color="#e5e7eb" />
      <Controls />
      <MiniMap
        nodeColor={(n) => {
          const colors: Record<string, string> = {
            tank: "#1d4ed8",
            pump: "#15803d",
            heat_exchanger: "#c2410c",
            valve: "#b91c1c",
          };
          return colors[n.type ?? ""] ?? "#6b7280";
        }}
        maskColor="rgba(0,0,0,0.05)"
      />
    </ReactFlow>
  );
}

export function PIDCanvas() {
  const { agent } = useAgent();
  const agentPid = agent.state?.pid;

  const handleNodesUpdate = useCallback(
    (nodes: Node[]) => {
      if (!agentPid) return;
      agent.setState({
        pid: {
          ...agentPid,
          nodes: nodes.map((n) => ({
            id: n.id,
            type: n.type as PIDNodeType,
            label: String(n.data.label),
            position: n.position,
          })),
        },
      });
    },
    [agentPid, agent]
  );

  const layoutStyles =
    "h-full relative bg-white dark:bg-neutral-950 [background-image:radial-gradient(circle,#d5d5d5_1px,transparent_1px)] dark:[background-image:radial-gradient(circle,#333_1px,transparent_1px)] [background-size:20px_20px]";

  if (!agentPid || !agentPid.nodes?.length) {
    return (
      <div className={`${layoutStyles} flex items-center justify-center`}>
        <div className="text-center text-neutral-400 dark:text-neutral-600">
          <div className="text-5xl mb-3">⚙️</div>
          <p className="text-sm">Ask the agent to generate a P&amp;ID diagram</p>
          <p className="text-xs mt-1 opacity-60">e.g. "Show me a cooling water loop"</p>
        </div>
      </div>
    );
  }

  // Key changes when agent sets a new/updated diagram → PIDFlow remounts with fresh data
  const flowKey = `${agentPid.title}-${agentPid.nodes.length}`;

  return (
    <div className={layoutStyles}>
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
          {agentPid.title}
        </h2>
        {agentPid.description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {agentPid.description}
          </p>
        )}
      </div>

      <PIDFlow key={flowKey} pid={agentPid} onNodesUpdate={handleNodesUpdate} />
    </div>
  );
}
