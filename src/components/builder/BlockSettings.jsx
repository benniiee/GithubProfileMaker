import React, { useState, useRef, useEffect } from 'react';
import { Settings, AlignLeft, AlignCenter, AlignRight, Eye, EyeOff, Shield } from 'lucide-react';
import { Button, Input } from '../ui/Primitives';

export const BlockSettings = ({ block, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        title="Block Settings (Alignment, Header, Style)"
        className={`h-7 w-7 ${isOpen ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <Settings className="h-3.5 w-3.5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border bg-popover p-4 shadow-xl z-50 text-popover-foreground animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 mb-3 border-b">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Block Settings
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Header Title & Visibility */}
            {block.type !== 'hero' && (
              <div>
                <label className="block text-xs font-medium mb-1.5 text-foreground">
                  Section Header
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={block.title || ''}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Section Title"
                    className="h-8 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdate({ hideHeader: !block.hideHeader })}
                    title={block.hideHeader ? 'Header hidden in output' : 'Header visible in output'}
                    className={`h-8 w-8 shrink-0 ${block.hideHeader ? 'text-muted-foreground bg-muted' : 'text-blue-500'}`}
                  >
                    {block.hideHeader ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                {block.hideHeader && (
                  <p className="text-[10px] text-amber-500 mt-1">Header heading will be hidden in markdown.</p>
                )}
              </div>
            )}

            {/* Alignment */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-foreground">
                Block Content Alignment
              </label>
              <div className="grid grid-cols-3 gap-1 bg-muted/60 p-1 rounded-md">
                {['left', 'center', 'right'].map((align) => {
                  const isActive = block.alignment === align;
                  const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
                  return (
                    <button
                      key={align}
                      onClick={() => onUpdate({ alignment: align })}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium capitalize transition-all cursor-pointer ${
                        isActive
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {align}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badge Style */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-foreground flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Badge Style
              </label>
              <select
                value={block.badgeStyle || 'flat'}
                onChange={(e) => onUpdate({ badgeStyle: e.target.value })}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="flat">flat (Default)</option>
                <option value="for-the-badge">for-the-badge (Bold / Large)</option>
                <option value="plastic">plastic (Glossy)</option>
                <option value="flat-square">flat-square (Square edges)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

