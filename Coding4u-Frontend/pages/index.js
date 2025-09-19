import Layout from "@/components/Layout";
import styles from "../styles/blogposts.module.css";
import { listBlogsWithCategoriesAndTags } from '../actions/blog';
import Card from '../components/blog/Card';
import Head from "next/head";
import { APP_DESCRIPTION, DOMAIN, APP_NAME } from "../config";
// import { format } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

const Index = ({ blogs }) => {
    const showAllBlogs = () => {
    return blogs && blogs.map((blog, i) => (
            <article key={i} className={styles.box}><Card blog={blog} /></article>    
        )).slice(0, 9);
    }

    
    const head = () => (
        <Head>
            <title >{APP_NAME}</title>
            <meta name="description" content={APP_DESCRIPTION} />
            <link rel="canonical" href={DOMAIN} />
            <meta property="og:title" content={APP_NAME} />
            <meta property="og:description" content={APP_DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta name="robots" content="index, follow" />
            <meta property="og:url" content={DOMAIN} />
            <meta property="og:site_name" content={DOMAIN} />
            <meta property="og:image" content={`${DOMAIN}/icon-512.png`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/icon-512.png`} />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    );

    return (
        <>
            {head()}
            <Layout>

                <div className={styles.backImg}>
                    <br /><br />
                    <br /><br />

                    <section className={styles.topsection}>
                        <h1 className={styles.heading}>TRAVEL UNTIL LIFE </h1>
                        <p>It's not at all important to get it right the first time. It's vitally important to get it right the last time.</p>

                        <div className={styles.resizeimg0}></div>
                        <h1>The Best way to Enjoy the future is to make it.</h1>
                        <p>Good habit is to travel it ?</p>
                    </section>

                    <section className={styles.latestposts}>
                        <h1 className={styles.latestpostheading} > Latest Post </h1>
                        <div className={styles.grid}>{showAllBlogs()}</div>
                        <br />
                        <br />
                    </section>
                </div>

            </Layout>
        </>
    );
}


// export async function getStaticProps() {
//     try {
//         const data = await listBlogsWithCategoriesAndTags();
//         return { props: { blogs: data.blogs }};
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return { props: { blogs: [] }, };
//     }
// }

/*
export async function getStaticProps() {
    try {
      const data = await listBlogsWithCategoriesAndTags();


      const utcDate = new Date(data.date);
      const istDate = utcToZonedTime(utcDate, 'Asia/Kolkata');
      const formattedDate = format(istDate, 'dd MMM, yyyy', { timeZone: 'Asia/Kolkata' });

      const formattedBlogs = data.blogs.map(blog => ({...blog, formattedDate}));

      return { props: { blogs: formattedBlogs } };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { props: { blogs: [] } };
    }
  }
  */

  export async function getStaticProps() {
    try {
      const data = await listBlogsWithCategoriesAndTags();
      const formattedBlogs = data.blogs.map(blog => {
        const utcDate = new Date(blog.date);
        const istDate = utcToZonedTime(utcDate, 'Asia/Kolkata');
        const formattedDate = format(istDate, 'dd MMM, yyyy', { timeZone: 'Asia/Kolkata' });
        return { ...blog, formattedDate };
      });
      return { props: { blogs: formattedBlogs } };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { props: { blogs: [] } };
    }
  }

  
export default Index;