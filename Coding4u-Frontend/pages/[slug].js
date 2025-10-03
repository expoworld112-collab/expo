// import Head from 'next/head';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { singleBlog, listRelated, getAllBlogSlugs } from '../actions/blog';
// import { DOMAIN, APP_NAME } from '../config';
// import styles from '../styles/blogposts.module.css';

// import Layout from '@/components/Layout';
// import Search from '@/components/blog/Search';
// import SmallCard from '@/components/blog/SmallCard';
// import { isAuth } from '../actions/auth';
// import { format, utcToZonedTime } from 'date-fns-tz';

// const SingleBlog = ({ blog, errorCode }) => {
//   const [related, setRelated] = useState([]);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     setUser(isAuth());

//     const fetchRelated = async () => {
//       try {
//         const data = await listRelated(blog.slug);
//         setRelated(data || []);
//       } catch (err) {
//         console.error('Error fetching related blogs:', err);
//       }
//     };

//     fetchRelated();
//   }, [blog.slug]);

//   if (errorCode) {
//     return (
//       <Layout>
//         <div style={{ background: 'black' }}>
//           <br /><br /><br />
//           <div className={styles.page404}>404 Error! Page Not Found</div>
//           <section className={styles.item0000}><br /><Search /><br /><br /><br /></section>
//         </div>
//       </Layout>
//     );
//   }

//   const head = () => (
//     <Head>
//       <title>{`${blog.title} - ${APP_NAME}`}</title>
//       <meta name="description" content={blog.mdesc} />
//       <link rel="canonical" href={`${DOMAIN}/${blog.slug}`} />
//       <meta property="og:title" content={`${blog.mtitle} | ${APP_NAME}`} />
//       <meta property="og:description" content={blog.mdesc} />
//       <meta property="og:type" content="website" />
//       <meta property="og:url" content={`${DOMAIN}/${blog.slug}`} />
//       <meta property="og:site_name" content={APP_NAME} />
//       <meta property="og:image" content={blog.photo} />
//       <meta property="og:image:secure_url" content={blog.photo} />
//       <meta property="og:image:type" content="image/jpg" />
//       <meta property="article:published_time" content={blog.date} />
//       <meta property="article:modified_time" content={blog.date} />
//     </Head>
//   );

//   const showCategories = () =>
//     blog.categories.map((c, i) => (
//       <Link key={i} href={`/categories/${c.slug}`} className={styles.blogcat}>
//         {c.name}
//       </Link>
//     ));

//   const showTags = () =>
//     blog.tags.map((t, i) => (
//       <Link key={i} href={`/tags/${t.slug}`} className={styles.blogtag}>
//         {t.name}
//       </Link>
//     ));

//   const showRelatedBlogs = () =>
//     related.map((relatedBlog, i) => (
//       <article key={i} className={styles.box}>
//         <SmallCard blog={relatedBlog} />
//       </article>
//     ));

//   return (
//     <>
//       {head()}
//       <Layout>
//         <main>
//           <article className={styles.backgroundImg}>
//             <br />

//             <section className={styles.mypost}>
//               <section className={styles.topsection}>
//                 {user?.role === 1 && (
//                   <div className={styles.editbutton}>
//                     <a href={`${DOMAIN}/admin/${blog.slug}`}>Edit</a>
//                   </div>
//                 )}

//                 <header>
//                   <h1>{blog.title}</h1>
//                   <section className={styles.dateauth}>
//                     {blog.formattedDate} &nbsp; by &nbsp;
//                     {blog.postedBy?.username ? (
//                       <Link href={`/profile/${blog.postedBy.username}`} className={styles.author}>
//                         {blog.postedBy.name}
//                       </Link>
//                     ) : (
//                       <span>User</span>
//                     )}
//                   </section>
//                 </header>

//                 <br />
//                 <section className={styles.imageContainer}>
//                   <div className={styles.aspectRatioContainer}>
//                     <img className={styles.resizeimg} src={blog.photo} alt={blog.title} />
//                   </div>
//                 </section>
//                 <br /><br />
//               </section>

//               <section className="postcontent">
//                 <div dangerouslySetInnerHTML={{ __html: blog.body }} />
//                 <div style={{ textAlign: 'center' }}>
//                   <br /><br />
//                   {showCategories()}
//                   {showTags()}
//                 </div>
//               </section>
//             </section>

//             <br /><br />

//             <section className={styles.mypost2}>
//               <br /><br /><br />
//               <section className={styles.item0000}>
//                 <br />
//                 <Search />
//                 <br />
//               </section>
//               <section className={styles.grid}>{showRelatedBlogs()}</section>
//               <br /><br /><br /><br />
//             </section>
//           </article>
//         </main>
//       </Layout>
//     </>
//   );
// };

