import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useProfile } from '../../store/profileStore';
import { BlockCard } from './BlockCard';
import { AddBlockModal } from './AddBlockModal';
import { Button } from '../ui/Primitives';
import { Plus, Layout, Layers } from 'lucide-react';

export const DndBuilder = () => {
  const { state, reorderBlocks, reorderItems, addBlock } = useProfile();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // 1. Macro drag
    const isMacroDrag = state.blocks.some((b) => b.id === activeId) && state.blocks.some((b) => b.id === overId);
    if (isMacroDrag) {
      reorderBlocks(activeId, overId);
      return;
    }

    // 2. Micro drag
    for (const block of state.blocks) {
      if (block.type === 'experience') {
        const hasActive = (block.items || []).some((i) => i.id === activeId);
        const hasOver = (block.items || []).some((i) => i.id === overId);
        if (hasActive && hasOver) {
          reorderItems(block.id, activeId, overId);
          return;
        }
      } else if (block.type === 'rapid-fire' || block.type === 'about-me') {
        const hasActive = (block.items || []).some((i) => i.id === activeId);
        const hasOver = (block.items || []).some((i) => i.id === overId);
        if (hasActive && hasOver) {
          reorderItems(block.id, activeId, overId);
          return;
        }
      } else if (block.type === 'projects') {
        const hasActive = (block.items || []).some((i) => i.id === activeId);
        const hasOver = (block.items || []).some((i) => i.id === overId);
        if (hasActive && hasOver) {
          reorderItems(block.id, activeId, overId);
          return;
        }
      } else if (block.type === 'hero') {
        const hasActive = (block.socialBadges || []).some((s) => s.id === activeId);
        const hasOver = (block.socialBadges || []).some((s) => s.id === overId);
        if (hasActive && hasOver) {
          reorderItems(block.id, activeId, overId);
          return;
        }
      } else if (block.type === 'skills') {
        for (const cat of block.categories || []) {
          const hasActiveBadge = (cat.badges || []).some((b) => b.id === activeId);
          const hasOverBadge = (cat.badges || []).some((b) => b.id === overId);
          if (hasActiveBadge && hasOverBadge) {
            reorderItems(block.id, activeId, overId);
            return;
          }
        }
      }
    }
  };

  const handleAddBlock = (type) => {
    addBlock(type);
  };

  return (
    <div className="space-y-4">
      {/* Top action header for builder */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Profile Blocks</h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {state.blocks.length}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Drag to reorder sections or configure individual blocks
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Block
        </Button>
      </div>

      {/* DND Context handling both macro and micro reordering */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3.5">
            {state.blocks.length === 0 ? (
              <div className="text-center py-14 px-6 border-2 border-dashed border-border/80 rounded-2xl bg-card/40 flex flex-col items-center">
                <div className="p-3 rounded-2xl bg-muted/60 text-muted-foreground mb-3">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1">
                  Your profile has no blocks yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mb-4">
                  Add custom headers, skills, projects, and stats to start building your GitHub profile.
                </p>
                <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add First Block
                </Button>
              </div>
            ) : (
              state.blocks.map((block) => (
                <BlockCard key={block.id} block={block} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Bottom Add Block Quick Trigger — Linear/SendIt style prominent affordance */}
      {state.blocks.length > 0 && (
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-border/80 hover:border-blue-500/60 bg-muted/10 hover:bg-blue-500/5 text-muted-foreground hover:text-foreground transition-all duration-150 flex items-center justify-center gap-2 text-xs font-medium cursor-pointer group shadow-2xs"
        >
          <div className="p-1 rounded-md bg-muted/60 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>Add Section Block</span>
        </button>
      )}

      {/* Add Block Modal */}
      <AddBlockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelect={handleAddBlock}
      />
    </div>
  );
};
