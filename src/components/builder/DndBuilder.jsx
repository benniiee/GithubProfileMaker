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
import { Plus, Layout } from 'lucide-react';

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
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold">Profile Blocks ({state.blocks.length})</h2>
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
              <div className="text-center py-12 border-2 border-dashed rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-3">Your profile has no blocks yet.</p>
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

      {/* Bottom Add Block Quick Trigger */}
      {state.blocks.length > 0 && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-blue-500/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-muted-foreground hover:text-blue-600 transition-all flex items-center justify-center gap-2 text-xs font-medium cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Section Block
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
