import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { loadProfileState, saveProfileState, clearProfileState, getInitialState } from '../lib/storage';
import { compileMarkdown } from '../lib/compileMarkdown';
import { generateId } from '../lib/utils';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [state, setState] = useState(() => loadProfileState());
  const debounceTimerRef = useRef(null);

  // Debounced auto-save to localStorage
  useEffect(() => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      saveProfileState(state);
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state]);

  const compiledMarkdown = useMemo(() => {
    return compileMarkdown(state.blocks);
  }, [state.blocks]);

  const addBlock = useCallback((type, index) => {
    setState((prev) => {
      let newBlock;

      if (type === 'banner') {
        newBlock = {
          id: generateId('block_banner'),
          type: 'banner',
          title: 'Banner & Header',
          hideHeader: true,
          alignment: 'center',
          badgeStyle: 'flat',
          isCollapsed: false,
          bannerType: 'capsule',
          imageUrl: '',
          imageAlt: 'Banner',
          capsuleText: 'Welcome to my Profile',
          capsuleType: 'waving',
          capsuleColor: 'gradient',
          capsuleCustomColors: '6,11,20,29',
          capsuleHeight: 200,
          capsuleFontSize: 48,
          capsuleAnimation: 'twinkling',
          showProfileViews: true,
          githubUsername: 'your-username',
          viewsLabel: 'Profile views',
          viewsColor: '0e75b6',
          viewsStyle: 'flat',
          titleText: 'Hi there, welcome!',
          useTocStyle: false,
        };
      } else if (type === 'hero') {
        newBlock = {
          id: generateId('block_hero'),
          type: 'hero',
          title: 'Hero Section',
          hideHeader: true,
          alignment: 'center',
          badgeStyle: 'for-the-badge',
          isCollapsed: false,
          name: 'Your Name',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          avatarShape: 'circle',
          avatarSize: 120,
          subtitleType: 'typing',
          subtitleText: 'Full Stack Developer & Open Source Contributor',
          typingLines: ['Full Stack Developer', 'Building modern web applications', 'Open Source Creator'],
          typingColor: '61afef',
          typingFont: 'Fira Code',
          bioText: 'Passionate developer creating robust, accessible, and scalable web applications with a focus on performance and user experience.',
          socialBadges: [
            { id: generateId('soc'), platform: 'GitHub', label: 'GitHub', url: 'https://github.com', color: '181717', logo: 'github' },
            { id: generateId('soc'), platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com', color: '0A66C2', logo: 'linkedin' },
          ],
        };
      } else if (type === 'rapid-fire' || type === 'about-me') {
        newBlock = {
          id: generateId('block_rapidfire'),
          type: 'rapid-fire',
          title: 'About Me',
          hideHeader: false,
          alignment: 'left',
          badgeStyle: 'flat',
          isCollapsed: false,
          tagline: 'Passionate fullstack developer, creating robust and scalable web applications.',
          items: [
            { id: generateId('rf'), icon: '-', label: "I'm currently working on", text: 'Open source web applications and tools' },
            { id: generateId('rf'), icon: '-', label: "I'm currently learning", text: 'Distributed systems and backend architecture' },
            { id: generateId('rf'), icon: '-', label: 'Ask me about', text: 'React, TypeScript, Cloud, UI/UX' },
            { id: generateId('rf'), icon: '-', label: 'Fun fact', text: 'Always experimenting with new developer tools and workflows' },
          ],
        };
      } else if (type === 'skills') {
        newBlock = {
          id: generateId('block_skills'),
          type: 'skills',
          title: 'Skills & Technologies',
          hideHeader: false,
          alignment: 'center',
          badgeStyle: 'flat',
          isCollapsed: false,
          useFlexContainer: true,
          badgeHeight: 28,
          categories: [
            {
              id: generateId('cat'),
              name: '',
              badges: [
                { id: generateId('badge'), name: 'TypeScript', color: '3178C6', logo: 'typescript' },
                { id: generateId('badge'), name: 'JavaScript', color: 'F7DF1E', logo: 'javascript' },
                { id: generateId('badge'), name: 'React', color: '20232A', logo: 'react' },
                { id: generateId('badge'), name: 'Next.js', color: '000000', logo: 'nextdotjs' },
                { id: generateId('badge'), name: 'Tailwind CSS', color: '38B2AC', logo: 'tailwind-css' },
                { id: generateId('badge'), name: 'Node.js', color: '339933', logo: 'nodedotjs' },
                { id: generateId('badge'), name: 'PostgreSQL', color: '316192', logo: 'postgresql' },
                { id: generateId('badge'), name: 'Python', color: '306998', logo: 'python' },
                { id: generateId('badge'), name: 'Docker', color: '2496ED', logo: 'docker' },
                { id: generateId('badge'), name: 'Figma', color: 'F24E1E', logo: 'figma' },
              ],
            },
          ],
        };
      } else if (type === 'github-stats') {
        newBlock = {
          id: generateId('block_stats'),
          type: 'github-stats',
          title: 'GitHub Stats',
          hideHeader: false,
          alignment: 'center',
          badgeStyle: 'flat',
          isCollapsed: false,
          username: 'your-username',
          theme: 'default',
          cardWidth: '48%',
          showStatsCard: true,
          showTopLangs: true,
          showStreakCard: true,
        };
      } else if (type === 'experience') {
        newBlock = {
          id: generateId('block_experience'),
          type: 'experience',
          title: 'Work Experience',
          hideHeader: false,
          alignment: 'left',
          badgeStyle: 'flat',
          isCollapsed: false,
          items: [
            {
              id: generateId('exp'),
              role: 'Fullstack Engineer',
              company: 'Tech Company',
              companyUrl: 'https://github.com',
              dates: '2023 - Present',
              location: 'Remote',
              description: 'Creating robust and scalable web applications with modern technologies.',
              bullets: ['Developed high-performance web applications with React and Node.js', 'Collaborated on distributed infrastructure and API designs'],
            },
          ],
        };
      } else if (type === 'projects') {
        newBlock = {
          id: generateId('block_projects'),
          type: 'projects',
          title: 'Featured Projects',
          hideHeader: false,
          alignment: 'left',
          badgeStyle: 'flat',
          isCollapsed: false,
          layout: '2-col',
          items: [
            {
              id: generateId('proj'),
              title: 'Project Showcase',
              description: 'A robust and scalable web application built with React and Tailwind CSS.',
              repoUrl: 'https://github.com',
              demoUrl: '',
              imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
              techBadges: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
            },
          ],
        };
      } else {
        newBlock = {
          id: generateId('block_custom'),
          type: 'custom-markdown',
          title: 'Custom Markdown',
          hideHeader: false,
          alignment: 'left',
          badgeStyle: 'flat',
          isCollapsed: false,
          content: 'Add any custom markdown, badges, tables, or embeds here!',
        };
      }

      const nextBlocks = [...prev.blocks];
      if (typeof index === 'number' && index >= 0 && index <= nextBlocks.length) {
        nextBlocks.splice(index, 0, newBlock);
      } else {
        nextBlocks.push(newBlock);
      }

      return { ...prev, blocks: nextBlocks };
    });
  }, []);

  const removeBlock = useCallback((blockId) => {
    setState((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }));
  }, []);

  const duplicateBlock = useCallback((blockId) => {
    setState((prev) => {
      const index = prev.blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return prev;

      const target = prev.blocks[index];
      const cloned = JSON.parse(JSON.stringify(target));
      cloned.id = generateId(`block_${cloned.type}`);
      cloned.title = `${cloned.title || cloned.type} (Copy)`;

      // Regenerate internal item IDs
      if (cloned.type === 'experience') {
        cloned.items = (cloned.items || []).map((it) => ({ ...it, id: generateId('exp') }));
      } else if (cloned.type === 'rapid-fire' || cloned.type === 'about-me') {
        cloned.items = (cloned.items || []).map((it) => ({ ...it, id: generateId('rf') }));
      } else if (cloned.type === 'skills') {
        cloned.categories = (cloned.categories || []).map((cat) => ({
          ...cat,
          id: generateId('cat'),
          badges: (cat.badges || []).map((b) => ({ ...b, id: generateId('badge') })),
        }));
      } else if (cloned.type === 'projects') {
        cloned.items = (cloned.items || []).map((it) => ({ ...it, id: generateId('proj') }));
      } else if (cloned.type === 'hero') {
        cloned.socialBadges = (cloned.socialBadges || []).map((s) => ({ ...s, id: generateId('soc') }));
      }

      const nextBlocks = [...prev.blocks];
      nextBlocks.splice(index + 1, 0, cloned);
      return { ...prev, blocks: nextBlocks };
    });
  }, []);

  const updateBlock = useCallback((blockId, updater) => {
    setState((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => {
        if (b.id !== blockId) return b;
        if (typeof updater === 'function') {
          return updater(b);
        }
        return { ...b, ...updater };
      }),
    }));
  }, []);

  const toggleBlockCollapse = useCallback((blockId) => {
    setState((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, isCollapsed: !b.isCollapsed } : b)),
    }));
  }, []);

  const reorderBlocks = useCallback((activeId, overId) => {
    if (activeId === overId) return;

    setState((prev) => {
      const oldIndex = prev.blocks.findIndex((b) => b.id === activeId);
      const newIndex = prev.blocks.findIndex((b) => b.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const nextBlocks = [...prev.blocks];
      const [moved] = nextBlocks.splice(oldIndex, 1);
      nextBlocks.splice(newIndex, 0, moved);

      return { ...prev, blocks: nextBlocks };
    });
  }, []);

  const reorderItems = useCallback((blockId, activeId, overId) => {
    if (activeId === overId) return;

    setState((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => {
        if (block.id !== blockId) return block;

        if (block.type === 'experience') {
          const oldIndex = (block.items || []).findIndex((it) => it.id === activeId);
          const newIndex = (block.items || []).findIndex((it) => it.id === overId);
          if (oldIndex === -1 || newIndex === -1) return block;

          const nextItems = [...block.items];
          const [moved] = nextItems.splice(oldIndex, 1);
          nextItems.splice(newIndex, 0, moved);
          return { ...block, items: nextItems };
        }

        if (block.type === 'rapid-fire' || block.type === 'about-me') {
          const oldIndex = (block.items || []).findIndex((it) => it.id === activeId);
          const newIndex = (block.items || []).findIndex((it) => it.id === overId);
          if (oldIndex === -1 || newIndex === -1) return block;

          const nextItems = [...block.items];
          const [moved] = nextItems.splice(oldIndex, 1);
          nextItems.splice(newIndex, 0, moved);
          return { ...block, items: nextItems };
        }

        if (block.type === 'projects') {
          const oldIndex = (block.items || []).findIndex((it) => it.id === activeId);
          const newIndex = (block.items || []).findIndex((it) => it.id === overId);
          if (oldIndex === -1 || newIndex === -1) return block;

          const nextItems = [...block.items];
          const [moved] = nextItems.splice(oldIndex, 1);
          nextItems.splice(newIndex, 0, moved);
          return { ...block, items: nextItems };
        }

        if (block.type === 'hero') {
          const oldIndex = (block.socialBadges || []).findIndex((s) => s.id === activeId);
          const newIndex = (block.socialBadges || []).findIndex((s) => s.id === overId);
          if (oldIndex === -1 || newIndex === -1) return block;

          const nextBadges = [...block.socialBadges];
          const [moved] = nextBadges.splice(oldIndex, 1);
          nextBadges.splice(newIndex, 0, moved);
          return { ...block, socialBadges: nextBadges };
        }

        if (block.type === 'skills') {
          const updatedCategories = (block.categories || []).map((cat) => {
            const bOldIdx = (cat.badges || []).findIndex((b) => b.id === activeId);
            const bNewIdx = (cat.badges || []).findIndex((b) => b.id === overId);
            if (bOldIdx !== -1 && bNewIdx !== -1) {
              const nextBadges = [...cat.badges];
              const [moved] = nextBadges.splice(bOldIdx, 1);
              nextBadges.splice(bNewIdx, 0, moved);
              return { ...cat, badges: nextBadges };
            }
            return cat;
          });

          return { ...block, categories: updatedCategories };
        }

        return block;
      }),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    clearProfileState();
    const fresh = getInitialState();
    setState(fresh);
  }, []);

  const setBlocks = useCallback((blocks) => {
    setState((prev) => ({
      ...prev,
      blocks,
    }));
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        state,
        compiledMarkdown,
        addBlock,
        removeBlock,
        duplicateBlock,
        updateBlock,
        toggleBlockCollapse,
        reorderBlocks,
        reorderItems,
        resetToDefault,
        setBlocks,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
