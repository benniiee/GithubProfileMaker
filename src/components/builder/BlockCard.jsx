import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProfile } from '../../store/profileStore';
import { BlockSettings } from './BlockSettings';
import { BannerBlockEditor } from '../blocks/BannerBlockEditor';
import { HeroBlockEditor } from '../blocks/HeroBlockEditor';
import { RapidFireBlockEditor } from '../blocks/RapidFireBlockEditor';
import { SkillsBlockEditor } from '../blocks/SkillsBlockEditor';
import { ProjectsBlockEditor } from '../blocks/ProjectsBlockEditor';
import { ExperienceBlockEditor } from '../blocks/ExperienceBlockEditor';
import { GitHubStatsBlockEditor } from '../blocks/GitHubStatsBlockEditor';
import { CustomMarkdownEditor } from '../blocks/CustomMarkdownEditor';
import { Button } from '../ui/Primitives';
import { ConfirmDialog } from '../ui/Modal';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  Image as ImageIcon,
  User,
  Zap,
  Wrench,
  FolderGit2,
  Briefcase,
  BarChart3,
  FileCode2,
} from 'lucide-react';

const BLOCK_ICONS = {
  banner: ImageIcon,
  hero: User,
  'rapid-fire': Zap,
  'about-me': Zap,
  skills: Wrench,
  projects: FolderGit2,
  experience: Briefcase,
  'github-stats': BarChart3,
  'custom-markdown': FileCode2,
};

const BLOCK_TYPE_NAMES = {
  banner: 'Banner & Header',
  hero: 'Hero Intro',
  'rapid-fire': 'Rapid Fire / About Me',
  'about-me': 'Rapid Fire / About Me',
  skills: 'Skills & Tools Grid',
  projects: 'Project Showcase',
  experience: 'Work Experience',
  'github-stats': 'GitHub Stats & Widgets',
  'custom-markdown': 'Custom Markdown',
};

export const BlockCard = React.memo(function BlockCard({ block }) {
  const { updateBlock, duplicateBlock, removeBlock, toggleBlockCollapse } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 30 : 1,
  };

  const Icon = BLOCK_ICONS[block.type] || FileCode2;
  const isCollapsed = block.isCollapsed ?? false;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`rounded-xl border bg-card text-card-foreground shadow-xs transition-shadow hover:shadow-md ${
          isDragging ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' : 'border-border'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between p-3 select-none bg-muted/20 rounded-t-xl border-b border-border/80">
          <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted shrink-0"
              title="Drag to reorder section"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            {/* Block Type Badge */}
            <div className="p-1.5 rounded-md bg-secondary text-primary shrink-0">
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex items-baseline gap-2 truncate min-w-0">
              <span className="font-semibold text-xs tracking-tight truncate">
                {block.title || BLOCK_TYPE_NAMES[block.type]}
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline shrink-0">
                ({BLOCK_TYPE_NAMES[block.type]})
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Settings Popover */}
            <BlockSettings
              block={block}
              onUpdate={(updates) => updateBlock(block.id, updates)}
            />

            {/* Duplicate */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => duplicateBlock(block.id)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Duplicate Block"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>

            {/* Delete — Opens Modal */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-7 w-7 text-muted-foreground hover:text-red-500"
              title="Delete Block"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            {/* Collapse / Expand */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBlockCollapse(block.id)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground ml-0.5"
              title={isCollapsed ? 'Expand Block' : 'Collapse Block'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Block Body Content */}
        {!isCollapsed && (
          <div className="p-3.5 sm:p-4">
            {block.type === 'banner' && (
              <BannerBlockEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
            {block.type === 'hero' && (
              <HeroBlockEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
            {(block.type === 'rapid-fire' || block.type === 'about-me') && (
              <RapidFireBlockEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
            {block.type === 'skills' && (
              <SkillsBlockEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
            {block.type === 'projects' && (
              <ProjectsBlockEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
            {block.type === 'experience' && (
              <ExperienceBlockEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
            {block.type === 'github-stats' && (
              <GitHubStatsBlockEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
            {block.type === 'custom-markdown' && (
              <CustomMarkdownEditor
                block={block}
                onUpdate={(updater) => updateBlock(block.id, updater)}
              />
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => removeBlock(block.id)}
        title={`Delete "${block.title || BLOCK_TYPE_NAMES[block.type]}"`}
        message="Are you sure you want to remove this block from your profile? You will lose any edits made inside this section."
        confirmText="Delete Section"
        isDestructive={true}
      />
    </>
  );
});
