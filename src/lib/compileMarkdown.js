import { buildShieldBadgeUrl } from './utils';

export function compileMarkdown(blocks = []) {
  const sections = [];

  for (const block of blocks) {
    let sectionMd = '';

    switch (block.type) {
      case 'banner':
        sectionMd = compileBanner(block);
        break;
      case 'hero':
        sectionMd = compileHero(block);
        break;
      case 'rapid-fire':
      case 'about-me':
        sectionMd = compileRapidFire(block);
        break;
      case 'skills':
        sectionMd = compileSkills(block);
        break;
      case 'projects':
        sectionMd = compileProjects(block);
        break;
      case 'experience':
        sectionMd = compileExperience(block);
        break;
      case 'github-stats':
        sectionMd = compileGitHubStats(block);
        break;
      case 'custom-markdown':
        sectionMd = compileCustomMarkdown(block);
        break;
      default:
        break;
    }

    if (sectionMd && sectionMd.trim()) {
      sections.push(sectionMd.trim());
    }
  }

  return sections.join('\n\n---\n\n') + '\n';
}

function getAlignmentWrapper(alignment, content) {
  if (!alignment || alignment === 'left') {
    return content;
  }
  return `<div align="${alignment}">\n\n${content}\n\n</div>`;
}

function compileBanner(block) {
  const parts = [];

  // Top Banner Image
  if (block.bannerType === 'capsule' && block.capsuleText) {
    const textParam = encodeURIComponent(block.capsuleText);
    const colorParam = block.capsuleColor || 'gradient';
    const typeParam = block.capsuleType || 'waving';
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

    const capsuleUrl = `https://capsule-render.vercel.app/api?type=${typeParam}&height=${height}&color=${colorParam}${customColors}&text=${textParam}&fontSize=${fontSize}&fontColor=${fontColor}&animation=${animation}&fontAlignY=${fontAlignY}${descParam}${descSize}${descAlignY}${reversal}${stroke}${strokeWidth}${textBg}`;
    parts.push(`<img src="${capsuleUrl}" alt="Banner" width="100%" />`);
  } else if (block.imageUrl) {
    parts.push(`![${block.imageAlt || 'Banner'}](${block.imageUrl})`);
  }

  // Profile views counter badge
  if (block.showProfileViews && block.githubUsername) {
    const viewsLabel = encodeURIComponent(block.viewsLabel || 'Profile views');
    const color = (block.viewsColor || '0e75b6').replace('#', '');
    const style = block.viewsStyle || 'flat';
    const viewsUrl = `https://komarev.com/ghpvc/?username=${encodeURIComponent(block.githubUsername)}&label=${viewsLabel}&color=${color}&style=${style}`;
    parts.push(`![Profile views](${viewsUrl})`);
  }

  // Header Title / Subtitle inside TOC style if enabled
  if (block.titleText) {
    if (block.useTocStyle) {
      parts.push(`<div id="toc">\n  <ul align="${block.alignment || 'center'}" style="list-style: none">\n    <summary>\n      <h1>${block.titleText}</h1>\n    </summary>\n  </ul>\n</div>`);
    } else {
      parts.push(`## ${block.titleText}`);
    }
  }

  const combined = parts.join('\n\n');
  return getAlignmentWrapper(block.alignment, combined);
}

function compileHero(block) {
  const parts = [];

  // Avatar
  if (block.avatarUrl) {
    const borderRadius = block.avatarShape === 'circle' ? '50%' : block.avatarShape === 'rounded' ? '16px' : '0px';
    parts.push(`<img src="${block.avatarUrl}" width="${block.avatarSize || 130}" height="${block.avatarSize || 130}" style="border-radius: ${borderRadius}; object-fit: cover;" alt="${block.name || 'Avatar'}" />`);
  }

  // Name Title
  if (block.name) {
    parts.push(`# Hi there, I'm ${block.name} 👋`);
  }

  // Subtitle / Typing SVG
  if (block.subtitleType === 'typing' && block.typingLines && block.typingLines.length > 0) {
    const linesParam = block.typingLines.map((line) => encodeURIComponent(line)).join(';');
    const colorParam = (block.typingColor || '2bbc8a').replace('#', '');
    const fontParam = encodeURIComponent(block.typingFont || 'Fira Code');
    const centerParam = block.alignment === 'center' ? 'true' : 'false';
    const typingSvgUrl = `https://readme-typing-svg.demolab.com?font=${fontParam}&pause=1200&color=${colorParam}&center=${centerParam}&vCenter=true&width=450&lines=${linesParam}`;
    
    parts.push(`[![Typing SVG](${typingSvgUrl})](https://git.io/typing-svg)`);
  } else if (block.subtitleText) {
    parts.push(`### ${block.subtitleText}`);
  }

  // Bio
  if (block.bioText) {
    parts.push(block.bioText);
  }

  // Social Badges
  if (block.socialBadges && block.socialBadges.length > 0) {
    const badgesMd = block.socialBadges.map((b) => {
      const badgeUrl = buildShieldBadgeUrl({
        label: '',
        message: b.label || b.platform,
        color: b.color || '000000',
        style: block.badgeStyle || 'for-the-badge',
        logo: b.logo || b.platform.toLowerCase(),
        logoColor: 'white',
      });
      return `[![${b.platform}](${badgeUrl})](${b.url})`;
    }).join(' ');

    parts.push(badgesMd);
  }

  const combined = parts.join('\n\n');
  return getAlignmentWrapper(block.alignment, combined);
}

