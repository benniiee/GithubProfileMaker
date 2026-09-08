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
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
          <Sparkles className="w-4 h-4 text-blue-500" /> Quick Snippets:
        </span>
        {SNIPPETS.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => insertSnippet(item.snippet)}
            className="px-3 py-1 rounded-lg bg-background hover:bg-secondary text-xs sm:text-sm font-medium border border-border text-foreground transition-all cursor-pointer shadow-2xs"
          >
            + {item.name}
          </button>
        ))}
      </div>

      <div>
        <label className="block font-semibold mb-1.5 text-foreground text-sm">Raw Markdown / HTML Content</label>
        <Textarea
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Write standard markdown or HTML..."
          rows={8}
          className="text-sm font-mono leading-relaxed"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Supports GitHub Flavored Markdown (GFM), HTML tables, alignment tags, and widgets.
        </p>
      </div>
    </div>
  );
};
