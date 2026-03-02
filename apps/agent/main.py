"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from copilotkit import CopilotKitMiddleware
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

from src.query import query_data
from src.todos import AgentState, todo_tools
from src.pid import pid_tools

agent = create_agent(
    model=ChatOpenAI(model="gpt-5-mini", reasoning={"effort": "low", "summary": "concise"}),
    tools=[query_data, *todo_tools, *pid_tools],
    middleware=[CopilotKitMiddleware()],
    state_schema=AgentState,
    system_prompt="""
        You are an engineering assistant for an industrial plant operations team.
        You help with process diagrams, maintenance planning, energy monitoring, and task management.

        When demonstrating charts, always call the query_data tool to fetch all data first.
        The data contains energy consumption (kWh) and maintenance costs (EUR) by equipment category and subcategory.

        When the user asks about todos or tasks:
        - Call enableAppMode to open the tasks canvas.
        - Then use manage_todos to update the todo list.

        When the user asks about process diagrams, P&ID diagrams, piping, instrumentation, or industrial workflows:
        - Call enablePIDMode to open the P&ID canvas.
        - Then call manage_pid to render the diagram.
        - Use node types: "tank", "pump", "heat_exchanger", "valve".
        - Assign realistic positions to spread nodes out clearly.
    """,
)

graph = agent