function compileRapidFire(block) {
  const parts = [];

  if (!block.hideHeader && block.title) {
    parts.push(`### ${block.title}`);
  }

  if (block.tagline) {
    parts.push(`**<h3 align="${block.alignment || 'left'}">${block.tagline}</h3>**`);
  }

  const itemsList = (block.items || [])
    .filter((item) => item.text && item.text.trim())
    .map((item) => {
      const icon = item.icon ? `${item.icon} ` : '- ';
      const label = item.label ? `${item.label}: ` : '';
      return `${icon}${label}**${item.text.trim()}**`;
    });

  if (itemsList.length > 0) {
    parts.push(itemsList.join('\n'));
  }

  const combined = parts.join('\n\n');
  return getAlignmentWrapper(block.alignment, combined);
}

function compileSkills(block) {
  const parts = [];

  if (!block.hideHeader && block.title) {
    parts.push(`### ${block.title}`);
  }

  const categories = block.categories || [];

  for (const category of categories) {
    const catParts = [];
    if (category.name) {
      catParts.push(`#### ${category.name}`);
    }

    if (category.badges && category.badges.length > 0) {
      if (block.useFlexContainer) {
        // Modern flex-wrap HTML badges layout
        const badgeTags = category.badges.map((b) => {
          const badgeUrl = b.customUrl || buildShieldBadgeUrl({
            label: b.label || '',
            message: b.name,
            color: b.color || '20232A',
            style: block.badgeStyle || 'flat',
            logo: b.logo || b.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
            logoColor: 'white',
          });
          return `<img src="${badgeUrl}" height="${block.badgeHeight || 28}" alt="${b.name}" style="margin-right: 4px; margin-bottom: 4px;" />`;
        }).join(' ');

        const justify = block.alignment === 'center' ? 'center' : block.alignment === 'right' ? 'flex-end' : 'flex-start';
        catParts.push(`<div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: ${justify};">${badgeTags}</div>`);
      } else {
        // Markdown badges
        const badgeList = category.badges.map((b) => {
          if (b.customUrl) {
            return `![${b.name}](${b.customUrl})`;
          }
          const badgeUrl = buildShieldBadgeUrl({
            label: b.label || '',
            message: b.name,
            color: b.color || '20232A',
            style: block.badgeStyle || 'flat',
            logo: b.logo || b.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
            logoColor: 'white',
          });
          return `![${b.name}](${badgeUrl})`;
        }).join(' ');

        catParts.push(badgeList);
      }
    }

    if (catParts.length > 0) {
      parts.push(catParts.join('\n\n'));
    }
  }

  const content = parts.join('\n\n');
  return getAlignmentWrapper(block.alignment, content);
}

