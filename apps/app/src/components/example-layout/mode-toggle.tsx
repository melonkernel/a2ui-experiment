export type AppMode = 'chat' | 'todos' | 'pid';

interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const tabs: { id: AppMode; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'todos', label: 'Tasks' },
  { id: 'pid', label: 'P&ID' },
];

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex rounded-full border border-neutral-300 bg-neutral-200 p-0.5 max-lg:top-2 max-lg:right-2 max-lg:scale-90 dark:border-neutral-700 dark:bg-neutral-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onModeChange(tab.id)}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
            mode === tab.id
              ? 'bg-white text-neutral-900 shadow-sm dark:bg-stone-900 dark:text-white'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
