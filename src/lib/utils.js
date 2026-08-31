import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

export function buildShieldBadgeUrl({
  label = '',
  message,
  color = '000000',
  style = 'flat',
  logo = '',
  logoColor = 'white',
}) {
  const cleanColor = (color || '000000').replace('#', '');
  const cleanLogoColor = (logoColor || 'white').replace('#', '');
  
  const encodedLabel = label ? encodeURIComponent(label) : '';
  const encodedMessage = encodeURIComponent(message || '');
  const path = encodedLabel ? `${encodedLabel}-${encodedMessage}` : encodedMessage;
  
  const params = new URLSearchParams();
  if (style && style !== 'flat') {
    params.append('style', style);
  }
  if (logo) {
    params.append('logo', logo);
  }
  if (cleanLogoColor && logo) {
    params.append('logoColor', cleanLogoColor);
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return `https://img.shields.io/badge/${path}-${cleanColor}${query}`;
}

export const POPULAR_SKILL_BADGES = [
  // 1. Languages
  { name: 'JavaScript', logo: 'javascript', color: 'F7DF1E', category: 'Languages' },
  { name: 'TypeScript', logo: 'typescript', color: '3178C6', category: 'Languages' },
  { name: 'Python', logo: 'python', color: '3776AB', category: 'Languages' },
  { name: 'C++', logo: 'cplusplus', color: '00599C', category: 'Languages' },
  { name: 'C', logo: 'c', color: 'A8B9CC', category: 'Languages' },
  { name: 'C#', logo: 'csharp', color: '239120', category: 'Languages' },
  { name: 'Java', logo: 'openjdk', color: 'ED8B00', category: 'Languages' },
  { name: 'Go', logo: 'go', color: '00ADD8', category: 'Languages' },
  { name: 'Rust', logo: 'rust', color: '000000', category: 'Languages' },
  { name: 'PHP', logo: 'php', color: '777BB4', category: 'Languages' },
  { name: 'Ruby', logo: 'ruby', color: 'CC342D', category: 'Languages' },
  { name: 'Kotlin', logo: 'kotlin', color: '7F52FF', category: 'Languages' },
  { name: 'Swift', logo: 'swift', color: 'F05138', category: 'Languages' },
  { name: 'Dart', logo: 'dart', color: '0175C2', category: 'Languages' },
  { name: 'Scala', logo: 'scala', color: 'DC322F', category: 'Languages' },
  { name: 'R', logo: 'r', color: '276DC3', category: 'Languages' },
  { name: 'Elixir', logo: 'elixir', color: '4B275F', category: 'Languages' },
  { name: 'Lua', logo: 'lua', color: '2C2D72', category: 'Languages' },
  { name: 'Shell / Bash', logo: 'gnubash', color: '4EAA25', category: 'Languages' },
  { name: 'HTML5', logo: 'html5', color: 'E34F26', category: 'Languages' },
  { name: 'CSS3', logo: 'css3', color: '1572B6', category: 'Languages' },
  { name: 'Sass', logo: 'sass', color: 'CC6699', category: 'Languages' },
  { name: 'SQL', logo: 'sqlite', color: '003B57', category: 'Languages' },

  // 2. Frontend & Mobile
  { name: 'React', logo: 'react', color: '20232A', category: 'Frontend & Mobile' },
  { name: 'React Native', logo: 'react', color: '61DAFB', category: 'Frontend & Mobile' },
  { name: 'Next.js', logo: 'nextdotjs', color: '000000', category: 'Frontend & Mobile' },
  { name: 'Vue.js', logo: 'vuedotjs', color: '4FC08D', category: 'Frontend & Mobile' },
  { name: 'Nuxt.js', logo: 'nuxtdotjs', color: '00DC82', category: 'Frontend & Mobile' },
  { name: 'Angular', logo: 'angular', color: 'DD0031', category: 'Frontend & Mobile' },
  { name: 'Svelte', logo: 'svelte', color: 'FF3E00', category: 'Frontend & Mobile' },
  { name: 'SvelteKit', logo: 'svelte', color: 'FF3E00', category: 'Frontend & Mobile' },
  { name: 'Astro', logo: 'astro', color: 'BC52EE', category: 'Frontend & Mobile' },
  { name: 'Remix', logo: 'remix', color: '000000', category: 'Frontend & Mobile' },
  { name: 'SolidJS', logo: 'solid', color: '2C4F7C', category: 'Frontend & Mobile' },
  { name: 'Flutter', logo: 'flutter', color: '02569B', category: 'Frontend & Mobile' },
  { name: 'Electron', logo: 'electron', color: '47848F', category: 'Frontend & Mobile' },
  { name: 'Tailwind CSS', logo: 'tailwindcss', color: '06B6D4', category: 'Frontend & Mobile' },
  { name: 'Bootstrap', logo: 'bootstrap', color: '7952B3', category: 'Frontend & Mobile' },
  { name: 'Material UI', logo: 'mui', color: '007FFF', category: 'Frontend & Mobile' },
  { name: 'Chakra UI', logo: 'chakraui', color: '319795', category: 'Frontend & Mobile' },
  { name: 'Radix UI', logo: 'radixui', color: '161618', category: 'Frontend & Mobile' },
  { name: 'Shadcn UI', logo: 'shadcnui', color: '000000', category: 'Frontend & Mobile' },
  { name: 'Three.js', logo: 'threedotjs', color: '000000', category: 'Frontend & Mobile' },
  { name: 'Vite', logo: 'vite', color: '646CFF', category: 'Frontend & Mobile' },
  { name: 'Webpack', logo: 'webpack', color: '8DD6F9', category: 'Frontend & Mobile' },

  // 3. Backend & APIs
  { name: 'Node.js', logo: 'nodedotjs', color: '339933', category: 'Backend & APIs' },
  { name: 'Express.js', logo: 'express', color: '000000', category: 'Backend & APIs' },
  { name: 'NestJS', logo: 'nestjs', color: 'E0234E', category: 'Backend & APIs' },
  { name: 'Fastify', logo: 'fastify', color: '000000', category: 'Backend & APIs' },
  { name: 'Django', logo: 'django', color: '092E20', category: 'Backend & APIs' },
  { name: 'Flask', logo: 'flask', color: '000000', category: 'Backend & APIs' },
  { name: 'FastAPI', logo: 'fastapi', color: '009688', category: 'Backend & APIs' },
  { name: 'Laravel', logo: 'laravel', color: 'FF2D20', category: 'Backend & APIs' },
  { name: 'Symfony', logo: 'symfony', color: '000000', category: 'Backend & APIs' },
  { name: 'Spring Boot', logo: 'springboot', color: '6DB33F', category: 'Backend & APIs' },
  { name: 'Ruby on Rails', logo: 'rubyonrails', color: 'D30001', category: 'Backend & APIs' },
  { name: '.NET Core', logo: 'dotnet', color: '512BD4', category: 'Backend & APIs' },
  { name: 'GraphQL', logo: 'graphql', color: 'E10098', category: 'Backend & APIs' },
  { name: 'Apollo GraphQL', logo: 'apollographql', color: '311C87', category: 'Backend & APIs' },
  { name: 'gRPC', logo: 'grpc', color: '244C5A', category: 'Backend & APIs' },
  { name: 'WebSockets', logo: 'socketdotio', color: '010101', category: 'Backend & APIs' },
  { name: 'Prisma', logo: 'prisma', color: '2D3748', category: 'Backend & APIs' },
  { name: 'Drizzle ORM', logo: 'drizzle', color: 'C5F74F', category: 'Backend & APIs' },
  { name: 'TypeORM', logo: 'typeorm', color: 'FE0803', category: 'Backend & APIs' },

  // 4. Databases & Storage
  { name: 'PostgreSQL', logo: 'postgresql', color: '4169E1', category: 'Databases & Storage' },
  { name: 'MySQL', logo: 'mysql', color: '4479A1', category: 'Databases & Storage' },
  { name: 'SQLite', logo: 'sqlite', color: '003B57', category: 'Databases & Storage' },
  { name: 'MongoDB', logo: 'mongodb', color: '47A248', category: 'Databases & Storage' },
  { name: 'Redis', logo: 'redis', color: 'DC382D', category: 'Databases & Storage' },
  { name: 'Supabase', logo: 'supabase', color: '3FCF8E', category: 'Databases & Storage' },
  { name: 'Firebase', logo: 'firebase', color: 'FFCA28', category: 'Databases & Storage' },
  { name: 'PlanetScale', logo: 'planetscale', color: '000000', category: 'Databases & Storage' },
  { name: 'DynamoDB', logo: 'amazondynamodb', color: '4053D6', category: 'Databases & Storage' },
  { name: 'MariaDB', logo: 'mariadb', color: '003545', category: 'Databases & Storage' },
  { name: 'Elasticsearch', logo: 'elasticsearch', color: '005571', category: 'Databases & Storage' },
  { name: 'Cassandra', logo: 'apachecassandra', color: '1287B1', category: 'Databases & Storage' },
  { name: 'Neo4j', logo: 'neo4j', color: '45818E', category: 'Databases & Storage' },
  { name: 'Appwrite', logo: 'appwrite', color: 'FD366E', category: 'Databases & Storage' },

  // 5. Cloud, DevOps & CI/CD
  { name: 'AWS', logo: 'amazonwebservices', color: '232F3E', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Google Cloud', logo: 'googlecloud', color: '4285F4', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Microsoft Azure', logo: 'microsoftazure', color: '0089D6', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Vercel', logo: 'vercel', color: '000000', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Netlify', logo: 'netlify', color: '00C7B7', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Cloudflare', logo: 'cloudflare', color: 'F38020', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Docker', logo: 'docker', color: '2496ED', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Kubernetes', logo: 'kubernetes', color: '326CE5', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Terraform', logo: 'terraform', color: '7B42BC', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Ansible', logo: 'ansible', color: 'EE0000', category: 'Cloud, DevOps & CI/CD' },
  { name: 'GitHub Actions', logo: 'githubactions', color: '2088FF', category: 'Cloud, DevOps & CI/CD' },
  { name: 'GitLab CI', logo: 'gitlab', color: 'FC6D26', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Jenkins', logo: 'jenkins', color: 'D24939', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Nginx', logo: 'nginx', color: '009639', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Linux', logo: 'linux', color: 'FCC624', category: 'Cloud, DevOps & CI/CD' },
  { name: 'Ubuntu', logo: 'ubuntu', color: 'E95420', category: 'Cloud, DevOps & CI/CD' },

  // 6. Testing & Tooling
  { name: 'Jest', logo: 'jest', color: 'C21325', category: 'Testing & Tooling' },
  { name: 'Vitest', logo: 'vitest', color: '6E9F18', category: 'Testing & Tooling' },
  { name: 'Cypress', logo: 'cypress', color: '69D3A7', category: 'Testing & Tooling' },
  { name: 'Playwright', logo: 'playwright', color: '2EAD33', category: 'Testing & Tooling' },
  { name: 'Postman', logo: 'postman', color: 'FF6C37', category: 'Testing & Tooling' },
  { name: 'Insomnia', logo: 'insomnia', color: '4000BF', category: 'Testing & Tooling' },
  { name: 'ESLint', logo: 'eslint', color: '4B32C3', category: 'Testing & Tooling' },
  { name: 'Prettier', logo: 'prettier', color: 'F7B93E', category: 'Testing & Tooling' },
  { name: 'Storybook', logo: 'storybook', color: 'FF4785', category: 'Testing & Tooling' },
  { name: 'Git', logo: 'git', color: 'F05032', category: 'Testing & Tooling' },
  { name: 'GitHub', logo: 'github', color: '181717', category: 'Testing & Tooling' },

  // 7. Design & IDEs
  { name: 'Visual Studio Code', logo: 'visualstudiocode', color: '007ACC', category: 'Design & IDEs' },
  { name: 'Visual Studio', logo: 'visualstudio', color: '5C2D91', category: 'Design & IDEs' },
  { name: 'IntelliJ IDEA', logo: 'intellijidea', color: '000000', category: 'Design & IDEs' },
  { name: 'WebStorm', logo: 'webstorm', color: '000000', category: 'Design & IDEs' },
  { name: 'PyCharm', logo: 'pycharm', color: '000000', category: 'Design & IDEs' },
  { name: 'Neovim', logo: 'neovim', color: '57A143', category: 'Design & IDEs' },
  { name: 'Vim', logo: 'vim', color: '019733', category: 'Design & IDEs' },
  { name: 'Notepad++', logo: 'notepadplusplus', color: '90E59A', category: 'Design & IDEs' },
  { name: 'Figma', logo: 'figma', color: 'F24E1E', category: 'Design & IDEs' },
  { name: 'Adobe Photoshop', logo: 'adobephotoshop', color: '31A8FF', category: 'Design & IDEs' },
  { name: 'Adobe Illustrator', logo: 'adobeillustrator', color: 'FF9A00', category: 'Design & IDEs' },
  { name: 'Canva', logo: 'canva', color: '00C4CC', category: 'Design & IDEs' },
  { name: 'Jira', logo: 'jira', color: '0052CC', category: 'Design & IDEs' },
  { name: 'Notion', logo: 'notion', color: '000000', category: 'Design & IDEs' },

  // 8. AI, ML & Data Science
  { name: 'PyTorch', logo: 'pytorch', color: 'EE4C2C', category: 'AI, ML & Data Science' },
  { name: 'TensorFlow', logo: 'tensorflow', color: 'FF6F00', category: 'AI, ML & Data Science' },
  { name: 'Keras', logo: 'keras', color: 'D00000', category: 'AI, ML & Data Science' },
  { name: 'OpenCV', logo: 'opencv', color: '5C3EE8', category: 'AI, ML & Data Science' },
  { name: 'Scikit-learn', logo: 'scikitlearn', color: 'F7931E', category: 'AI, ML & Data Science' },
  { name: 'Pandas', logo: 'pandas', color: '150458', category: 'AI, ML & Data Science' },
  { name: 'NumPy', logo: 'numpy', color: '013243', category: 'AI, ML & Data Science' },
  { name: 'Hugging Face', logo: 'huggingface', color: 'FFD21E', category: 'AI, ML & Data Science' },
  { name: 'OpenAI', logo: 'openai', color: '412991', category: 'AI, ML & Data Science' },
  { name: 'LangChain', logo: 'langchain', color: '1C3C3C', category: 'AI, ML & Data Science' },
  { name: 'Jupyter Notebook', logo: 'jupyter', color: 'F37626', category: 'AI, ML & Data Science' },
];

export function parseBulkBadges(input) {
  const results = [];
  const lines = input.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);

  for (const line of lines) {
    // 1. Markdown image syntax: [![Alt](url)](link) or ![Alt](url)
    const mdImgMatch = line.match(/!\[(.*?)\]\((https:\/\/img\.shields\.io\/badge\/[^\)]+)\)/);
    if (mdImgMatch) {
      const alt = mdImgMatch[1] || 'Badge';
      const badgeUrl = mdImgMatch[2];
      results.push({ name: alt, customUrl: badgeUrl });
      continue;
    }

    // 2. HTML img tag: <img src="https://img.shields.io/badge/..." alt="..." />
    const htmlImgMatch = line.match(/<img[^>]+src=["'](https:\/\/img\.shields\.io\/badge\/[^"']+)["'][^>]*alt=["']?([^"'>]*)["']?/);
    if (htmlImgMatch) {
      const badgeUrl = htmlImgMatch[1];
      const alt = htmlImgMatch[2] || 'Badge';
      results.push({ name: alt, customUrl: badgeUrl });
      continue;
    }

    // 3. Direct Shields.io URL: https://img.shields.io/badge/...
    const shieldUrlMatch = line.match(/https:\/\/img\.shields\.io\/badge\/([^\s"']+)/);
    if (shieldUrlMatch) {
      const fullUrl = shieldUrlMatch[0];
      const name = line.split('/')[4]?.split('-')[0] || 'Badge';
      results.push({ name: decodeURIComponent(name), customUrl: fullUrl });
      continue;
    }

    // 4. Plain name match or fallback
    const matched = POPULAR_SKILL_BADGES.find(
      (b) => b.name.toLowerCase() === line.toLowerCase() || b.logo.toLowerCase() === line.toLowerCase()
    );
    if (matched) {
      results.push({
        name: matched.name,
        logo: matched.logo,
        color: matched.color,
      });
    } else {
      results.push({
        name: line,
        logo: line.toLowerCase().replace(/[^a-z0-9]/g, ''),
        color: '0969da',
      });
    }
  }

  return results;
}
