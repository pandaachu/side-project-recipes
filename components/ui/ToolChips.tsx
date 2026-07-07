interface ToolChipsProps {
  tools: string[];
  max?: number;
}

// Cooking equipment chips; collapses overflow into a "+N" counter
export default function ToolChips({ tools, max = 2 }: ToolChipsProps) {
  if (!tools || tools.length === 0) return null;

  const visible = tools.slice(0, max);
  const overflow = tools.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((tool) => (
        <span key={tool} className="bg-[#F5F5F5] px-2.5 py-1 text-[11px] tracking-[0.5px] text-[#616161]">
          {tool}
        </span>
      ))}
      {overflow > 0 && <span className="text-[11px] text-[#9E9E9E]">+{overflow}</span>}
    </div>
  );
}
