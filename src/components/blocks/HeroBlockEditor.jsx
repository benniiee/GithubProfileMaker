import React, { useState } from 'react';
import { Input, Textarea, Button } from '../ui/Primitives';
import { generateId, buildShieldBadgeUrl } from '../../lib/utils';
import { Plus, Trash2, GripVertical, Sparkles, Image as ImageIcon, User, Share2, Type } from 'lucide-react';
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

const HERO_TABS = [
  { id: 'profile', label: 'Profile Info', icon: User },
  { id: 'subtitle', label: 'Subtitle & Typing', icon: Type },
  { id: 'socials', label: 'Social Links', icon: Share2 },
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
      className="p-3 rounded-xl border border-border bg-background shadow-2xs space-y-2.5 group"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 shrink-0"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm text-foreground truncate">
            {item.platform || 'Social Link'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <img src={badgePreviewUrl} alt="Badge" className="h-5 object-contain hidden sm:block" />
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

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-3">
          <Input
            value={item.platform || ''}
            onChange={(e) => onUpdate({ platform: e.target.value })}
            placeholder="Platform"
            className="text-sm font-medium"
          />
        </div>
        <div className="sm:col-span-5">
          <Input
            value={item.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="https://..."
            className="text-sm font-mono"
          />
        </div>
        <div className="sm:col-span-4 flex items-center gap-2">
          <input
            type="color"
            value={item.color && item.color.startsWith('#') ? item.color : `#${item.color || '000000'}`}
            onChange={(e) => onUpdate({ color: e.target.value.replace('#', '') })}
            className="w-9 h-9 rounded-xl border cursor-pointer p-0.5 bg-background shrink-0"
            title="Badge color"
          />
          <Input
            value={item.logo || ''}
            onChange={(e) => onUpdate({ logo: e.target.value })}
            placeholder="Logo slug"
            className="text-xs flex-1"
            title="SimpleIcons logo slug"
          />
        </div>
      </div>
    </div>
  );
});

