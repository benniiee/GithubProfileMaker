import React, { useState } from 'react';
import { useProfile } from '../../store/profileStore';
import { Button } from '../ui/Primitives';
import { ConfirmDialog } from '../ui/Modal';
import {
  Github,
  Copy,
  Download,
  RotateCcw,
  Sun,
  Moon,
  Check,
  Layers,
} from 'lucide-react';
import { getPresetTemplates } from '../../lib/defaultState';

export const Header = ({ darkMode, onToggleDarkMode }) => {
  const { compiledMarkdown, resetToDefault, setBlocks } = useProfile();
  const [copied, setCopied] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiledMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([compiledMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadPreset = (key) => {
    const presets = getPresetTemplates();
    if (presets[key]) {
      setBlocks(presets[key].blocks);
      setShowPresetsMenu(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 w-full">
          {/* Left: Branding */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm shrink-0">
              <Github className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold tracking-tight text-foreground leading-tight">
                README Builder
              </span>
              <span className="text-xs text-muted-foreground leading-tight mt-0.5 hidden sm:block tracking-wide">
                GitHub Profile Generator
              </span>
            </div>

            {/* Tech strip */}
            <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-border/60">
              {[
                { label: 'React', color: '61DAFB', logo: 'react' },
                { label: 'Vite', color: '646CFF', logo: 'vite' },
                { label: 'Tailwind', color: '38B2AC', logo: 'tailwind-css' },
              ].map((tech) => (
                <img
                  key={tech.label}
                  src={`https://img.shields.io/badge/${tech.label}-${tech.color}?style=flat-square&logo=${tech.logo}&logoColor=white`}
                  alt={tech.label}
                  className="h-4.5 opacity-70 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Right: Categorized Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Group 1: Templates */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                className="text-xs sm:text-sm font-medium"
              >
                <Layers className="w-4 h-4 mr-1 text-muted-foreground" />
                <span>Templates</span>
              </Button>

              {showPresetsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPresetsMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 p-2 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 text-sm space-y-1 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Starter Templates
                    </div>
                    {Object.entries(getPresetTemplates()).map(([key, template]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleLoadPreset(key)}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer group"
                      >
                        <div className="font-semibold text-sm text-foreground tracking-tight">
                          {template.label}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                          {template.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Separator */}
            <div className="h-5 w-px bg-border/80 hidden sm:block" />

            {/* Group 2: View Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowResetConfirm(true)}
                title="Reset to default template"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>

            {/* Separator */}
            <div className="h-5 w-px bg-border/80 hidden sm:block" />

            {/* Group 3: Primary Export Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant={copied ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleCopy}
                className="text-xs sm:text-sm font-medium transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-foreground font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden md:inline">Copy markdown</span>
                  </>
                )}
              </Button>

              <Button
                variant="lime"
                size="sm"
                onClick={handleDownload}
                className="text-xs sm:text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download README.md</span>
                <span className="sm:hidden">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Custom Reset Confirmation Modal */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => resetToDefault()}
        title="Reset Profile Template"
        message="Are you sure you want to reset all blocks to the starter template? All current customization will be replaced."
        confirmText="Reset to Default"
        isDestructive={true}
      />
    </>
  );
};
