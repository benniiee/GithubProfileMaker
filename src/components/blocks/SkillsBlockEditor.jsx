import React, { useState, useMemo } from 'react';
import { Input, Button } from '../ui/Primitives';
import { Modal, ConfirmDialog } from '../ui/Modal';
import { generateId, buildShieldBadgeUrl, POPULAR_SKILL_BADGES, parseBulkBadges } from '../../lib/utils';
import { Plus, Trash2, GripVertical, Search, FileText, Sparkles, X, Palette, LayoutGrid, Check } from 'lucide-react';
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
      <div className="flex items-center gap-1.5 p-1 rounded-md border border-border bg-card hover:border-blue-500/60 shadow-2xs transition-colors">
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-0.5"
          title="Drag badge to reorder"
        >
          <GripVertical className="w-3 h-3" />
        </button>

        <img src={badgeUrl} alt={badge.name} className="h-5 rounded-xs object-contain shrink-0" />

        <button
          type="button"
          onClick={() => setShowEditor(!showEditor)}
          className="text-muted-foreground/60 hover:text-foreground p-0.5 text-[10px] cursor-pointer"
          title="Edit badge styling"
        >
          <Palette className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground/40 hover:text-red-500 p-0.5 cursor-pointer"
          title="Remove badge"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {showEditor && (
        <div className="absolute top-full left-0 mt-1.5 w-64 p-3 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl z-50 text-xs space-y-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-1 border-b border-border/80">
            <span className="font-semibold text-xs truncate">Edit {badge.name} Badge</span>
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">Badge Text / Label</label>
            <Input
              value={badge.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="h-7 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">Color</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={badge.color && badge.color.startsWith('#') ? badge.color : `#${badge.color || '20232A'}`}
                  onChange={(e) => onUpdate({ color: e.target.value.replace('#', '') })}
                  className="w-6 h-7 rounded border border-border cursor-pointer p-0.5"
                />
                <Input
                  value={badge.color || ''}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  placeholder="HEX"
                  className="h-7 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">SimpleIcon Slug</label>
              <Input
                value={badge.logo || ''}
                onChange={(e) => onUpdate({ logo: e.target.value })}
                placeholder="slug"
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">Custom Direct Image URL</label>
            <Input
              value={badge.customUrl || ''}
              onChange={(e) => onUpdate({ customUrl: e.target.value })}
              placeholder="https://img.shields.io/..."
              className="h-7 text-xs font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
});

export const SkillsBlockEditor = ({ block, onUpdate }) => {
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
    <div className="space-y-4 text-xs">
      {/* Layout Options */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-lg border bg-card">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="flex-wrap"
            checked={block.useFlexContainer ?? true}
            onChange={(e) => onUpdate({ useFlexContainer: e.target.checked })}
            className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="flex-wrap" className="font-medium text-foreground cursor-pointer flex items-center gap-1.5 text-xs">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-500" /> Center Flex-Wrap Badges Layout
          </label>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">Height:</span>
          <Input
            type="number"
            value={block.badgeHeight || 28}
            onChange={(e) => onUpdate({ badgeHeight: Number(e.target.value) })}
            className="w-14 h-7 text-xs text-center"
            min={18}
            max={40}
          />
          <span className="text-muted-foreground">px</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          Categorized badges with drag-and-drop ordering.
        </span>
        <Button variant="outline" size="sm" onClick={addCategory} className="h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add Category
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3.5">
        {(block.categories || []).map((category) => (
          <div key={category.id} className="p-3.5 rounded-lg border border-border/90 bg-muted/20 space-y-3">
            {/* Category Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Input
                  value={category.name || ''}
                  onChange={(e) => updateCategoryName(category.id, e.target.value)}
                  placeholder="Category Name (e.g. Core Languages)"
                  className="h-8 text-xs font-semibold w-full bg-background"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFilterCategory('All');
                    setSearchQuery('');
                    setActiveCategoryForAdd(category.id);
                  }}
                  className="h-7 text-xs px-2"
                >
                  <Search className="w-3 h-3 mr-1 text-muted-foreground" /> Browse Badges ({POPULAR_SKILL_BADGES.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkImportTargetCategory(category.id)}
                  className="h-7 text-xs px-2"
                >
                  <FileText className="w-3 h-3 mr-1" /> Bulk Paste
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCategoryToDelete(category.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-red-500 shrink-0"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Badges Drag & Drop Area */}
            <SortableContext
              items={(category.badges || []).map((b) => b.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-2 min-h-[42px] p-2.5 rounded-md border border-dashed border-border/80 bg-background/60">
                {(!category.badges || category.badges.length === 0) ? (
                  <div className="w-full py-2 text-center text-[11px] text-muted-foreground">
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

      {/* Browse Badges Modal with Category Tabs and Search */}
      <Modal
        isOpen={Boolean(activeCategoryForAdd)}
        onClose={() => setActiveCategoryForAdd(null)}
        title="Select Badges to Add"
        description="Click any technology badge to add it. Badges already in this category are marked."
        maxWidth="max-w-2xl"
      >
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 90+ tech badges (e.g. Next.js, Docker, PyTorch, GraphQL, Tailwind)..."
              className="pl-9 h-9 text-xs"
              autoFocus
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
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

          {/* Badges Grid by Sub-category */}
          <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-3">
            {filteredBadges.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No badges found matching "{searchQuery}". You can use <b>Bulk Paste</b> to add any custom Shields.io badge.
              </div>
            ) : (
              ALL_CATEGORIES.filter((c) => c !== 'All').map((catName) => {
                const badgesInCat = filteredBadges.filter((b) => b.category === catName);
                if (badgesInCat.length === 0) return null;

                return (
                  <div key={catName} className="space-y-1.5">
                    <h5 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {catName}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
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
                            className={`p-1 rounded-md border text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              isAlreadyAdded
                                ? 'border-blue-500/80 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500/20'
                                : 'border-border bg-background hover:border-blue-500/60 hover:bg-accent'
                            }`}
                            title={isAlreadyAdded ? 'Badge is already in this category (Click to add another)' : 'Click to add badge'}
                          >
                            <img src={previewUrl} alt={preset.name} className="h-5 shrink-0" />
                            {isAlreadyAdded ? (
                              <Check className="w-3 h-3 text-blue-500 shrink-0" />
                            ) : (
                              <Plus className="w-3 h-3 text-muted-foreground shrink-0" />
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

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Showing {filteredBadges.length} of {POPULAR_SKILL_BADGES.length} curated badges
            </span>
            <Button size="sm" onClick={() => setActiveCategoryForAdd(null)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        isOpen={Boolean(bulkImportTargetCategory)}
        onClose={() => setBulkImportTargetCategory(null)}
        title="Bulk Add Shields.io Badges"
        description="Paste multiple badge URLs, markdown image tags, HTML img tags, or comma-separated tech names"
        maxWidth="max-w-lg"
      >
        <div className="space-y-3">
          <textarea
            value={bulkInputText}
            onChange={(e) => setBulkInputText(e.target.value)}
            placeholder={`<img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React" />\nTypeScript, Python, Docker, PostgreSQL, Kubernetes, Redis, Tailwind CSS`}
            rows={7}
            className="w-full p-3 rounded-lg border border-input text-xs font-mono bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary"
          />
          <p className="text-[11px] text-muted-foreground leading-snug">
            Supports markdown <code className="text-blue-500">![Alt](url)</code>, HTML <code className="text-blue-500">&lt;img src="..."&gt;</code>, direct URLs, or comma-separated names.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setBulkImportTargetCategory(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleBulkImport}>
              Parse & Add Badges
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Category Deletion Modal */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => removeCategory(categoryToDelete)}
        title="Delete Skills Category"
        message="Are you sure you want to delete this skills category and all badges inside it?"
        confirmText="Delete Category"
        isDestructive={true}
      />
    </div>
  );
};
