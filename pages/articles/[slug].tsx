import { getAllArticles, getArticle } from '@/lib/contentful/api';

import Image from 'next/image';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { ContentfulLivePreview } from '@contentful/live-preview';

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllArticles();
  const paths = articles.map((article: any) => ({
    params: { slug: article.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  draftMode,
}: GetStaticPropsContext) => {
  const article = await getArticle(params?.slug as string, draftMode);
  return { props: { article } };
};

export default function KnowledgeArticlePage({ article }: { article: any }) {
  const updatedArticle = useContentfulLiveUpdates(article);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 bg-white'>
      <section className='w-full'>
        <div className='container space-y-12 px-4 md:px-6'>
          <div className='space-y-4'>
            <h1
              className='text-4xl font-bold tracking-tighter sm:text-5xl'
              {...ContentfulLivePreview.getProps({
                entryId: article.sys.id,
                fieldId: 'title',
              })}
            >
              {updatedArticle.title}
            </h1>
            <div className='flex justify-between flex-col md:flex-row'>
              <p
                className='max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400'
                {...ContentfulLivePreview.getProps({
                  entryId: article.sys.id,
                  fieldId: 'summary',
                })}
              >
                {updatedArticle.summary}
              </p>
              <p
                className='text-zinc-500 md:text-lg/relaxed lg:text-sm/relaxed xl:text-lg/relaxed dark:text-zinc-400 italic'
                {...ContentfulLivePreview.getProps({
                  entryId: article.sys.id,
                  fieldId: 'authorName',
                })}
              >
                by: {updatedArticle.authorName}
              </p>
            </div>
          </div>
          <div className='space-y-8 lg:space-y-10'>
            <Image
              alt='Article Image'
              className='aspect-video w-full overflow-hidden rounded-xl object-cover'
              height='365'
              src={updatedArticle.articleImage.url}
              width='650'
              {...ContentfulLivePreview.getProps({
                entryId: article.sys.id,
                fieldId: 'articleImage',
              })}
            />
            <div className='space-y-4 md:space-y-6'>
              <div className='space-y-2'>
                <div
                  className='max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400'
                  {...ContentfulLivePreview.getProps({
                    entryId: article.sys.id,
                    fieldId: 'details',
                  })}
                >
                  {documentToReactComponents(updatedArticle.details.json)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
