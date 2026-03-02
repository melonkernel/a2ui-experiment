"use client";

import { z } from "zod";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ─── Zod schema ───────────────────────────────────────────────────────────────

export const PIDDiagramProps = z.object({
  title: z.string().describe("Diagram title"),
  description: z.string().describe("Brief description of the process"),
  nodes: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["tank", "pump", "heat_exchanger", "valve"]),
        label: z.string(),
      })
    )
    .describe("Equipment nodes in the P&ID diagram"),
  edges: z
    .array(
      z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
        label: z.string().optional(),
      })
    )
    .optional()
    .describe("Pipe connections between equipment"),
});

type PIDDiagramProps = z.infer<typeof PIDDiagramProps>;

// ─── Custom node types ─────────────────────────────────────────────────────────

function TankNode({ data }: NodeProps) {
  return (
    <div
      style={{
        width: 90,
        height: 80,
        background: "#1d4ed8",
        border: "2px solid #1e40af",
        borderRadius: "4px 4px 0 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 11,
        fontWeight: 600,
        position: "relative",
      }}
    >
      {/* Rounded top cap */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: -2,
          right: -2,
          height: 18,
          background: "#1d4ed8",
          border: "2px solid #1e40af",
          borderRadius: "50% 50% 0 0",
        }}
      />
      <span style={{ marginTop: 8 }}>{String(data.label)}</span>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

function PumpNode({ data }: NodeProps) {
  return (
    <div
      style={{
        width: 70,
        height: 70,
        background: "#15803d",
        border: "2px solid #166534",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 11,
        fontWeight: 600,
        textAlign: "center",
        padding: 4,
      }}
    >
      {String(data.label)}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

function HeatExchangerNode({ data }: NodeProps) {
  return (
    <div
      style={{
        width: 100,
        height: 60,
        background: "#c2410c",
        border: "2px solid #9a3412",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 10,
        fontWeight: 600,
        textAlign: "center",
        gap: 2,
      }}
    >
      <span style={{ fontSize: 9, opacity: 0.85 }}>HX</span>
      <span>{String(data.label)}</span>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

function ValveNode({ data }: NodeProps) {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Bowtie shape via two triangles via clip-path */}
      <div
        style={{
          width: 56,
          height: 56,
          background: "#b91c1c",
          clipPath: "polygon(0% 15%, 50% 50%, 0% 85%, 100% 85%, 50% 50%, 100% 15%)",
        }}
      />
      <span
        style={{
          position: "absolute",
          color: "white",
          fontSize: 9,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: 48,
        }}
      >
        {String(data.label)}
      </span>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

export const nodeTypes = {
  tank: TankNode,
  pump: PumpNode,
  heat_exchanger: HeatExchangerNode,
  valve: ValveNode,
};

// ─── Main component ────────────────────────────────────────────────────────────

export function PIDDiagram({ title, description, nodes, edges }: PIDDiagramProps) {
  if (!nodes || nodes.length === 0 || !edges) {
    return (
      <div className="rounded-xl border dark:border-zinc-700 shadow-sm p-6 max-w-2xl mx-auto my-6 bg-[var(--background)]">
        <h3 className="text-xl font-bold dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{description}</p>
        <p className="text-gray-400 text-center py-8">No diagram data available</p>
      </div>
    );
  }

  // Auto-layout: spread nodes left-to-right
  const flowNodes: Node[] = nodes.map((n, i) => ({
    id: n.id,
    type: n.type,
    position: { x: i * 220 + 40, y: 120 },
    data: { label: n.label },
  }));

  const flowEdges: Edge[] = (edges ?? []).map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: "#6b7280", strokeWidth: 2 },
    labelStyle: { fontSize: 10, fill: "#6b7280" },
  }));

  const canvasWidth = nodes.length * 220 + 80;

  return (
    <div className="rounded-xl border dark:border-zinc-700 shadow-sm p-4 max-w-3xl mx-auto my-6 bg-[var(--background)]">
      <div className="mb-3">
        <h3 className="text-xl font-bold dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-zinc-400">{description}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        {[
          { color: "#1d4ed8", label: "Tank" },
          { color: "#15803d", label: "Pump" },
          { color: "#c2410c", label: "Heat Exchanger" },
          { color: "#b91c1c", label: "Valve" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="dark:text-zinc-300">{label}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 300, minWidth: Math.min(canvasWidth, 700) }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} color="#e5e7eb" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
