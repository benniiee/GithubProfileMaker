import React, { useState } from 'react';
import { Input, Textarea, Button } from '../ui/Primitives';
import { generateId, buildShieldBadgeUrl } from '../../lib/utils';
import { Plus, Trash2, GripVertical, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COMMON_SOCIAL_PLATFORMS = [
  { platform: 'GitHub', label: 'GitHub', color: '181717', logo: 'github', defaultUrl: 'https://github.com/username' },
  { platform: 'LinkedIn', label: 'LinkedIn', color: '0A66C2', logo: 'linkedin', defaultUrl: 'https://linkedin.com/in/username' },
  { platform: 'Twitter', label: 'X / Twitter', color: '000000', logo: 'x', defaultUrl: 'https://x.com/username' },
  { platform: 'YouTube', label: 'YouTube', color: 'FF0000', logo: 'youtube', defaultUrl: 'https://youtube.com/@channel' },
  { platform: 'Discord', label: 'Discord', color: '5865F2', logo: 'discord', defaultUrl: 'https://discord.gg/invite' },
  { platform: 'Email', label: 'Email', color: 'D14836', logo: 'gmail', defaultUrl: 'mailto:your@email.com' },
  { platform: 'Portfolio', label: 'Website', color: 'FF5722', logo: 'googlechrome', defaultUrl: 'https://yourwebsite.com' },
];

const SortableSocialItem = React.memo(function SortableSocialItem({ item, blockBadgeStyle, onUpdate, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const badgePreviewUrl = buildShieldBadgeUrl({
    label: '',
    message: item.label || item.platform,
    color: item.color || '000000',
    style: blockBadgeStyle || 'for-the-badge',
    logo: item.logo || item.platform.toLowerCase(),
    logoColor: 'white',
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-2.5 rounded-lg border bg-background/90 shadow-2xs space-y-2 group"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 shrink-0"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="font-semibold text-xs text-foreground truncate">
            {item.platform || 'Social Link'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <img src={badgePreviewUrl} alt="Badge" className="h-4.5 object-contain hidden sm:block" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-6.5 w-6.5 text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-3">
          <Input
            value={item.platform || ''}
            onChange={(e) => onUpdate({ platform: e.target.value })}
            placeholder="Platform Name"
            className="h-7 text-xs font-medium"
          />
        </div>
        <div className="sm:col-span-5">
          <Input
            value={item.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="Profile URL"
            className="h-7 text-xs font-mono"
          />
        </div>
        <div className="sm:col-span-4 flex items-center gap-1.5">
          <input
            type="color"
            value={item.color && item.color.startsWith('#') ? item.color : `#${item.color || '000000'}`}
            onChange={(e) => onUpdate({ color: e.target.value.replace('#', '') })}
            className="w-7 h-7 rounded border cursor-pointer p-0.5 bg-background shrink-0"
            title="Badge color"
          />
          <Input
            value={item.logo || ''}
            onChange={(e) => onUpdate({ logo: e.target.value })}
            placeholder="Logo slug"
            className="h-7 text-xs flex-1"
            title="SimpleIcons logo slug"
          />
        </div>
      </div>
    </div>
  );
});

export const HeroBlockEditor = ({ block, onUpdate }) => {
  const [newLineText, setNewLineText] = useState('');

  const addTypingLine = () => {
    if (!newLineText.trim()) return;
    onUpdate({
      typingLines: [...(block.typingLines || []), newLineText.trim()],
    });
    setNewLineText('');
  };

  const removeTypingLine = (index) => {
    const next = [...(block.typingLines || [])];
    next.splice(index, 1);
    onUpdate({ typingLines: next });
  };

  const addSocialBadge = (platformInfo) => {
    const newBadge = platformInfo
      ? {
          id: generateId('soc'),
          platform: platformInfo.platform,
          label: platformInfo.label,
          url: platformInfo.defaultUrl,
          color: platformInfo.color,
          logo: platformInfo.logo,
        }
      : {
          id: generateId('soc'),
          platform: 'Link',
          label: 'Website',
          url: 'https://',
          color: '000000',
          logo: '',
        };

    onUpdate({
      socialBadges: [...(block.socialBadges || []), newBadge],
    });
  };

  const updateSocialBadge = (badgeId, updates) => {
    onUpdate({
      socialBadges: (block.socialBadges || []).map((s) => (s.id === badgeId ? { ...s, ...updates } : s)),
    });
  };

  const removeSocialBadge = (badgeId) => {
    onUpdate({
      socialBadges: (block.socialBadges || []).filter((s) => s.id !== badgeId),
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Name & Avatar Section */}
      <div className="p-3.5 rounded-lg bg-card border space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2 space-y-2.5">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">Display Name</label>
              <Input
                value={block.name || ''}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="h-8 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">Avatar Image URL</label>
              <div className="flex gap-2">
                <Input
                  value={block.avatarUrl || ''}
                  onChange={(e) => onUpdate({ avatarUrl: e.target.value })}
                  placeholder="https://github.com/your-username.png"
                  className="h-8 text-xs font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate({ avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' })}
                  className="h-8 text-[11px] shrink-0"
                >
                  Sample
                </Button>
              </div>
            </div>
          </div>

          {/* Live Avatar Preview */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg border bg-muted/20">
            {block.avatarUrl ? (
              <img
                src={block.avatarUrl}
                alt="Avatar"
                style={{
                  width: `${Math.min(block.avatarSize || 100, 90)}px`,
                  height: `${Math.min(block.avatarSize || 100, 90)}px`,
                  borderRadius: block.avatarShape === 'circle' ? '50%' : block.avatarShape === 'rounded' ? '12px' : '0px',
                }}
                className="object-cover border shadow-xs"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full border border-dashed flex items-center justify-center text-muted-foreground">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <span className="text-[10px] text-muted-foreground mt-1">Avatar Preview</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t">
          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">Avatar Shape</label>
            <div className="flex rounded-md border bg-muted/40 p-0.5">
              {['circle', 'rounded', 'square'].map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => onUpdate({ avatarShape: shape })}
                  className={`flex-1 py-1 rounded text-[11px] font-medium capitalize transition-all cursor-pointer ${
                    block.avatarShape === shape ? 'bg-background font-bold text-foreground shadow-2xs' : 'text-muted-foreground'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
              Avatar Size: {block.avatarSize || 130}px
            </label>
            <input
              type="range"
              min={60}
              max={200}
              value={block.avatarSize || 130}
              onChange={(e) => onUpdate({ avatarSize: Number(e.target.value) })}
              className="w-full h-2 bg-secondary rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>
      </div>

      {/* Subtitle & Animated Typing Effect */}
      <div className="p-3.5 rounded-lg bg-card border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Subtitle Mode
          </label>
          <div className="flex rounded-md border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => onUpdate({ subtitleType: 'typing' })}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                block.subtitleType === 'typing' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              Animated Typing SVG
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ subtitleType: 'static' })}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                block.subtitleType === 'static' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              Static Text
            </button>
          </div>
        </div>

        {block.subtitleType === 'typing' ? (
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[11px]">Color:</span>
                <input
                  type="color"
                  value={block.typingColor && block.typingColor.startsWith('#') ? block.typingColor : `#${block.typingColor || '61afef'}`}
                  onChange={(e) => onUpdate({ typingColor: e.target.value.replace('#', '') })}
                  className="w-7 h-7 rounded border cursor-pointer p-0.5"
                />
                <Input
                  value={block.typingColor || '61afef'}
                  onChange={(e) => onUpdate({ typingColor: e.target.value })}
                  placeholder="HEX"
                  className="h-7 text-xs flex-1"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-[11px]">Font:</span>
                <select
                  value={block.typingFont || 'Fira Code'}
                  onChange={(e) => onUpdate({ typingFont: e.target.value })}
                  className="h-7 rounded-md border border-input bg-background px-2 text-xs flex-1"
                >
                  <option value="Fira Code">Fira Code</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Source Code Pro">Source Code Pro</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Roboto">Roboto</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              {(block.typingLines || []).map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-[10px] w-4 text-right">{idx + 1}.</span>
                  <Input
                    value={line}
                    onChange={(e) => {
                      const next = [...block.typingLines];
                      next[idx] = e.target.value;
                      onUpdate({ typingLines: next });
                    }}
                    className="h-7 text-xs flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTypingLine(idx)}
                    className="h-7 w-7 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <Input
                  value={newLineText}
                  onChange={(e) => setNewLineText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTypingLine();
                    }
                  }}
                  placeholder="Add another line (e.g. Building distributed systems)"
                  className="h-7 text-xs flex-1"
                />
                <Button variant="outline" size="sm" onClick={addTypingLine} className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add Line
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Input
              value={block.subtitleText || ''}
              onChange={(e) => onUpdate({ subtitleText: e.target.value })}
              placeholder="e.g. Full Stack Developer | Open Source Enthusiast"
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>

      {/* Bio Text */}
      <div className="p-3.5 rounded-lg bg-card border space-y-1.5">
        <label className="block text-xs font-semibold text-foreground">Short Bio / Overview Paragraph</label>
        <Textarea
          value={block.bioText || ''}
          onChange={(e) => onUpdate({ bioText: e.target.value })}
          placeholder="A brief intro about yourself, what you're working on, and what you're passionate about..."
          rows={3}
          className="text-xs leading-relaxed"
        />
      </div>

      {/* Social Links & Badges */}
      <div className="p-3.5 rounded-lg bg-card border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">Social Badges & Links</label>
          <Button variant="outline" size="sm" onClick={() => addSocialBadge()} className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add Custom Link
          </Button>
        </div>

        {/* Quick Add Presets */}
        <div className="p-2.5 rounded-lg bg-muted/40 border space-y-1.5">
          <span className="text-[11px] text-muted-foreground block">Quick Add Social:</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SOCIAL_PLATFORMS.map((platform) => (
              <button
                key={platform.platform}
                type="button"
                onClick={() => addSocialBadge(platform)}
                className="px-2 py-1 rounded-md bg-background hover:bg-secondary text-[11px] font-medium border border-border text-foreground flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:border-blue-500/40"
              >
                <Plus className="w-3 h-3 text-muted-foreground" /> {platform.platform}
              </button>
            ))}
          </div>
        </div>

        {/* Sortable Badges List */}
        <SortableContext
          items={(block.socialBadges || []).map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {(block.socialBadges || []).map((item) => (
              <SortableSocialItem
                key={item.id}
                item={item}
                blockBadgeStyle={block.badgeStyle}
                onUpdate={(updates) => updateSocialBadge(item.id, updates)}
                onRemove={() => removeSocialBadge(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