export const HeroBlockEditor = ({ block, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [newLineText, setNewLineText] = useState('');

  const addTypingLine = () => {
    if (!newLineText.trim()) return;
    onUpdate({
      typingLines: [...(block.typingLines || []), newLineText.trim()],
    });
    setNewLineText('');
  };

  const removeTypingLine = (index) => {
    onUpdate({
      typingLines: (block.typingLines || []).filter((_, i) => i !== index),
    });
  };

  const addSocialBadge = (platformObj = null) => {
    const newBadge = platformObj
      ? {
          id: generateId('soc'),
          platform: platformObj.platform,
          label: platformObj.label,
          url: platformObj.defaultUrl,
          color: platformObj.color,
          logo: platformObj.logo,
        }
      : {
          id: generateId('soc'),
          platform: 'Custom',
          label: 'Link',
          url: 'https://',
          color: '000000',
          logo: '',
        };

    onUpdate({
      socialBadges: [...(block.socialBadges || []), newBadge],
    });
  };

  const updateSocialBadge = (id, updates) => {
    onUpdate({
      socialBadges: (block.socialBadges || []).map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    });
  };

  const removeSocialBadge = (id) => {
    onUpdate({
      socialBadges: (block.socialBadges || []).filter((b) => b.id !== id),
    });
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Categorized Tab Bar */}
      <div className="flex p-1 rounded-xl bg-muted/30 border border-border/80 gap-1">
        {HERO_TABS.map((tab) => {
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

      {/* Tab 1: Profile Info */}
      {activeTab === 'profile' && (
        <div className="space-y-4 p-4 rounded-2xl border border-border bg-card animate-in fade-in">
          <div>
            <label className="block font-semibold mb-1.5 text-foreground text-sm">Full Name / Heading</label>
            <Input
              value={block.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Your Full Name"
              className="text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1.5 text-foreground text-sm">Bio / About Paragraph</label>
            <Textarea
              value={block.bioText || ''}
              onChange={(e) => onUpdate({ bioText: e.target.value })}
              placeholder="Passionate full stack developer creating modern web applications..."
              rows={3}
            />
          </div>

          {/* Avatar Settings */}
          <div className="pt-3 border-t border-border/70 space-y-3.5">
            <label className="block font-semibold text-foreground text-sm flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-500" /> Profile Avatar Image
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
              <div className="sm:col-span-8">
                <Input
                  value={block.avatarUrl || ''}
                  onChange={(e) => onUpdate({ avatarUrl: e.target.value })}
                  placeholder="https://github.com/your-username.png"
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Use your GitHub avatar: <code className="text-blue-500">https://github.com/USERNAME.png</code>
                </p>
              </div>

              <div className="sm:col-span-4 flex items-center justify-center p-2 rounded-xl border bg-muted/20">
                {block.avatarUrl ? (
                  <img
                    src={block.avatarUrl}
                    alt="Avatar"
                    style={{
                      width: `${Math.min(block.avatarSize || 100, 72)}px`,
                      height: `${Math.min(block.avatarSize || 100, 72)}px`,
                      borderRadius: block.avatarShape === 'circle' ? '50%' : block.avatarShape === 'rounded' ? '14px' : '0px',
                    }}
                    className="object-cover border shadow-xs"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border border-dashed flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 text-foreground">Avatar Shape</label>
                <div className="flex rounded-xl border bg-muted/40 p-0.5">
                  {['circle', 'rounded', 'square'].map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => onUpdate({ avatarShape: shape })}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                        block.avatarShape === shape ? 'bg-background font-bold text-foreground shadow-2xs' : 'text-muted-foreground'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 text-foreground">
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
        </div>
      )}

      {/* Tab 2: Subtitle & Typing */}
      {activeTab === 'subtitle' && (
        <div className="space-y-4 p-4 rounded-2xl border border-border bg-card animate-in fade-in">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" /> Subtitle Mode
            </label>
            <div className="flex rounded-xl border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => onUpdate({ subtitleType: 'typing' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  block.subtitleType === 'typing' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
                }`}
              >
                Animated Typing SVG
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ subtitleType: 'static' })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  block.subtitleType === 'static' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
                }`}
              >
                Static Text
              </button>
            </div>
          </div>

          {block.subtitleType === 'typing' ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-xs sm:text-sm font-medium">Color:</span>
                  <input
                    type="color"
                    value={block.typingColor && block.typingColor.startsWith('#') ? block.typingColor : `#${block.typingColor || '61afef'}`}
                    onChange={(e) => onUpdate({ typingColor: e.target.value.replace('#', '') })}
                    className="w-8 h-8 rounded-lg border cursor-pointer p-0.5 bg-background shrink-0"
                  />
                  <Input
                    value={block.typingColor || '61afef'}
                    onChange={(e) => onUpdate({ typingColor: e.target.value })}
                    placeholder="HEX"
                    className="font-mono text-xs w-24"
                  />
                </div>

                <div>
                  <select
                    value={block.typingFont || 'Fira Code'}
                    onChange={(e) => onUpdate({ typingFont: e.target.value })}
                    className="w-full h-9.5 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    {['Fira Code', 'Roboto', 'Montserrat', 'Open Sans', 'Courier New', 'Ubuntu'].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Typing Lines List */}
              <div className="space-y-2 pt-2 border-t border-border/70">
                <span className="text-xs sm:text-sm font-semibold text-foreground block">
                  Typing Animation Lines ({block.typingLines?.length || 0})
                </span>

                <div className="space-y-1.5">
                  {(block.typingLines || []).map((line, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border bg-muted/20"
                    >
                      <span className="text-sm font-mono truncate">{line}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTypingLine(idx)}
                        className="h-7 w-7 text-muted-foreground hover:text-red-500 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Input
                    value={newLineText}
                    onChange={(e) => setNewLineText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTypingLine()}
                    placeholder="Add dynamic typing phrase..."
                    className="text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={addTypingLine} className="shrink-0 text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add Line
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 text-foreground">Static Subtitle</label>
              <Input
                value={block.subtitleText || ''}
                onChange={(e) => onUpdate({ subtitleText: e.target.value })}
                placeholder="Software Engineer & Open Source Enthusiast"
                className="text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Social Badges */}
      {activeTab === 'socials' && (
        <div className="space-y-4 p-4 rounded-2xl border border-border bg-card animate-in fade-in">
          {/* Preset Buttons */}
          <div>
            <span className="text-xs sm:text-sm font-semibold text-foreground mb-2 block">
              Quick Add Popular Socials:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SOCIAL_PLATFORMS.map((plat) => (
                <button
                  key={plat.platform}
                  type="button"
                  onClick={() => addSocialBadge(plat)}
                  className="px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs"
                >
                  + {plat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Badges List */}
          <div className="space-y-3 pt-3 border-t border-border/70">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                Active Social Links ({block.socialBadges?.length || 0})
              </span>
              <Button variant="outline" size="sm" onClick={() => addSocialBadge()} className="h-8 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Custom Link
              </Button>
            </div>

            <SortableContext
              items={(block.socialBadges || []).map((b) => b.id)}
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
      )}
    </div>
  );
};
