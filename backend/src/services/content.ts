import crypto from 'crypto';

const stripTags = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const extractContent = (html: string, url: string) => {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const pubDateMatch = html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i);

  const contentText = stripTags(html);
  const content_markdown = contentText
    .split(/\.\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n\n');

  return {
    title: titleMatch?.[1]?.trim() || 'Untitled',
    canonical_url: canonicalMatch?.[1] || url,
    published_at: pubDateMatch?.[1] || null,
    content_markdown,
    content_hash: crypto.createHash('sha256').update(content_markdown).digest('hex'),
  };
};
