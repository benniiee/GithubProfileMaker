import React from 'react';
import { Input, Textarea, Button } from '../ui/Primitives';
import { generateId } from '../../lib/utils';
import { Plus, Trash2, GripVertical, ListFilter } from 'lucide-react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COMMON_PROMPTS = [
  { icon: '-', label: "I'm currently working on", defaultText: 'Open source web applications and developer tools' },
  { icon: '-', label: "I'm currently learning", defaultText: 'Distributed systems and backend architecture' },
  { icon: '-', label: 'Ask me about', defaultText: 'React, TypeScript, Cloud, UI/UX' },
  { icon: '-', label: 'Fun fact', defaultText: 'Always exploring new developer tools and workflows' },
  { icon: '-', label: 'How to reach me', defaultText: 'your-email@example.com' },
  { icon: '-', label: "I'm looking to collaborate on", defaultText: 'Exciting open source projects' },
];

const SortableRapidFireItem = React.memo(function SortableRapidFireItem({ item, onUpdate, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-background shadow-2xs hover:border-border/90 transition-colors group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 mt-1 shrink-0"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground">Bullet:</span>
            <Input
              value={item.icon || '-'}
              onChange={(e) => onUpdate({ icon: e.target.value })}
              placeholder="-"
              className="w-14 text-center font-mono text-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={item.label || ''}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Prompt Label (e.g. Ask me about)"
              className="text-sm font-semibold"
            />
          </div>
        </div>

        <div>
          <Input
            value={item.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Answer / Value..."
            className="text-sm"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0 mt-0.5"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
});

export const RapidFireBlockEditor = ({ block, onUpdate }) => {
  const addItem = (presetObj = null) => {
    const newItem = presetObj
      ? {
          id: generateId('rf'),
          icon: presetObj.icon,
          label: presetObj.label,
          text: presetObj.defaultText,
        }
      : {
          id: generateId('rf'),
          icon: '-',
          label: 'Topic',
          text: 'Details...',
        };

    onUpdate({
      items: [...(block.items || []), newItem],
    });
  };

  const updateItem = (itemId, updates) => {
    onUpdate({
      items: (block.items || []).map((it) => (it.id === itemId ? { ...it, ...updates } : it)),
    });
  };

  const removeItem = (itemId) => {
    onUpdate({
      items: (block.items || []).filter((it) => it.id !== itemId),
    });
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Intro Tagline */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Intro Headline / Tagline Statement
        </label>
        <Textarea
          value={block.tagline || ''}
          onChange={(e) => onUpdate({ tagline: e.target.value })}
          placeholder="Passionate fullstack developer creating robust and scalable web applications..."
          rows={3}
          className="text-sm leading-relaxed"
        />
      </div>

      {/* Quick Add Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-blue-500" /> Q&A Bullet Points
          </label>
          <Button variant="outline" size="sm" onClick={() => addItem()} className="text-xs sm:text-sm font-medium">
            <Plus className="w-4 h-4 mr-1" /> Add Custom Prompt
          </Button>
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2">
          <span className="text-xs font-semibold text-muted-foreground block">
            Add Prompt Preset:
          </span>
          <div className="flex flex-wrap gap-2">
            {COMMON_PROMPTS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => addItem(preset)}
                className="px-3 py-1.5 rounded-xl bg-background hover:bg-secondary text-xs sm:text-sm font-medium border border-border text-foreground flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:border-blue-500/40"
              >
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate max-w-[200px]">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sortable List */}
        <SortableContext
          items={(block.items || []).map((it) => it.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2.5">
            {(block.items || []).map((item) => (
              <SortableRapidFireItem
                key={item.id}
                item={item}
                onUpdate={(updates) => updateItem(item.id, updates)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
