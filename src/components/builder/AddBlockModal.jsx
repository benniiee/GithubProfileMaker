import React, { useState, useMemo } from 'react';
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
    category: 'Header & Intro',
    desc: 'Capsule Render animated waving banner, custom header image, and live profile views counter.',
    icon: ImageIcon,
    tag: 'Header',
  },
  {
    type: 'hero',
    title: 'Hero Introduction',
    category: 'Header & Intro',
    desc: 'Avatar, animated typing subtitle, headline, bio, and social badge links.',
    icon: User,
    tag: 'Intro',
  },
  {
    type: 'rapid-fire',
    title: 'Rapid Fire / About Me',
    category: 'Header & Intro',
    desc: 'Tagline statement and customizable Q&A bullets (working on, learning, ask me about, fun facts).',
    icon: Zap,
    tag: 'Bio',
  },
  {
    type: 'skills',
    title: 'Skills & Tools Grid',
    category: 'Showcase',
    desc: 'Categorized badges for languages, frameworks, and tools with flex wrap & bulk paste.',
    icon: Wrench,
    tag: 'Tech Stack',
  },
  {
    type: 'projects',
    title: 'Project Showcase Grid',
    category: 'Showcase',
    desc: 'Side-by-side 2-col or 3-col project cards with thumbnails, descriptions, and tags.',
    icon: FolderGit2,
    tag: 'Projects',
  },
  {
    type: 'experience',
    title: 'Experience Timeline',
    category: 'Showcase',
    desc: 'Chronological work experience with role, company, dates, and bullet points.',
    icon: Briefcase,
    tag: 'Career',
  },
  {
    type: 'github-stats',
    title: 'GitHub Stats & Widgets',
    category: 'Widgets',
    desc: 'Extended stats cards, Top Languages, and Streak stats with color theme selector.',
    icon: BarChart3,
    tag: 'Stats',
  },
  {
    type: 'custom-markdown',
    title: 'Custom Markdown / Raw HTML',
    category: 'Widgets',
    desc: 'Raw markdown node for custom HTML, embeds, tables, or advanced snippets.',
    icon: FileCode2,
    tag: 'Advanced',
  },
];

const MODAL_CATEGORIES = ['All', 'Header & Intro', 'Showcase', 'Widgets'];

export const AddBlockModal = ({ isOpen, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredBlocks = useMemo(() => {
    if (activeTab === 'All') return BLOCK_DEFINITIONS;
    return BLOCK_DEFINITIONS.filter((b) => b.category === activeTab);
  }, [activeTab]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Section Block"
      description="Choose a block type to insert into your profile layout"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Categorized Filter Tabs to Avoid Visual Overwhelm */}
        <div className="flex rounded-xl border border-border/70 bg-muted/30 p-1 gap-1">
          {MODAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === cat
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Block Cards with Enhanced Typography */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {filteredBlocks.map((def) => {
            const Icon = def.icon;
            return (
              <button
                key={def.type}
                type="button"
                onClick={() => {
                  onSelect(def.type);
                  onClose();
                }}
                className="w-full text-left flex items-start gap-3.5 p-3.5 rounded-xl border border-border/80 hover:border-blue-500/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-secondary text-primary group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm sm:text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {def.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase font-mono shrink-0">
                      {def.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-snug">
                    {def.desc}
                  </p>
                </div>
                <div className="self-center p-1 rounded-lg text-muted-foreground/40 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-colors shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
