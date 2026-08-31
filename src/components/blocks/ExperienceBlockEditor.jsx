import React, { useState } from 'react';
import { Input, Button } from '../ui/Primitives';
import { generateId } from '../../lib/utils';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Briefcase, MapPin, Calendar, Globe } from 'lucide-react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExperienceItem = React.memo(function SortableExperienceItem({ item, onUpdate, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newBulletText, setNewBulletText] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const addBullet = () => {
    if (!newBulletText.trim()) return;
    onUpdate({ bullets: [...(item.bullets || []), newBulletText.trim()] });
    setNewBulletText('');
  };

  const removeBullet = (index) => {
    const next = [...(item.bullets || [])];
    next.splice(index, 1);
    onUpdate({ bullets: next });
  };

  const updateBullet = (index, val) => {
    const next = [...(item.bullets || [])];
    next[index] = val;
    onUpdate({ bullets: next });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border bg-card shadow-2xs overflow-hidden transition-all"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-2.5 bg-muted/30 border-b gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 shrink-0"
            title="Drag to reorder position"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="truncate text-xs font-semibold">
            <span>{item.role || 'Job Position'}</span>
            {item.company && <span className="text-muted-foreground font-normal"> @ {item.company}</span>}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {item.dates && (
            <span className="text-[11px] text-muted-foreground font-mono hidden md:inline px-1.5 py-0.5 rounded bg-muted/60">
              {item.dates}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 text-muted-foreground"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-7 w-7 text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Expanded Details Form */}
      {isExpanded && (
        <div className="p-3.5 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium mb-1 text-muted-foreground">Job Title / Role</label>
              <Input
                value={item.role || ''}
                onChange={(e) => onUpdate({ role: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="h-8 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-muted-foreground">Company / Organization</label>
              <Input
                value={item.company || ''}
                onChange={(e) => onUpdate({ company: e.target.value })}
                placeholder="e.g. Google"
                className="h-8 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-medium mb-1 text-muted-foreground flex items-center gap-1">
                <Globe className="w-3 h-3 text-blue-500" /> Company Website URL
              </label>
              <Input
                value={item.companyUrl || ''}
                onChange={(e) => onUpdate({ companyUrl: e.target.value })}
                placeholder="https://company.com"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-500" /> Dates / Period
              </label>
              <Input
                value={item.dates || ''}
                onChange={(e) => onUpdate({ dates: e.target.value })}
                placeholder="2022 - Present"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500" /> Location
              </label>
              <Input
                value={item.location || ''}
                onChange={(e) => onUpdate({ location: e.target.value })}
                placeholder="San Francisco, CA / Remote"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-muted-foreground">Overview Summary</label>
            <Input
              value={item.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Brief 1-sentence team or role context..."
              className="h-8 text-xs"
            />
          </div>

          {/* Bullet Points */}
          <div className="space-y-2 pt-2 border-t">
            <label className="block font-medium text-foreground">Key Accomplishments & Bullet Points</label>
            <div className="space-y-1.5">
              {(item.bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <Input
                    value={bullet}
                    onChange={(e) => updateBullet(idx, e.target.value)}
                    className="h-7 text-xs flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBullet(idx)}
                    className="h-7 w-7 text-muted-foreground hover:text-red-500 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <Input
                  value={newBulletText}
                  onChange={(e) => setNewBulletText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBullet();
                    }
                  }}
                  placeholder="Add bullet point (e.g. Scaled database throughput by 200%)"
                  className="h-7 text-xs flex-1"
                />
                <Button variant="outline" size="sm" onClick={addBullet} className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add Bullet
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const ExperienceBlockEditor = ({ block, onUpdate }) => {
  const addExperienceItem = () => {
    const newItem = {
      id: generateId('exp'),
      role: 'Staff Engineer',
      company: 'Tech Company',
      companyUrl: 'https://example.com',
      dates: '2023 - Present',
      location: 'Remote',
      description: 'Leading engineering initiatives and system design.',
      bullets: ['Improved architecture reliability', 'Built key user-facing features'],
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
    <div className="space-y-3.5 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          Chronological roles compiled into a clean markdown timeline.
        </span>
        <Button variant="outline" size="sm" onClick={addExperienceItem} className="h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add Position
        </Button>
      </div>

      <SortableContext items={(block.items || []).map((it) => it.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {(block.items || []).map((item) => (
            <SortableExperienceItem
              key={item.id}
              item={item}
              onUpdate={(updates) => updateItem(item.id, updates)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
