import React from 'react';
import {
  Image as ImageIcon,
  User,
  Zap,
  Wrench,
  FolderGit2,
  Briefcase,
  BarChart3,
  FileCode2,
  Plus,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

const BLOCK_DEFINITIONS = [
  {
    type: 'banner',
    title: 'Banner & Header',
    desc: 'Capsule Render animated waving banner, custom header image, and live profile views counter.',
    icon: ImageIcon,
    tag: 'Header',
  },
  {
    type: 'hero',
    title: 'Hero Introduction',
    desc: 'Avatar, animated typing subtitle, headline, bio, and social badge links.',
    icon: User,
    tag: 'Intro',
  },
  {
    type: 'rapid-fire',
    title: 'Rapid Fire / About Me',
    desc: 'Tagline statement and customizable Q&A bullets (working on, learning, ask me about, fun facts).',
    icon: Zap,
    tag: 'Bio',
  },
  {
    type: 'skills',
    title: 'Skills & Tools Grid',
    desc: 'Categorized badges for languages, frameworks, and tools with flex wrap & bulk paste.',
    icon: Wrench,
    tag: 'Tech Stack',
  },
  {
    type: 'github-stats',
    title: 'GitHub Stats & Widgets',
    desc: 'Extended stats cards, Top Languages, and Streak stats with color theme selector.',
    icon: BarChart3,
    tag: 'Stats',
  },
  {
    type: 'projects',
    title: 'Project Showcase Grid',
    desc: 'Side-by-side 2-col or 3-col project cards with thumbnails, descriptions, and tags.',
    icon: FolderGit2,
    tag: 'Projects',
  },
  {
    type: 'experience',
    title: 'Experience Timeline',
    desc: 'Chronological work experience with role, company, dates, and bullet points.',
    icon: Briefcase,
    tag: 'Career',
  },
  {
    type: 'custom-markdown',
    title: 'Custom Markdown / Raw HTML',
    desc: 'Raw markdown node for custom HTML, embeds, tables, or advanced snippets.',
    icon: FileCode2,
    tag: 'Advanced',
  },
];

export const AddBlockModal = ({ isOpen, onClose, onSelect }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Section Block"
      description="Choose a block type to insert into your profile layout"
      maxWidth="max-w-xl"
    >
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {BLOCK_DEFINITIONS.map((def) => {
          const Icon = def.icon;
          return (
            <button
              key={def.type}
              type="button"
              onClick={() => {
                onSelect(def.type);
                onClose();
              }}
              className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-border/80 hover:border-blue-500/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all group cursor-pointer"
            >
              <div className="p-2 rounded-md bg-secondary text-primary group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {def.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase font-mono shrink-0">
                    {def.tag}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {def.desc}
                </p>
              </div>
              <div className="self-center text-muted-foreground/40 group-hover:text-blue-500 transition-colors shrink-0">
                <Plus className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
