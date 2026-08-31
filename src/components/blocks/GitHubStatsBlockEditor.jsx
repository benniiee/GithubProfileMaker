import React from 'react';
import { Input } from '../ui/Primitives';
import { BarChart3, Palette, Flame, Code } from 'lucide-react';

const STATS_THEMES = [
  { id: 'default', label: 'Default Light' },
  { id: 'radical', label: 'Radical (Dark/Neon)' },
  { id: 'tokyonight', label: 'Tokyo Night' },
  { id: 'dracula', label: 'Dracula' },
  { id: 'github_dark', label: 'GitHub Dark' },
  { id: 'nord', label: 'Nord' },
  { id: 'ocean_dark', label: 'Ocean Dark' },
  { id: 'gruvbox', label: 'Gruvbox' },
  { id: 'synthwave', label: 'Synthwave' },
  { id: 'highcontrast', label: 'High Contrast' },
];

export const GitHubStatsBlockEditor = ({ block, onUpdate }) => {
  const username = block.username || 'your-username';
  const theme = block.theme || 'default';

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg border bg-card">
        <div>
          <label className="block font-medium mb-1 text-foreground flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-500" /> GitHub Username
          </label>
          <Input
            value={block.username || ''}
            onChange={(e) => onUpdate({ username: e.target.value })}
            placeholder="e.g. your-username"
            className="h-8 text-xs font-mono font-semibold"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-foreground flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-500" /> Card Color Theme
          </label>
          <select
            value={block.theme || 'default'}
            onChange={(e) => onUpdate({ theme: e.target.value })}
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            {STATS_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Card Toggles */}
      <div className="space-y-2 p-3 rounded-lg border bg-muted/20">
        <label className="block font-medium text-foreground mb-2">Display Cards & Widgets</label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Main Stats Card */}
          <label className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-muted/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={block.showStatsCard !== false}
              onChange={(e) => onUpdate({ showStatsCard: e.target.checked })}
              className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="font-semibold text-foreground flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-blue-500" /> Stats Card
              </div>
              <p className="text-[10px] text-muted-foreground">Stars, commits, PRs, issues</p>
            </div>
          </label>

          {/* Top Languages */}
          <label className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-muted/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={block.showTopLangs !== false}
              onChange={(e) => onUpdate({ showTopLangs: e.target.checked })}
              className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="font-semibold text-foreground flex items-center gap-1">
                <Code className="w-3 h-3 text-blue-500" /> Top Languages
              </div>
              <p className="text-[10px] text-muted-foreground">Most frequently used languages</p>
            </div>
          </label>

          {/* Streak Stats */}
          <label className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-muted/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={block.showStreakCard !== false}
              onChange={(e) => onUpdate({ showStreakCard: e.target.checked })}
              className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="font-semibold text-foreground flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> Streak Stats
              </div>
              <p className="text-[10px] text-muted-foreground">Current & longest streak</p>
            </div>
          </label>
        </div>
      </div>

      {/* Card Width */}
      <div className="p-3 rounded-lg border bg-card flex items-center justify-between gap-3">
        <div>
          <span className="font-medium text-foreground">Card Layout Width</span>
          <p className="text-[10px] text-muted-foreground">Adjust width percentage for side-by-side or stacked cards</p>
        </div>
        <div className="flex rounded-md border bg-muted/40 p-0.5">
          {['48%', '80%', '100%'].map((w) => (
            <button
              key={w}
              onClick={() => onUpdate({ cardWidth: w })}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                (block.cardWidth || '48%') === w ? 'bg-background shadow-xs font-bold text-foreground' : 'text-muted-foreground'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
