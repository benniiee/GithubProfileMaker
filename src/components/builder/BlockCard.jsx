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

/* Per-type accent color for the icon pill */
const BLOCK_ACCENT = {
  banner: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  hero: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'rapid-fire': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  'about-me': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  skills: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  projects: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  experience: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'github-stats': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'custom-markdown': 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400',
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
  const accentClass = BLOCK_ACCENT[block.type] || 'bg-secondary text-primary';
  const isCollapsed = block.isCollapsed ?? false;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`rounded-2xl border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-md ${
          isDragging ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' : 'border-border/70'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between px-3.5 py-3 select-none bg-muted/25 rounded-t-2xl border-b border-border/60">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing p-1 rounded-lg hover:bg-muted/60 shrink-0 transition-colors"
              title="Drag to reorder section"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            {/* Block Type Icon — colored pill */}
            <div className={`p-2 rounded-xl shrink-0 ${accentClass}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2.5 truncate min-w-0">
              <span className="font-semibold text-sm sm:text-base tracking-tight truncate text-foreground">
                {block.title || BLOCK_TYPE_NAMES[block.type]}
              </span>
              {/* Type pill badge */}
              <span className="text-xs text-muted-foreground/80 bg-muted/70 px-2 py-0.5 rounded-md font-mono hidden sm:inline shrink-0 tracking-wide">
                {block.type}
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <BlockSettings
              block={block}
              onUpdate={(updates) => updateBlock(block.id, updates)}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => duplicateBlock(block.id)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Duplicate Block"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
              title="Delete Block"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBlockCollapse(block.id)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground ml-0.5"
              title={isCollapsed ? 'Expand Block' : 'Collapse Block'}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
              />
            </Button>
          </div>
        </div>

        {/* Block Body — smooth CSS collapse */}
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isCollapsed ? 'max-h-0' : 'max-h-[9999px]'
          }`}
        >
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
        </div>
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
