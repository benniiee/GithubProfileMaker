import React, { useState } from 'react';
import { Input, Button } from '../ui/Primitives';
import { ColorInput, DebouncedSlider } from '../ui/DebouncedInputs';
import {
  Image as ImageIcon,
  Waves,
  Eye,
  Sparkles,
  Palette,
  RotateCcw,
  Zap,
  Sliders,
  Type,
  MessageSquare,
} from 'lucide-react';

const WAVE_TYPES = [
  { id: 'waving', label: 'Animated Flowing Wave', desc: 'Fluid continuous sinusoidal wave' },
  { id: 'wave', label: 'Wave (Classic Multi-Crest Wave)', desc: 'Static sinusoidal dual-crest wave' },
  { id: 'venom', label: 'Venom (Liquid Organic Blob)', desc: 'Dynamic fluid blob shape' },
  { id: 'blur', label: 'Blur (Frosted Atmospheric Glow)', desc: 'Soft glowing circular blurred backdrop' },
  { id: 'pulse', label: 'Pulse (Concentric Expanding Rings)', desc: 'Rhythmic expanding circular glow rings' },
  { id: 'transparent', label: 'Transparent (Only Use Text)', desc: 'Floating text with zero background' },
  { id: 'soft', label: 'Soft Organic Wave', desc: 'Gentle organic double curve' },
  { id: 'egg', label: 'Convex Arch Curve', desc: 'Smooth convex bottom arch' },
  { id: 'cylinder', label: 'Concave Inward Arc', desc: 'Smooth concave bottom curve' },
  { id: 'rounded', label: 'Rounded Pill Container', desc: 'Modern rounded border container' },
  { id: 'transparent', label: 'Transparent Wave Overlay', desc: 'Floating text with transparent backdrop' },
  { id: 'rect', label: 'Clean Rectangle Hero', desc: 'Modern crisp rectangular banner' },
];

const ANIMATION_STYLES = [
  { id: 'twinkling', label: 'Twinkling Particles' },
  { id: 'blink', label: 'Pulsing Glow' },
  { id: 'fadeIn', label: 'Fade In Transition' },
  { id: 'scaleIn', label: 'Spring Scale In' },
  { id: 'none', label: 'Static' },
];

const GRADIENT_PALETTES = [
  { label: 'Sunset Amber', value: '6,11,20,29', color: 'gradient' },
  { label: 'Cyan & Blue', value: '0:00f2fe,100:4facfe', color: 'gradient' },
  { label: 'Neon Aurora', value: '0:38bdf8,50:818cf8,100:c084fc', color: 'gradient' },
  { label: 'Blood Moon', value: '0:ff0844,100:ffb199', color: 'gradient' },
  { label: 'Emerald Matrix', value: '0:0ba360,100:3cba92', color: 'gradient' },
  { label: 'Electric Violet', value: '0:7928ca,100:ff0080', color: 'gradient' },
  { label: 'Cyberpunk Gold', value: '0:f7971e,100:ffd200', color: 'gradient' },
  { label: 'Vaporwave Pastel', value: '0:fbc2eb,100:a6c1ee', color: 'gradient' },
  { label: 'Midnight Obsidian', value: '0:232526,100:414345', color: 'gradient' },
  { label: 'Time of Day (Adaptive)', value: '', color: 'timeGradient' },
  { label: 'Transparent', value: '', color: 'transparent' },
];

const EDITOR_TABS = [
  { id: 'content', label: 'Wave & Content', icon: Waves },
  { id: 'colors', label: 'Colors & Theme', icon: Palette },
  { id: 'tuning', label: 'Fine Tuning', icon: Sliders },
  { id: 'extras', label: 'Views & Greeting', icon: Eye },
];

