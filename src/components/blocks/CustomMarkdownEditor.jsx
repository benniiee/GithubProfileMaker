import React from 'react';
import { Textarea } from '../ui/Primitives';
import { Sparkles } from 'lucide-react';

const SNIPPETS = [
  {
    name: 'GitHub Stats Card',
    snippet: `<p align="center">\n  <img src="https://github-stats-extended.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=radical" alt="GitHub Stats" />\n</p>`,
  },
  {
    name: 'Top Languages',
    snippet: `<p align="center">\n  <img src="https://github-stats-extended.vercel.app/api/top-langs?username=YOUR_USERNAME&layout=compact&theme=radical" alt="Top Languages" />\n</p>`,
  },
  {
    name: 'GitHub Streak',
    snippet: `<p align="center">\n  <img src="https://streak-stats.demolab.com/?user=YOUR_USERNAME&theme=radical" alt="GitHub Streak" />\n</p>`,
  },
];

export const CustomMarkdownEditor = ({ block, onUpdate }) => {
  const insertSnippet = (snippet) => {
    const current = block.content || '';
    onUpdate({
      content: current ? `${current}\n\n${snippet}` : snippet,
    });
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-muted/40 border">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-blue-500" /> Quick Snippets:
        </span>
        {SNIPPETS.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => insertSnippet(item.snippet)}
            className="px-2 py-1 rounded bg-background hover:bg-secondary text-[11px] font-medium border text-foreground transition-all cursor-pointer"
          >
            + {item.name}
          </button>
        ))}
      </div>

      <div>
        <label className="block font-medium mb-1 text-muted-foreground">Raw Markdown / HTML Content</label>
        <Textarea
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Write standard markdown or HTML..."
          rows={7}
          className="text-xs font-mono"
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Supports GitHub Flavored Markdown (GFM), HTML tables, alignment tags, and widgets.
        </p>
      </div>
    </div>
  );
};
