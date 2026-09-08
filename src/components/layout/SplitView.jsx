import React, { useState } from 'react';
import { DndBuilder } from '../builder/DndBuilder';
import { LivePreview } from '../preview/LivePreview';
import { RawMarkdownView } from '../preview/RawMarkdownView';
import { useProfile } from '../../store/profileStore';
import { Eye, Code2, LayoutDashboard, Copy, Check, ShieldCheck } from 'lucide-react';
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden mb-5 p-1 rounded-2xl bg-muted/60 border border-border/80">
        <button
          type="button"
          onClick={() => setMobileTab('builder')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileTab === 'builder' ? 'bg-background shadow-2xs text-foreground' : 'text-muted-foreground'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Block Builder
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileTab === 'preview' ? 'bg-background shadow-2xs text-foreground' : 'text-muted-foreground'
          }`}
        >
          <Eye className="w-4 h-4" /> Live Preview
        </button>
      </div>

      {/* Main Dual Pane Grid — Accommodating Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
        {/* Left Pane: Block Builder */}
        <div
          className={`md:col-span-6 lg:col-span-6 min-w-0 ${
            mobileTab === 'builder' ? 'block' : 'hidden md:block'
          }`}
        >
          <DndBuilder />
        </div>

        {/* Right Pane: Live Rendered Preview & Raw Code */}
        <div
          className={`md:col-span-6 lg:col-span-6 min-w-0 space-y-3.5 md:sticky md:top-20 ${
            mobileTab === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 shadow-2xs">
            {/* Categorized Segment Switcher */}
            <div className="flex rounded-xl border border-border/60 bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setActivePreviewTab('rendered')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  activePreviewTab === 'rendered'
                    ? 'bg-background font-semibold text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="w-4 h-4 text-blue-500" />
                <span>Rendered Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('raw')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  activePreviewTab === 'raw'
                    ? 'bg-background font-semibold text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Code2 className="w-4 h-4 text-blue-500" />
                <span>Raw Markdown</span>
              </button>
            </div>

            {/* Quick Metrics & Copy */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-muted-foreground font-mono hidden lg:inline px-2.5 py-1 rounded-lg bg-muted/50">
                {lineCount} lines &bull; {charCount} chars
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="h-8 text-xs font-medium"
                title="Copy markdown to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Preview Container Card with Status Bar */}
          <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col">
            {/* Scrollable Preview Area */}
            <div className="overflow-y-auto max-h-[calc(100vh-190px)] min-h-[480px]">
              {activePreviewTab === 'rendered' ? (
                <LivePreview markdown={compiledMarkdown} />
              ) : (
                <RawMarkdownView markdown={compiledMarkdown} />
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60 bg-muted/30 text-xs text-muted-foreground select-none">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium text-foreground">Real-time GFM Preview</span>
                <span>&bull;</span>
                <span className="font-mono">{lineCount} lines</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="hidden sm:inline">GitHub Flavored Markdown Compliant</span>
                <span className="sm:hidden">GFM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