function compileProjects(block) {
  const parts = [];

  if (!block.hideHeader && block.title) {
    parts.push(`### ${block.title}`);
  }

  const items = block.items || [];
  if (items.length === 0) {
    return parts.join('\n\n');
  }

  const cols = block.layout === '3-col' ? 3 : 2;
  const colWidth = cols === 3 ? '33%' : '50%';

  let tableHtml = '<table>\n';
  
  for (let i = 0; i < items.length; i += cols) {
    tableHtml += '  <tr>\n';
    for (let c = 0; c < cols; c++) {
      const item = items[i + c];
      if (item) {
        let cellContent = '';
        if (item.imageUrl) {
          const imgLink = item.demoUrl || item.repoUrl || '#';
          cellContent += `<a href="${imgLink}"><img src="${item.imageUrl}" width="100%" alt="${item.title}" style="max-height: 180px; object-fit: cover; border-radius: 8px;" /></a><br/>\n`;
        }
        cellContent += `<h3><a href="${item.repoUrl}">${item.title}</a></h3>\n`;
        if (item.description) {
          cellContent += `<p>${item.description}</p>\n`;
        }
        if (item.techBadges && item.techBadges.length > 0) {
          const techBadgesHtml = item.techBadges.map((tech) => {
            const badgeUrl = buildShieldBadgeUrl({
              label: '',
              message: tech,
              color: '20232A',
              style: 'flat-square',
              logo: tech.toLowerCase().replace(/[^a-z0-9]/g, ''),
              logoColor: 'white',
            });
            return `<img src="${badgeUrl}" alt="${tech}" />`;
          }).join(' ');
          cellContent += `<p>${techBadgesHtml}</p>\n`;
        }
        
        const links = [];
        if (item.repoUrl) {
          links.push(`<a href="${item.repoUrl}">🔗 GitHub</a>`);
        }
        if (item.demoUrl) {
          links.push(`<a href="${item.demoUrl}">🚀 Live Demo</a>`);
        }
        if (links.length > 0) {
          cellContent += `<p>${links.join(' &bull; ')}</p>\n`;
        }

        tableHtml += `    <td width="${colWidth}" valign="top">\n${cellContent}    </td>\n`;
      } else {
        tableHtml += `    <td width="${colWidth}" valign="top"></td>\n`;
      }
    }
    tableHtml += '  </tr>\n';
  }
  tableHtml += '</table>';

  parts.push(tableHtml);

  const content = parts.join('\n\n');
  return getAlignmentWrapper(block.alignment, content);
}

function compileExperience(block) {
  const parts = [];

  if (!block.hideHeader && block.title) {
    parts.push(`### ${block.title}`);
  }

  for (const item of block.items || []) {
    const itemParts = [];
    const companyText = item.companyUrl ? `[${item.company}](${item.companyUrl})` : item.company;
    
    itemParts.push(`#### ${item.role} @ ${companyText}`);
    
    const meta = [];
    if (item.dates) meta.push(`📅 ${item.dates}`);
    if (item.location) meta.push(`📍 ${item.location}`);
    if (meta.length > 0) {
      itemParts.push(`*${meta.join(' • ')}*`);
    }

    if (item.description) {
      itemParts.push(item.description);
    }

    if (item.bullets && item.bullets.length > 0) {
      const bulletList = item.bullets
        .filter((b) => b && b.trim().length > 0)
        .map((b) => `- ${b}`)
        .join('\n');
      if (bulletList) {
        itemParts.push(bulletList);
      }
    }

    parts.push(itemParts.join('\n\n'));
  }

  const content = parts.join('\n\n');
  return getAlignmentWrapper(block.alignment, content);
}

function compileGitHubStats(block) {
  const parts = [];

  if (!block.hideHeader && block.title) {
    parts.push(`### ${block.title}`);
  }

  const username = block.username || 'torvalds';
  const theme = block.theme || 'default';
  const align = block.alignment || 'center';
  const width = block.cardWidth || '48%';

  // Stats cards
  const cards = [];

  if (block.showStatsCard !== false) {
    const statsUrl = `https://github-stats-extended.vercel.app/api?username=${username}&theme=${theme}&cache_seconds=1800&border_radius=4&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&line_height=25`;
    cards.push(`<img width="${width}" src="${statsUrl}" alt="GitHub stats Card" />`);
  }

  if (block.showTopLangs !== false) {
    const topLangsUrl = `https://github-stats-extended.vercel.app/api/top-langs?username=${username}&theme=${theme}&cache_seconds=1800&border_radius=4&hide_title=false&layout=compact&langs_count=5&card_width=400&hide_progress=false`;
    cards.push(`<img width="${width}" src="${topLangsUrl}" alt="GitHub top-langs Card" />`);
  }

  if (block.showStreakCard !== false) {
    const streakUrl = `https://streak-stats.demolab.com/?user=${username}&theme=${theme}&hide_border=false&border_radius=4.5&date_format=M+j%5B%2C+Y%5D&mode=daily&disable_animations=false&hide_total_contributions=false&hide_current_streak=false&hide_longest_streak=false&exclude_days=&locale=en&card_height=200`;
    cards.push(`<img width="${width}" src="${streakUrl}" alt="GitHub streak Card" />`);
  }

  if (cards.length > 0) {
    for (const card of cards) {
      parts.push(`<p align="${align}">\n  ${card}\n</p>`);
    }
  }

  return parts.join('\n');
}

function compileCustomMarkdown(block) {
  const parts = [];
  if (!block.hideHeader && block.title) {
    parts.push(`### ${block.title}`);
  }
  if (block.content) {
    parts.push(block.content);
  }
  const content = parts.join('\n\n');
  return getAlignmentWrapper(block.alignment, content);
}
