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
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Left: Branding */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs shrink-0">
              <Github className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
                  README Builder
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Presets Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                className="text-xs"
              >
                <Layers className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <span>Templates</span>
              </Button>

              {showPresetsMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 p-2 rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 text-xs space-y-1 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Load Starter Template
                  </div>
                  {Object.entries(getPresetTemplates()).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleLoadPreset(key)}
                      className="w-full text-left p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="font-semibold text-xs text-foreground">
                        {template.label}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                        {template.desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset State — Opens Custom Modal */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowResetConfirm(true)}
              title="Reset to default template"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>

            {/* Copy Markdown */}
            <Button
              variant={copied ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleCopy}
              className="text-xs transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-foreground font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Copy markdown</span>
                </>
              )}
            </Button>

            {/* Download README.md */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download README.md</span>
              <span className="sm:hidden">Download</span>
            </Button>
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
