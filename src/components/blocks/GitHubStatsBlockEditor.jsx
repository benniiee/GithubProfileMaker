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
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl border bg-card">
        <div>
          <label className="block font-semibold mb-1.5 text-foreground flex items-center gap-1.5 text-sm">
            <BarChart3 className="w-4 h-4 text-blue-500" /> GitHub Username
          </label>
          <Input
            value={block.username || ''}
            onChange={(e) => onUpdate({ username: e.target.value })}
            placeholder="e.g. your-username"
            className="font-mono text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1.5 text-foreground flex items-center gap-1.5 text-sm">
            <Palette className="w-4 h-4 text-blue-500" /> Card Color Theme
          </label>
          <select
            value={block.theme || 'default'}
            onChange={(e) => onUpdate({ theme: e.target.value })}
            className="w-full h-9.5 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary"
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
      <div className="space-y-2.5 p-3.5 rounded-2xl border bg-muted/20">
        <label className="block font-semibold text-foreground text-sm">Display Cards & Widgets</label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Main Stats Card */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-background hover:bg-muted/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={block.showStatsCard !== false}
              onChange={(e) => onUpdate({ showStatsCard: e.target.checked })}
              className="rounded border-input text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 mt-0.5"
            />
            <div>
              <div className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                <BarChart3 className="w-4 h-4 text-blue-500" /> Stats Card
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Stars, commits, PRs, issues</p>
            </div>
          </label>

          {/* Top Languages */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-background hover:bg-muted/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={block.showTopLangs !== false}
              onChange={(e) => onUpdate({ showTopLangs: e.target.checked })}
              className="rounded border-input text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 mt-0.5"
            />
            <div>
              <div className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                <Code className="w-4 h-4 text-blue-500" /> Top Languages
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Most frequently used languages</p>
            </div>
          </label>

          {/* Streak Stats */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-background hover:bg-muted/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={block.showStreakCard !== false}
              onChange={(e) => onUpdate({ showStreakCard: e.target.checked })}
              className="rounded border-input text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 mt-0.5"
            />
            <div>
              <div className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                <Flame className="w-4 h-4 text-amber-500" /> Streak Stats
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Current & longest streak</p>
            </div>
          </label>
        </div>
      </div>

      {/* Card Width */}
      <div className="p-3.5 rounded-2xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-foreground text-sm">Card Layout Width</span>
          <p className="text-xs text-muted-foreground">Adjust width percentage for side-by-side or stacked cards</p>
        </div>
        <div className="flex rounded-xl border bg-muted/40 p-0.5">
          {['48%', '80%', '100%'].map((w) => (
            <button
              key={w}
              onClick={() => onUpdate({ cardWidth: w })}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
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