// export default SingleBlog;
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { singleBlog, listRelated, getAllBlogSlugs } from '../../actions/blog'; // adjust path if needed
import { DOMAIN, APP_NAME } from '../../config';
import styles from '../../styles/blogposts.module.css';

import Layout from '@/components/Layout';
import Search from '@/components/blog/Search';
import SmallCard from '@/components/blog/SmallCard';
import { isAuth } from '../../actions/auth';

const SingleBlog = ({ blog, errorCode }) => {
  const [related, setRelated] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(isAuth());

    const fetchRelated = async () => {
      try {
        const data = await listRelated(blog.slug);
        setRelated(data || []);
      } catch (err) {
        console.error('Error fetching related blogs:', err);
      }
    };

    if (blog && blog.slug) {
      fetchRelated();
    }
  }, [blog?.slug]);

  if (errorCode) {
    return (
      <Layout>
        <div style={{ background: 'black' }}>
          <br /><br /><br />
          <div className={styles.page404}>404 Error! Page Not Found</div>
          <section className={styles.item0000}><br /><Search /><br /><br /><br /></section>
        </div>
      </Layout>
    );
  }

  const head = () => (
    <Head>
      <title>{`${blog.title} - ${APP_NAME}`}</title>
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/${blog.slug}`} />
      <meta property="og:title" content={`${blog.mtitle} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/${blog.slug}`} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:image" content={blog.photo} />
      <meta property="og:image:secure_url" content={blog.photo} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="article:published_time" content={blog.date} />
      <meta property="article:modified_time" content={blog.date} />
    </Head>
  );

  const showCategories = () =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`} className={styles.blogcat}>
        {c.name}
      </Link>
    ));

  const showTags = () =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`} className={styles.blogtag}>
        {t.name}
      </Link>
    ));

  const showRelatedBlogs = () =>
    related.map((relatedBlog, i) => (
      <article key={i} className={styles.box}>
        <SmallCard blog={relatedBlog} />
      </article>
    ));

  return (
    <>
      {head()}
      <Layout>
        <main>
          <article className={styles.backgroundImg}>
            <br />

            <section className={styles.mypost}>
              <section className={styles.topsection}>
                {user?.role === 1 && (
                  <div className={styles.editbutton}>
                    <a href={`${DOMAIN}/admin/${blog.slug}`}>Edit</a>
                  </div>
                )}

                <header>
                  <h1>{blog.title}</h1>
                  <section className={styles.dateauth}>
                    {blog.formattedDate} &nbsp; by &nbsp;
                    {blog.postedBy?.username ? (
                      <Link href={`/profile/${blog.postedBy.username}`} className={styles.author}>
                        {blog.postedBy.name}
                      </Link>
                    ) : (
                      <span>User</span>
                    )}
                  </section>
                </header>

                <br />
                <section className={styles.imageContainer}>
                  <div className={styles.aspectRatioContainer}>
                    <img className={styles.resizeimg} src={blog.photo} alt={blog.title} />
                  </div>
                </section>
                <br /><br />
              </section>

              <section className="postcontent">
                <div dangerouslySetInnerHTML={{ __html: blog.body }} />
                <div style={{ textAlign: 'center' }}>
                  <br /><br />
                  {showCategories()}
                  {showTags()}
                </div>
              </section>
            </section>

            <br /><br />

            <section className={styles.mypost2}>
              <br /><br /><br />
              <section className={styles.item0000}>
                <br />
                <Search />
                <br />
              </section>
              <section className={styles.grid}>{showRelatedBlogs()}</section>
              <br /><br /><br /><br />
            </section>
          </article>
        </main>
      </Layout>
    </>
  );
};

export default SingleBlog;

// STATIC GENERATION FUNCTIONS

export async function getStaticPaths() {
  try {
    const slugs = await getAllBlogSlugs();

    const paths = slugs.map(({ slug }) => ({
      params: { slug: slug.toLowerCase() },
    }));

    return {
      paths,
      fallback: 'blocking', // or true, or false depending on your choice
    };
  } catch (error) {
    console.error('Error fetching slugs in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const blog = await singleBlog(params.slug);

    if (!blog) {
      return { notFound: true };
    }

    // Format the date server-side for consistency
    const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      props: {
        blog: { ...blog, formattedDate },
      },
      revalidate: 10, // ISR: re-generate page at most every 10 seconds
    };
  } catch (error) {
    console.error('Error fetching blog in getStaticProps:', error);
    return {
      props: {
        errorCode: 404,
      },
    };
  }
}
