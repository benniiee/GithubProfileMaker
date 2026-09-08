import React, { useState, useMemo } from 'react';
import { Input, Button } from '../ui/Primitives';
import { Modal, ConfirmDialog } from '../ui/Modal';
import { generateId, buildShieldBadgeUrl, POPULAR_SKILL_BADGES, parseBulkBadges } from '../../lib/utils';
import { Plus, Trash2, GripVertical, Search, FileText, Sparkles, X, Palette, LayoutGrid, Sliders, Check } from 'lucide-react';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ALL_CATEGORIES = [
  'All',
  'Languages',
  'Frontend & Mobile',
  'Backend & APIs',
  'Databases & Storage',
  'Cloud, DevOps & CI/CD',
  'Testing & Tooling',
  'Design & IDEs',
  'AI, ML & Data Science',
];

const SKILL_TABS = [
  { id: 'badges', label: 'Badges & Categories', icon: LayoutGrid },
  { id: 'display', label: 'Display & Sizing', icon: Sliders },
];

const SortableBadgeItem = React.memo(function SortableBadgeItem({ badge, blockBadgeStyle, onUpdate, onRemove }) {
  const [showEditor, setShowEditor] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: badge.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const badgeUrl = badge.customUrl || buildShieldBadgeUrl({
    label: badge.label || '',
    message: badge.name,
    color: badge.color || '20232A',
    style: blockBadgeStyle || 'flat',
    logo: badge.logo || badge.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    logoColor: 'white',
  });

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-card hover:border-blue-500/60 shadow-2xs transition-colors">
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1"
          title="Drag badge to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <img src={badgeUrl} alt={badge.name} className="h-6 rounded-xs object-contain shrink-0" />

        <button
          type="button"
          onClick={() => setShowEditor(!showEditor)}
          className="text-muted-foreground/60 hover:text-foreground p-1 text-xs cursor-pointer"
          title="Edit badge styling"
        >
          <Palette className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground/40 hover:text-red-500 p-1 cursor-pointer"
          title="Remove badge"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {showEditor && (
        <div className="absolute top-full left-0 mt-2 w-72 p-3.5 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 text-sm space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-1.5 border-b border-border/80">
            <span className="font-semibold text-sm truncate">Edit {badge.name}</span>
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Badge Text / Label</label>
            <Input
              value={badge.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={badge.color && badge.color.startsWith('#') ? badge.color : `#${badge.color || '20232A'}`}
                  onChange={(e) => onUpdate({ color: e.target.value.replace('#', '') })}
                  className="w-8 h-8 rounded-lg border cursor-pointer p-0.5 bg-background shrink-0"
                />
                <Input
                  value={badge.color || '20232A'}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Logo Slug</label>
              <Input
                value={badge.logo || ''}
                onChange={(e) => onUpdate({ logo: e.target.value })}
                placeholder="slug"
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const SkillsBlockEditor = ({ block, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('badges');
  const [activeCategoryForAdd, setActiveCategoryForAdd] = useState(null);
  const [bulkImportTargetCategory, setBulkImportTargetCategory] = useState(null);
  const [bulkInputText, setBulkInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const addCategory = () => {
    const newCategory = {
      id: generateId('cat'),
      name: 'New Category',
      badges: [],
    };
    onUpdate({
      categories: [...(block.categories || []), newCategory],
    });
  };

  const removeCategory = (catId) => {
    onUpdate({
      categories: (block.categories || []).filter((c) => c.id !== catId),
    });
    setCategoryToDelete(null);
  };

  const updateCategoryName = (catId, name) => {
    onUpdate({
      categories: (block.categories || []).map((c) => (c.id === catId ? { ...c, name } : c)),
    });
  };

  const addBadgeToCategory = (catId, badgeInfo) => {
    const newBadge = {
      id: generateId('badge'),
      name: badgeInfo.name,
      logo: badgeInfo.logo,
      color: badgeInfo.color || '20232A',
      customUrl: badgeInfo.customUrl,
    };

    onUpdate({
      categories: (block.categories || []).map((c) =>
        c.id === catId ? { ...c, badges: [...(c.badges || []), newBadge] } : c
      ),
    });
  };

  const updateBadge = (catId, badgeId, updates) => {
    onUpdate({
      categories: (block.categories || []).map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          badges: (c.badges || []).map((b) => (b.id === badgeId ? { ...b, ...updates } : b)),
        };
      }),
    });
  };

  const removeBadge = (catId, badgeId) => {
    onUpdate({
      categories: (block.categories || []).map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          badges: (c.badges || []).filter((b) => b.id !== badgeId),
        };
      }),
    });
  };

  const handleBulkImport = () => {
    if (!bulkImportTargetCategory || !bulkInputText.trim()) return;
    const parsed = parseBulkBadges(bulkInputText);
    const newBadges = parsed.map((p) => ({
      id: generateId('badge'),
      name: p.name,
      logo: p.logo,
      color: p.color,
      customUrl: p.customUrl,
    }));

    onUpdate({
      categories: (block.categories || []).map((c) =>
        c.id === bulkImportTargetCategory ? { ...c, badges: [...(c.badges || []), ...newBadges] } : c
      ),
    });

    setBulkInputText('');
    setBulkImportTargetCategory(null);
  };

  const activeCategoryObject = useMemo(() => {
    if (!activeCategoryForAdd) return null;
    return (block.categories || []).find((c) => c.id === activeCategoryForAdd);
  }, [block.categories, activeCategoryForAdd]);

  const activeBadgeNames = useMemo(() => {
    if (!activeCategoryObject) return new Set();
    return new Set((activeCategoryObject.badges || []).map((b) => b.name.toLowerCase()));
  }, [activeCategoryObject]);

  const filteredBadges = useMemo(() => {
    return POPULAR_SKILL_BADGES.filter((b) => {
      const matchesSearch =
        !searchQuery.trim() ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedFilterCategory === 'All' || b.category === selectedFilterCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedFilterCategory]);

  return (
    <div className="space-y-4 text-sm">
      {/* Tab Switcher */}
      <div className="flex p-1 rounded-xl bg-muted/30 border border-border/80 gap-1">
        {SKILL_TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TabIcon className="w-4 h-4 text-blue-500" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Badges & Categories */}
      {activeTab === 'badges' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Organize skills into clean categorized groups with drag-and-drop.
            </span>
            <Button variant="outline" size="sm" onClick={addCategory} className="text-xs sm:text-sm font-medium">
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {(block.categories || []).map((category) => (
              <div key={category.id} className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3.5">
                {/* Category Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={category.name || ''}
                      onChange={(e) => updateCategoryName(category.id, e.target.value)}
                      placeholder="Category Name (e.g. Core Languages)"
                      className="font-semibold text-sm w-full bg-background"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFilterCategory('All');
                        setSearchQuery('');
                        setActiveCategoryForAdd(category.id);
                      }}
                      className="text-xs font-medium"
                    >
                      <Search className="w-3.5 h-3.5 mr-1 text-muted-foreground" /> Browse Badges ({POPULAR_SKILL_BADGES.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkImportTargetCategory(category.id)}
                      className="text-xs font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" /> Bulk Paste
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCategoryToDelete(category.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Badges Drag & Drop Area */}
                <SortableContext
                  items={(category.badges || []).map((b) => b.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="flex flex-wrap gap-2.5 min-h-[50px] p-3 rounded-xl border border-dashed border-border/80 bg-background/60">
                    {(!category.badges || category.badges.length === 0) ? (
                      <div className="w-full py-3 text-center text-xs text-muted-foreground">
                        No badges in this category yet. Click <b>Browse Badges</b> or <b>Bulk Paste</b> above.
                      </div>
                    ) : (
                      category.badges.map((badge) => (
                        <SortableBadgeItem
                          key={badge.id}
                          badge={badge}
                          blockBadgeStyle={block.badgeStyle}
                          onUpdate={(updates) => updateBadge(category.id, badge.id, updates)}
                          onRemove={() => removeBadge(category.id, badge.id)}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Display & Sizing */}
      {activeTab === 'display' && (
        <div className="space-y-4 p-4 rounded-2xl border border-border bg-card animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-muted/20">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="flex-wrap"
                checked={block.useFlexContainer ?? true}
                onChange={(e) => onUpdate({ useFlexContainer: e.target.checked })}
                className="rounded border-input text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 cursor-pointer"
              />
              <div>
                <label htmlFor="flex-wrap" className="font-semibold text-foreground cursor-pointer flex items-center gap-1.5 text-sm">
                  <LayoutGrid className="w-4 h-4 text-blue-500" /> Center Flex-Wrap Badges Layout
                </label>
                <p className="text-xs text-muted-foreground">
                  Wraps badges into responsive flex rows with equal spacing instead of standard markdown image line breaks
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/70">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Badge Render Height: {block.badgeHeight || 28}px
              </label>
              <input
                type="range"
                min={18}
                max={42}
                value={block.badgeHeight || 28}
                onChange={(e) => onUpdate({ badgeHeight: Number(e.target.value) })}
                className="w-full h-2 bg-secondary rounded-lg cursor-pointer mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Badge Style</label>
              <div className="flex rounded-xl border bg-muted/40 p-0.5">
                {['flat', 'for-the-badge', 'flat-square'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => onUpdate({ badgeStyle: style })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      (block.badgeStyle || 'flat') === style
                        ? 'bg-background font-bold text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {style.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Browse Badges Modal with Category Tabs and Search */}
      <Modal
        isOpen={Boolean(activeCategoryForAdd)}
        onClose={() => setActiveCategoryForAdd(null)}
        title="Select Badges to Add"
        description="Click any technology badge to add it. Badges already in this category are marked."
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 90+ tech badges (e.g. Next.js, Docker, PyTorch, GraphQL, Tailwind)..."
              className="pl-10 text-sm"
              autoFocus
            />
          </div>

          {/* Categorized Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = selectedFilterCategory === cat;
              const count =
                cat === 'All'
                  ? POPULAR_SKILL_BADGES.length
                  : POPULAR_SKILL_BADGES.filter((b) => b.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Badges Grid */}
          <div className="max-h-[55vh] overflow-y-auto pr-1 space-y-4">
            {filteredBadges.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No badges found matching "{searchQuery}". You can use <b>Bulk Paste</b> to add any custom Shields.io badge.
              </div>
            ) : (
              ALL_CATEGORIES.filter((c) => c !== 'All').map((catName) => {
                const badgesInCat = filteredBadges.filter((b) => b.category === catName);
                if (badgesInCat.length === 0) return null;

                return (
                  <div key={catName} className="space-y-2">
                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {catName}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {badgesInCat.map((preset) => {
                        const isAlreadyAdded = activeBadgeNames.has(preset.name.toLowerCase());
                        const previewUrl = buildShieldBadgeUrl({
                          message: preset.name,
                          color: preset.color,
                          style: block.badgeStyle || 'flat',
                          logo: preset.logo,
                        });

                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => addBadgeToCategory(activeCategoryForAdd, preset)}
                            className={`p-1.5 rounded-xl border text-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                              isAlreadyAdded
                                ? 'border-blue-500/80 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500/20'
                                : 'border-border/80 bg-background hover:bg-secondary/70 hover:border-border'
                            }`}
                          >
                            <img src={previewUrl} alt={preset.name} className="h-5 object-contain" />
                            {isAlreadyAdded && (
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                Added
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        isOpen={Boolean(bulkImportTargetCategory)}
        onClose={() => setBulkImportTargetCategory(null)}
        title="Bulk Import Tech Badges"
        description="Paste markdown badge images, HTML tags, or comma-separated technology names."
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <textarea
            value={bulkInputText}
            onChange={(e) => setBulkInputText(e.target.value)}
            placeholder="Paste shields.io markdown, img tags, or: React, TypeScript, Python, Docker, PostgreSQL..."
            rows={6}
            className="w-full rounded-xl border border-input bg-background/90 p-3.5 text-sm font-mono focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary"
          />
          <div className="flex justify-end gap-2.5">
            <Button variant="ghost" size="sm" onClick={() => setBulkImportTargetCategory(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleBulkImport}>
              Import Badges
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => removeCategory(categoryToDelete)}
        title="Delete Category"
        message="Are you sure you want to delete this category and all badges inside it?"
        confirmText="Delete Category"
        isDestructive={true}
      />
    </div>
  );
};
