// --- Imports ---
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Search from '@/components/blog/Search';
import { DOMAIN, APP_NAME } from '../config'
import { getWebStoryBySlug, getAllWebStorySlugs } from '../actions/story'
import styles from '../styles/stories.module.css'

// --- Component ---
const SingleWebStory = ({ story }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!story) {
    return (
      <Layout>
        <div className={styles.page404Container}>
          <h1 className={styles.page404}>404 - Story Not Found</h1>
          <Search />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{`${story.title} - ${APP_NAME}`}</title>
        <meta name="description" content={story.description || 'Web Story'} />
        <link rel="canonical" href={`${DOMAIN}/web-stories/${story.slug}`} />
      </Head>

      <Layout>
        <main className={styles.storyContainer}>
          <h1>{story.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: story.body }} />
        </main>
      </Layout>
    </>
  );
};

// --- Static Generation Functions ---
export async function getStaticPaths() {
  try {
    const slugs = await getAllWebStorySlugs();
    const paths = slugs.map(({ slug }) => ({ params: { slug } }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('getStaticPaths error:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const story = await getWebStoryBySlug(params.slug);

    if (!story) {
      return { notFound: true };
    }

    return {
      props: { story },
      revalidate: 60,
    };
  } catch (error) {
    console.error('getStaticProps error:', error);
    return { notFound: true };
  }
}

// --- Export the Component ---
export default SingleWebStory;
