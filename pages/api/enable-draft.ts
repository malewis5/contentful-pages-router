import { getArticle } from '@/lib/contentful/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { secret, slug, bypass } = request.query;

  if (!secret || !slug) {
    return response.status(400).json('Missing parameters');
  }

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return response.status(401).json('Invalid token');
  }

  const article = await getArticle(slug as string);

  if (!article) {
    return response.status(404).json('Article not found');
  }

  response.setDraftMode({ enable: true });
  response.redirect(
    `/articles/${article.slug}?x-vercel-protection-bypass=${bypass}`
  );
}
