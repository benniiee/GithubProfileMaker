import React, { useState } from 'react';
import { Input, Textarea, Button } from '../ui/Primitives';
import { generateId } from '../../lib/utils';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, FolderGit2, Globe, Github, Image as ImageIcon } from 'lucide-react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableProjectCard = React.memo(function SortableProjectCard({ item, onUpdate, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [techInput, setTechInput] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const addTechTag = () => {
    if (!techInput.trim()) return;
    onUpdate({
      techBadges: [...(item.techBadges || []), techInput.trim()],
    });
    setTechInput('');
  };

  const removeTechTag = (index) => {
    const next = [...(item.techBadges || [])];
    next.splice(index, 1);
    onUpdate({ techBadges: next });
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
            title="Drag to reorder project"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <FolderGit2 className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="font-semibold text-xs truncate">
            {item.title || 'Untitled Project'}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
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

      {isExpanded && (
        <div className="p-3.5 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium mb-1 text-muted-foreground">Project Title</label>
              <Input
                value={item.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="e.g. Aura CLI — Cloud Tool"
                className="h-8 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-muted-foreground flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-blue-500" /> Preview Thumbnail Image URL
              </label>
              <Input
                value={item.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-muted-foreground">Project Description</label>
            <Textarea
              value={item.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="1-2 sentences highlighting what the project does and key technologies used..."
              rows={2}
              className="text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium mb-1 text-muted-foreground flex items-center gap-1">
                <Github className="w-3 h-3 text-blue-500" /> GitHub Repo URL
              </label>
              <Input
                value={item.repoUrl || ''}
                onChange={(e) => onUpdate({ repoUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-muted-foreground flex items-center gap-1">
                <Globe className="w-3 h-3 text-blue-500" /> Live Demo URL (Optional)
              </label>
              <Input
                value={item.demoUrl || ''}
                onChange={(e) => onUpdate({ demoUrl: e.target.value })}
                placeholder="https://demo.app"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="space-y-1.5 pt-2 border-t">
            <label className="block font-medium text-muted-foreground">Tech Stack Tags</label>
            <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
              {(item.techBadges || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium border border-border"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechTag(idx)}
                    className="text-muted-foreground hover:text-red-500 ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTechTag();
                    }
                  }}
                  placeholder="+ Add tech tag (Press Enter)"
                  className="h-6.5 text-[11px] w-40"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const ProjectsBlockEditor = ({ block, onUpdate }) => {
  const addProject = () => {
    const newProject = {
      id: generateId('proj'),
      title: 'New Featured Project',
      description: 'An open-source application built for developers with modern tooling.',
      repoUrl: 'https://github.com/username/project',
      demoUrl: 'https://example.com',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      techBadges: ['React', 'JavaScript', 'Tailwind CSS'],
    };

    onUpdate({
      items: [...(block.items || []), newProject],
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Grid Layout:</span>
          <div className="flex rounded-md border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => onUpdate({ layout: '2-col' })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                block.layout === '2-col' ? 'bg-background shadow-2xs font-semibold text-foreground' : 'text-muted-foreground'
              }`}
            >
              2 Columns
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ layout: '3-col' })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                block.layout === '3-col' ? 'bg-background shadow-2xs font-semibold text-foreground' : 'text-muted-foreground'
              }`}
            >
              3 Columns
            </button>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={addProject} className="h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add Project Card
        </Button>
      </div>

      <SortableContext items={(block.items || []).map((it) => it.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {(block.items || []).map((item) => (
            <SortableProjectCard
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
