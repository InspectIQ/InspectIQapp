import { BlogPost } from '../data/blogPosts';

/**
 * Helper functions for managing blog posts
 */

export const generateBlogPostId = (): string => {
  return Date.now().toString();
};

export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

export const createBlogPost = (
  title: string,
  excerpt: string,
  category: string,
  content: string,
  author: string = 'InspectIQ Team',
  tags: string[] = [],
  image: string = '📝'
): BlogPost => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return {
    id: generateBlogPostId(),
    title,
    excerpt,
    category,
    date: formatDate(),
    readTime: estimateReadTime(content),
    image,
    slug,
    content,
    author,
    tags
  };
};

/**
 * Template for feature announcement blog posts
 */
export const createFeatureAnnouncementPost = (
  featureName: string,
  description: string,
  benefits: string[],
  howItWorks: string[],
  callToAction: string = 'Try it today'
): BlogPost => {
  const content = `# Introducing ${featureName}

We're excited to announce a new feature that enhances your InspectIQ experience: **${featureName}**.

## What's New?

${description}

## Key Benefits

${benefits.map(benefit => `- **${benefit}**`).join('\n')}

## How It Works

${howItWorks.map((step, index) => `${index + 1}. **${step}**`).join('\n')}

## Getting Started

${callToAction} - this feature is automatically available in your InspectIQ dashboard.

**Ready to experience the difference?** [Start using ${featureName} →](/register)

---

*Have questions about ${featureName}? [Contact our team](/contact) for support.*`;

  return createBlogPost(
    `Introducing ${featureName}`,
    description,
    'Product Updates',
    content,
    'InspectIQ Team',
    ['Feature', 'Update', 'Innovation'],
    '🚀'
  );
};

/**
 * Template for best practices blog posts
 */
export const createBestPracticesPost = (
  topic: string,
  introduction: string,
  practices: Array<{ title: string; description: string }>,
  conclusion: string
): BlogPost => {
  const content = `# ${topic}

${introduction}

## Best Practices

${practices.map(practice => `### ${practice.title}

${practice.description}`).join('\n\n')}

## Conclusion

${conclusion}

**Ready to implement these best practices?** [Get started with InspectIQ →](/register)`;

  return createBlogPost(
    topic,
    introduction,
    'Best Practices',
    content,
    'InspectIQ Team',
    ['Best Practices', 'Tips', 'Guide'],
    '💡'
  );
};