import React, { useState } from 'react';
import { DndBuilder } from '../builder/DndBuilder';
import { LivePreview } from '../preview/LivePreview';
import { RawMarkdownView } from '../preview/RawMarkdownView';
import { useProfile } from '../../store/profileStore';
import { Eye, Code2, LayoutDashboard, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Primitives';

export const SplitView = () => {
  const { compiledMarkdown } = useProfile();
  const [activePreviewTab, setActivePreviewTab] = useState('rendered');
  const [mobileTab, setMobileTab] = useState('builder');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(compiledMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const lineCount = (compiledMarkdown || '').split('\n').length;
  const charCount = (compiledMarkdown || '').length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden mb-4 p-1 rounded-xl bg-muted/60 border border-border">
        <button
          type="button"
          onClick={() => setMobileTab('builder')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'builder' ? 'bg-background shadow-2xs text-foreground' : 'text-muted-foreground'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Block Builder
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'preview' ? 'bg-background shadow-2xs text-foreground' : 'text-muted-foreground'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Live Preview
        </button>
      </div>

      {/* Main Dual Pane Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Pane: Block Builder */}
        <div
          className={`md:col-span-6 lg:col-span-5 min-w-0 ${
            mobileTab === 'builder' ? 'block' : 'hidden md:block'
          }`}
        >
          <DndBuilder />
        </div>

        {/* Right Pane: Live Rendered Preview & Raw Code */}
        <div
          className={`md:col-span-6 lg:col-span-7 min-w-0 space-y-3 md:sticky md:top-16 ${
            mobileTab === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-card/80 backdrop-blur-xs border border-border shadow-2xs">
            <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setActivePreviewTab('rendered')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activePreviewTab === 'rendered'
                    ? 'bg-background font-semibold text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Rendered</span> GitHub View
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('raw')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activePreviewTab === 'raw'
                    ? 'bg-background font-semibold text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Raw Markdown</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-mono hidden lg:inline px-2 py-0.5 rounded bg-muted/50">
                {lineCount}L &bull; {charCount}C
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="h-7 text-xs"
                title="Copy markdown to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-green-500 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Preview Scrollable Window */}
          <div className="overflow-y-auto max-h-[calc(100vh-130px)] rounded-xl border border-border bg-card shadow-xs">
            {activePreviewTab === 'rendered' ? (
              <LivePreview markdown={compiledMarkdown} />
            ) : (
              <RawMarkdownView markdown={compiledMarkdown} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
