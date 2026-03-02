from langchain.tools import ToolRuntime, tool
from langchain.messages import ToolMessage
from langgraph.types import Command
from typing import TypedDict, Literal, Optional
import uuid


class PIDPosition(TypedDict):
    x: float
    y: float


class PIDNode(TypedDict):
    id: str
    type: Literal["tank", "pump", "heat_exchanger", "valve"]
    label: str
    position: PIDPosition


class PIDEdge(TypedDict):
    id: str
    source: str
    target: str
    label: Optional[str]


class PIDDiagramState(TypedDict):
    title: str
    description: str
    nodes: list[PIDNode]
    edges: list[PIDEdge]


@tool
def manage_pid(diagram: PIDDiagramState, runtime: ToolRuntime) -> Command:
    """
    Create or update the P&ID (Piping & Instrumentation Diagram) shown in the canvas.
    Assign positions left-to-right if not specified (x = index * 220 + 40, y = 150).
    Node types: "tank", "pump", "heat_exchanger", "valve".
    """
    nodes = diagram.get("nodes", [])

    for i, node in enumerate(nodes):
        if "id" not in node or not node["id"]:
            node["id"] = str(uuid.uuid4())
        if "position" not in node or not node["position"]:
            node["position"] = {"x": i * 220 + 40, "y": 150}

    return Command(update={
        "pid": diagram,
        "messages": [
            ToolMessage(
                content="Successfully updated P&ID diagram",
                tool_call_id=runtime.tool_call_id
            )
        ]
    })


pid_tools = [manage_pid]
