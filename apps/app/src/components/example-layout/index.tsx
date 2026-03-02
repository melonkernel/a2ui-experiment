"use client";

import { ReactNode, useState } from "react";
import { ModeToggle, type AppMode } from "./mode-toggle";
import { useFrontendTool } from "@copilotkit/react-core";

interface ExampleLayoutProps {
  chatContent: ReactNode;
  canvases: {
    todos: ReactNode;
    pid: ReactNode;
  };
}

export function ExampleLayout({ chatContent, canvases }: ExampleLayoutProps) {
  const [mode, setMode] = useState<AppMode>('chat');

  useFrontendTool({
    name: "enableAppMode",
    description: "Open the tasks/todos canvas.",
    handler: async () => {
      setMode('todos');
    },
  });

  useFrontendTool({
    name: "enablePIDMode",
    description: "Open the P&ID diagram canvas.",
    handler: async () => {
      setMode('pid');
    },
  });

  useFrontendTool({
    name: "enableChatMode",
    description: "Switch back to chat-only mode.",
    handler: async () => {
      setMode('chat');
    },
  });

  const isAppMode = mode !== 'chat';
  const activeCanvas = mode === 'todos' ? canvases.todos : mode === 'pid' ? canvases.pid : null;

  return (
    <div className="h-full flex flex-row">
      <ModeToggle mode={mode} onModeChange={setMode} />

      {/* Chat */}
      <div
        className={`max-h-full overflow-y-auto ${
          isAppMode
            ? 'w-1/3 px-6 max-lg:hidden'
            : 'flex-1 max-lg:px-4'
        }`}
      >
        {chatContent}
      </div>

      {/* Canvas panel */}
      <div
        className={`h-full overflow-hidden ${
          isAppMode
            ? 'w-2/3 max-lg:w-full border-l border-zinc-200 dark:border-zinc-700 max-lg:border-l-0'
            : 'w-0 border-l-0'
        }`}
      >
        <div className="w-full lg:w-[66.666vw] h-full">
          {activeCanvas}
        </div>
      </div>
    </div>
  );
}
