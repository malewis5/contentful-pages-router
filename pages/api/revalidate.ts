import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function handler(request: NextApiRequest, res: NextApiResponse) {
  const requestHeaders = request.headers;
  const secret = requestHeaders['x-vercel-revalidation-secret'];

  if (secret !== process.env.CONTENTFUL_REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.body;

  const tag = body.tag;

  if (!tag) {
    return res.status(400).json({ message: 'No tag provided' });
  }

  revalidateTag(tag);

  return res.json({ revalidated: true, now: Date.now() });
}
