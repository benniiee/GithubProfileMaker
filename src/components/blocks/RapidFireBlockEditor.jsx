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
      className="flex items-start gap-2 p-3 rounded-lg border bg-background shadow-2xs hover:border-border transition-colors group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 mt-1 shrink-0"
        title="Drag to reorder"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-medium text-muted-foreground">Bullet:</span>
            <Input
              value={item.icon || '-'}
              onChange={(e) => onUpdate({ icon: e.target.value })}
              placeholder="-"
              className="h-7 w-12 text-center text-xs font-mono"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={item.label || ''}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Prompt Label (e.g. Ask me about)"
              className="h-7 text-xs font-semibold"
            />
          </div>
        </div>

        <div>
          <Input
            value={item.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Answer / Value..."
            className="h-7.5 text-xs font-medium"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-7 w-7 text-muted-foreground hover:text-red-500 shrink-0 mt-0.5"
        title="Delete prompt"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
});

export const RapidFireBlockEditor = ({ block, onUpdate }) => {
  const addItem = (preset) => {
    const newItem = preset
      ? {
          id: generateId('rf'),
          icon: preset.icon || '-',
          label: preset.label,
          text: preset.defaultText,
        }
      : {
          id: generateId('rf'),
          icon: '-',
          label: 'Custom Prompt',
          text: '',
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
    <div className="space-y-4 text-xs">
      {/* Intro Tagline */}
      <div className="p-3.5 rounded-lg border bg-card space-y-1.5">
        <label className="block text-xs font-semibold text-foreground">
          Intro Headline / Tagline Statement
        </label>
        <Textarea
          value={block.tagline || ''}
          onChange={(e) => onUpdate({ tagline: e.target.value })}
          placeholder="Passionate fullstack developer creating robust and scalable web applications..."
          rows={3}
          className="text-xs leading-relaxed"
        />
      </div>

      {/* Quick Add Presets */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-blue-500" /> Q&A Bullet Points
          </label>
          <Button variant="outline" size="sm" onClick={() => addItem()} className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add Custom Prompt
          </Button>
        </div>

        <div className="p-2.5 rounded-lg bg-muted/40 border space-y-1.5">
          <span className="text-[11px] font-medium text-muted-foreground block">
            Add Prompt Preset:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PROMPTS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => addItem(preset)}
                className="px-2.5 py-1 rounded-md bg-background hover:bg-secondary text-[11px] font-medium border border-border text-foreground flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:border-blue-500/40"
              >
                <Plus className="w-3 h-3 text-muted-foreground" />
                <span className="truncate max-w-[180px]">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sortable List */}
        <SortableContext
          items={(block.items || []).map((it) => it.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
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