export const BannerBlockEditor = ({ block, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  const isCapsule = block.bannerType === 'capsule';

  const type = block.capsuleType || 'waving';
  const color = block.capsuleColor || 'gradient';
  const customColors = block.capsuleCustomColors ? `&customColorList=${encodeURIComponent(block.capsuleCustomColors)}` : '';
  const height = block.capsuleHeight || 200;
  const fontSize = block.capsuleFontSize || 48;
  const fontColor = (block.capsuleFontColor || 'fff').replace('#', '');
  const fontAlignY = block.capsuleFontAlignY || 35;
  const animation = block.capsuleAnimation || 'twinkling';
  const reversal = block.capsuleReversal ? '&reversal=true' : '';
  const textBg = block.capsuleTextBg ? '&textBg=true' : '&textBg=false';
  const descParam = block.capsuleDesc ? `&desc=${encodeURIComponent(block.capsuleDesc)}` : '';
  const descSize = block.capsuleDesc && block.capsuleDescSize ? `&descSize=${block.capsuleDescSize}` : '';
  const descAlignY = block.capsuleDesc && block.capsuleDescAlignY ? `&descAlignY=${block.capsuleDescAlignY}` : '';
  const stroke = block.capsuleStroke ? `&stroke=${block.capsuleStroke.replace('#', '')}` : '';
  const strokeWidth = block.capsuleStroke && block.capsuleStrokeWidth ? `&strokeWidth=${block.capsuleStrokeWidth}` : '';

  const capsulePreviewUrl = `https://capsule-render.vercel.app/api?type=${type}&height=${height}&color=${color}${customColors}&text=${encodeURIComponent(block.capsuleText || 'Do what you love')}&fontSize=${fontSize}&fontColor=${fontColor}&animation=${animation}&fontAlignY=${fontAlignY}${descParam}${descSize}${descAlignY}${reversal}${stroke}${strokeWidth}${textBg}`;

  return (
    <div className="space-y-4 text-sm">
      {/* Banner Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border">
        <span className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <ImageIcon className="w-4 h-4 text-blue-500" /> Header Type
        </span>
        <div className="flex rounded-xl border border-border bg-background p-1 gap-1">
          <button
            type="button"
            onClick={() => onUpdate({ bannerType: 'capsule' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              isCapsule ? 'bg-secondary font-semibold text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Animated Wave Generator
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ bannerType: 'image' })}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              !isCapsule ? 'bg-secondary font-semibold text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Static Image / Wallpaper
          </button>
        </div>
      </div>

      {isCapsule ? (
        <div className="space-y-4 p-4 rounded-2xl border border-border bg-card">
          {/* Live Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Wave Banner Preview
              </span>
              <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md">
                {type} &bull; {animation}
              </span>
            </div>
            <div className="rounded-xl overflow-hidden border border-border bg-slate-950 flex items-center justify-center p-2 min-h-[100px] shadow-inner">
              <img
                src={capsulePreviewUrl}
                alt="Capsule Banner Preview"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Categorized Tabs to Prevent Button Overload */}
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/30 border border-border/80">
            {EDITOR_TABS.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] py-1.5 px-3 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Wave & Content */}
          {activeTab === 'content' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold mb-1.5 text-foreground flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-blue-500" /> Header Title
                  </label>
                  <Input
                    value={block.capsuleText || ''}
                    onChange={(e) => onUpdate({ capsuleText: e.target.value })}
                    placeholder="e.g. Hi, I'm Alex"
                    className="font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5 text-foreground flex items-center gap-1.5 text-sm">
                    <Type className="w-4 h-4 text-blue-500" /> Subtitle / Tagline (Optional)
                  </label>
                  <Input
                    value={block.capsuleDesc || ''}
                    onChange={(e) => onUpdate({ capsuleDesc: e.target.value })}
                    placeholder="Full Stack Developer & Open Source Creator"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold mb-1.5 text-foreground flex items-center gap-1.5 text-sm">
                    <Waves className="w-4 h-4 text-blue-500" /> Wave Curve Style
                    <Waves className="w-4 h-4 text-blue-500" /> Wave & Header Shape
                  </label>
                  <select
                    value={block.capsuleType || 'waving'}
                    onChange={(e) => onUpdate({ capsuleType: e.target.value })}
                    className="w-full h-9.5 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary"
                  >
                    {WAVE_TYPES.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1.5 text-foreground flex items-center gap-1.5 text-sm">
                    <Zap className="w-4 h-4 text-amber-500" /> Animation Effect
                  </label>
                  <select
                    value={block.capsuleAnimation || 'twinkling'}
                    onChange={(e) => onUpdate({ capsuleAnimation: e.target.value })}
                    className="w-full h-9.5 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary"
                  >
                    {ANIMATION_STYLES.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/70">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      Title Font Size: {block.capsuleFontSize || 48}px
                    </span>
                  </div>
                  <DebouncedSlider
                    min={24}
                    max={72}
                    value={block.capsuleFontSize || 48}
                    onChange={(val) => onUpdate({ capsuleFontSize: val })}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      Banner Height: {block.capsuleHeight || 200}px
                    </span>
                  </div>
                  <DebouncedSlider
                    min={120}
                    max={320}
                    value={block.capsuleHeight || 200}
                    onChange={(val) => onUpdate({ capsuleHeight: val })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Colors & Theme */}
          {activeTab === 'colors' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <label className="block font-semibold text-foreground flex items-center gap-1.5 text-sm">
                  <Palette className="w-4 h-4 text-blue-500" /> Curated Gradient Palettes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADIENT_PALETTES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        onUpdate({
                          capsuleColor: preset.color,
                          capsuleCustomColors: preset.value,
                        })
                      }
                      className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer text-left ${
                        (block.capsuleCustomColors === preset.value && (block.capsuleColor || 'gradient') === preset.color) ||
                        (preset.color === 'timeGradient' && block.capsuleColor === 'timeGradient') ||
                        (preset.color === 'transparent' && block.capsuleColor === 'transparent')
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold shadow-2xs'
                          : 'border-border bg-background hover:bg-secondary text-foreground'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/70">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Text Font Color</label>
                  <ColorInput
                    value={block.capsuleFontColor || 'ffffff'}
                    onChange={(hex) => onUpdate({ capsuleFontColor: hex })}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Custom Gradient Stops</label>
                  <Input
                    value={block.capsuleCustomColors || ''}
                    onChange={(e) => onUpdate({ capsuleCustomColors: e.target.value, capsuleColor: 'gradient' })}
                    placeholder="e.g. 0:00f2fe,100:4facfe"
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Fine Tuning */}
          {activeTab === 'tuning' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                    Vertical Text Position (Y): {block.capsuleFontAlignY || 35}%
                  </label>
                  <DebouncedSlider
                    min={10}
                    max={80}
                    value={block.capsuleFontAlignY || 35}
                    onChange={(val) => onUpdate({ capsuleFontAlignY: val })}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                    Subtitle Font Size: {block.capsuleDescSize || 20}px
                  </label>
                  <DebouncedSlider
                    min={12}
                    max={32}
                    value={block.capsuleDescSize || 20}
                    onChange={(val) => onUpdate({ capsuleDescSize: val })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/70">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-background cursor-pointer hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={block.capsuleReversal ?? false}
                    onChange={(e) => onUpdate({ capsuleReversal: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs sm:text-sm text-foreground font-semibold flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-blue-500" /> Invert Wave Curve
                    </span>
                    <p className="text-xs text-muted-foreground">Flipping top and bottom curve boundaries</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-background cursor-pointer hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={block.capsuleTextBg ?? false}
                    onChange={(e) => onUpdate({ capsuleTextBg: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs sm:text-sm text-foreground font-semibold">
                      Solid Text Background Pill
                    </span>
                    <p className="text-xs text-muted-foreground">Adds high contrast backdrop around text</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Tab 4: Extras & Greeting */}
          {activeTab === 'extras' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Profile Views Counter */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground flex items-center gap-2 text-sm cursor-pointer">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>Profile Views Counter (komarev.com)</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={block.showProfileViews !== false}
                    onChange={(e) => onUpdate({ showProfileViews: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {block.showProfileViews !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">GitHub Username</label>
                      <Input
                        value={block.githubUsername || ''}
                        onChange={(e) => onUpdate({ githubUsername: e.target.value })}
                        placeholder="username"
                        className="font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Badge Label</label>
                      <Input
                        value={block.viewsLabel || 'Profile views'}
                        onChange={(e) => onUpdate({ viewsLabel: e.target.value })}
                        placeholder="Profile views"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Badge Color</label>
                      <ColorInput
                        value={block.viewsColor || '0e75b6'}
                        onChange={(hex) => onUpdate({ viewsColor: hex })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Greeting Title Header */}
              <div className="p-3.5 rounded-xl border border-border bg-background space-y-2.5">
                <label className="block font-semibold text-foreground text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-500" /> Greeting Headline Text
                </label>
                <Input
                  value={block.titleText || ''}
                  onChange={(e) => onUpdate({ titleText: e.target.value })}
                  placeholder="Hi there, welcome to my GitHub profile!"
                  className="font-semibold text-sm"
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="toc-style"
                    checked={block.useTocStyle ?? false}
                    onChange={(e) => onUpdate({ useTocStyle: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="toc-style" className="text-xs text-muted-foreground cursor-pointer">
                    Wrap inside center summary tag (<code className="text-blue-500 font-mono">&lt;div id="toc"&gt;&lt;summary&gt;...</code>)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Banner Mode */
        <div className="space-y-3.5 p-4 rounded-2xl border border-border bg-card">
          <div>
            <label className="block font-semibold mb-1.5 text-foreground text-sm">Wallpaper / Image URL</label>
            <div className="flex gap-2">
              <Input
                value={block.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                placeholder="https://example.com/banner.jpg"
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdate({ imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' })}
                className="shrink-0 text-xs"
              >
                Sample Image
              </Button>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1.5 text-foreground text-sm">Image Alt Text</label>
            <Input
              value={block.imageAlt || ''}
              onChange={(e) => onUpdate({ imageAlt: e.target.value })}
              placeholder="Profile Header Banner"
              className="text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
