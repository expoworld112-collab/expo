// import Head from "next/head";
// import Script from "next/script";
// import React from "react";
// import { format } from "date-fns";
// import { singleStory, allslugs } from "../../actions/story";
// import { API, DOMAIN, APP_NAME, MY_API } from "../../config";

// export const config = { amp: true };

// const Stories = ({ story, errorCode }) => {
//   if (errorCode) {
//     return (
//       <>
//         <Head>
//           <title>{`404 Error - ${APP_NAME}`}</title>
//         </Head>
//         <div
//           style={{
//             marginTop: "100px",
//             textAlign: "center",
//             fontWeight: "800",
//             fontSize: "30px",
//             fontFamily: "sans-serif",
//           }}
//         >
//           404 Error! Story Not Found
//         </div>
//       </>
//     );
//   }

//   const schema = {
//     "@context": "https://schema.org",
//     "@graph": [
//       {
//         "@type": "Organization",
//         "@id": `${DOMAIN}/#organization`,
//         name: APP_NAME,
//         logo: {
//           "@type": "ImageObject",
//           "@id": `${DOMAIN}/#logo`,
//           url: `${DOMAIN}/logo.png`, // Adjust your logo URL here
//           width: "96",
//           height: "96",
//         },
//       },
//       {
//         "@type": "WebSite",
//         "@id": `${DOMAIN}/#website`,
//         url: DOMAIN,
//         name: APP_NAME,
//         alternateName: APP_NAME,
//         publisher: { "@id": `${DOMAIN}/#organization` },
//         inLanguage: "pa",
//       },
//       {
//         "@type": "ImageObject",
//         "@id": story.coverphoto,
//         url: story.coverphoto,
//         width: "640",
//         height: "853",
//         caption: story.title,
//         inLanguage: "pa",
//       },
//       {
//         "@type": "WebPage",
//         "@id": `${DOMAIN}/${story.slug}/#webpage`,
//         url: `${DOMAIN}/${story.slug}`,
//         name: story.title,
//         datePublished: story.date,
//         dateModified: story.date,
//         isPartOf: { "@id": `${DOMAIN}/#website` },
//         primaryImageOfPage: { "@id": story.coverphoto },
//         inLanguage: "pa",
//       },
//       {
//         "@type": "Person",
//         "@id": `${DOMAIN}/author/divrawat2001/`,
//         name: "Divyansh Rawal",
//         url: `${DOMAIN}/author/divrawat2001/`,
//         image: {
//           "@type": "ImageObject",
//           "@id": `${DOMAIN}/author/divrawat2001/avatar.jpg`, // Adjust if needed
//           url: `${DOMAIN}/author/divrawat2001/avatar.jpg`,
//           caption: "Divyansh Rawal",
//           inLanguage: "pa",
//         },
//         worksFor: { "@id": `${DOMAIN}/#organization` },
//       },
//       {
//         "@type": "NewsArticle",
//         headline: `${story.title} - ${APP_NAME}`,
//         datePublished: story.date,
//         dateModified: story.date,
//         author: {
//           "@id": `${DOMAIN}/author/divrawat2001/`,
//           name: "Divyansh Rawal",
//         },
//         publisher: { "@id": `${DOMAIN}/#organization` },
//         description: `${story.description} - ${APP_NAME}`,
//         "@id": `${DOMAIN}/${story.slug}/#richSnippet`,
//         isPartOf: { "@id": `${DOMAIN}/${story.slug}/#webpage` },
//         image: { "@id": story.coverphoto },
//         inLanguage: "pa",
//         mainEntityOfPage: { "@id": `${DOMAIN}/${story.slug}/#webpage` },
//       },
//     ],
//   };

//   const head = () => (
//     <Head>
//       <title>{`${story.title} - ${APP_NAME}`}</title>
//       <meta charSet="utf-8" />
//       <meta name="description" content={story.description} />
//       <meta name="robots" content="follow, index, noarchive, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
//       <meta property="og:locale" content="en_US" />
//       <meta property="og:type" content="article" />
//       <link rel="preconnect" href="https://cdn.ampproject.org" />
//       <link rel="preload" as="script" href="https://cdn.ampproject.org/v0/amp-story-1.0.js" />
//       <meta property="og:title" content={`${story.title} - ${APP_NAME}`} />
//       <meta property="og:description" content={story.description} />
//       <meta property="og:url" content={`${DOMAIN}/web-stories/${story.slug}`} />
//       <meta property="og:site_name" content={APP_NAME} />
//       <meta property="og:updated_time" content={story.date} />
//       <meta property="og:image" content={story.coverphoto} />
//       <meta property="og:image:secure_url" content={story.coverphoto} />
//       <meta property="og:image:width" content="640" />
//       <meta property="og:image:height" content="853" />
//       <meta property="og:image:alt" content="Story image" />
//       <meta property="og:image:type" content="image/jpeg" />
//       <link rel="canonical" href={`${DOMAIN}/web-stories/${story.slug}`} />
//       <link rel="amphtml" href={`${DOMAIN}/web-stories/${story.slug}`} />
//       <meta property="article:published_time" content={story.date} />
//       <meta property="article:modified_time" content={story.date} />
//       <link rel="icon" href={`${DOMAIN}/favicon-32x32.png`} sizes="32x32" />
//       <link rel="icon" href={`${DOMAIN}/favicon-192x192.png`} sizes="192x192" />
//       <link rel={`${MY_API}`} href={`${API}`} />
//       <link rel="alternate" type="application/json" href={`${API}/webstories/${story.slug}`} />
//       <link rel="apple-touch-icon" href={`${DOMAIN}/apple-touch-icon.png`} />
//       <link rel="alternate" type="application/rss+xml" title={`${APP_NAME} - Feed`} href={`${DOMAIN}/feed/`} />
//       <link rel="alternate" type="application/rss+xml" title={`${APP_NAME} » Stories Feed`} href={`${DOMAIN}/web-stories/feed/`} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
//     </Head>
//   );

//   const formattedDate = format(new Date(story.date), "dd MMM, yyyy");

//   return (
//     <>
//       {head()}
//       <Script src="https://cdn.ampproject.org/v0.js" async />
//       <Script custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" async />
//       <Script custom-element="amp-story-auto-ads" src="https://cdn.ampproject.org/v0/amp-story-auto-ads-0.1.js" async />
//       <Script custom-element="amp-story-auto-analytics" src="https://cdn.ampproject.org/v0/amp-story-auto-analytics-0.1.js" async />

//       <amp-story
//         standalone=""
//         title={story.title}
//         publisher={APP_NAME}
//         publisher-logo-src={`${DOMAIN}/logo.png`}
//         poster-portrait-src={story.coverphoto}
//       >
//         {/* Cover Page */}
//         <amp-story-page id="cover" auto-advance-after="4s">
//           <amp-story-grid-layer template="vertical">
//             <amp-img src={story.coverphoto} layout="responsive" width="720" height="1280" />
//           </amp-story-grid-layer>

//           <amp-story-grid-layer template="vertical" className="bottom">
//             <h1>{story.title}</h1>
//             <p>{`By ${APP_NAME} Team`}</p>
//             <p>{formattedDate}</p>
//           </amp-story-grid-layer>
//         </amp-story-page>

//         {/* Slides */}
//         {story.slides.map((slide, i) => (
//           <amp-story-page key={i} id={`page${i}`} auto-advance-after="5s">
//             <amp-story-grid-layer template="vertical">
//               <amp-img src={slide.image} layout="responsive" animate-in="fade-in" width="720" height="1280" />
//             </amp-story-grid-layer>

//             <amp-story-grid-layer template="vertical" className="bottom">
//               {slide.heading && <h2 animate-in="fade-in" animate-in-delay="0.2s">{slide.heading}</h2>}
//               <p animate-in="fade-in" animate-in-delay="0.3s">{slide.paragraph}</p>
//             </amp-story-grid-layer>
//           </amp-story-page>
//         ))}

//         {/* Optional Last Page */}
//         {story.link && story.lastheading && story.lastimage && (
//           <amp-story-page id={`page${story.slides.length + 1}`}>
//             <amp-story-grid-layer template="vertical">
//               <amp-img src={story.lastimage} layout="responsive" animate-in="fade-in" width="720" height="1280" />
//             </amp-story-grid-layer>

//             <amp-story-grid-layer template="vertical" className="bottom">
//               <h3 animate-in="fade-in" animate-in-delay="0.2s">{story.lastheading}</h3>
//             </amp-story-grid-layer>

//             <amp-story-cta-layer>
//               <a href={story.link} className="button">
//                 Click Here
//               </a>
//             </amp-story-cta-layer>
//           </amp-story-page>
//         )}

//         <amp-story-auto-analytics gtag-id="G-MD3GK51NZC" data-credentials="include" />
//       </amp-story>
//     </>
//   );
// };

// export async function getStaticPaths() {
//   try {
//     const res = await fetch(`${API}/api/slugs`); // Your API endpoint to get all slugs

//     if (!res.ok) {
//       console.error("Failed to fetch slugs:", res.status);
//       return { paths: [], fallback: "blocking" };
//     }

//     const slugs = await res.json();

//     if (!Array.isArray(slugs)) {
//       console.error("Slugs is not an array:", slugs);
//       return { paths: [], fallback: "blocking" };
//     }

//     const excludedSlugs = ["/admin/edit-blogs"];
//     const paths = slugs
//       .filter((slug) => !excludedSlugs.includes(slug.slug || slug))
//       .map((slug) => ({
//         params: { slug: slug.slug || slug },
//       }));

//     return {
//       paths,
//       fallback: "blocking", // or true depending on your preference
//     };
//   } catch (error) {
//     console.error("Error in getStaticPaths:", error);
//     return { paths: [], fallback: "blocking" };
//   }
// }

// export async function getStaticProps({ params }) {
//   try {
//     const story = await singleStory(params.slug);

//     if (!story) {
//       return { notFound: true };
//     }

//     return {
//       props: { story },
//       revalidate: 10, // Optional: ISR (Incremental Static Regeneration)
//     };
//   } catch (error) {
//     console.error("Error in getStaticProps:", error);
//     return {
//       props: { errorCode: 404 },
//     };
//   }
// }

// export default Stories;
import Head from "next/head";
import Script from "next/script";
import React from "react";
import { format } from "date-fns";
import { singleStory } from "../../actions/story"; // assuming this hits `${API}/webstories/${slug}`
import { API, DOMAIN, APP_NAME, MY_API } from "../../config";

export const config = { amp: true };

const Stories = ({ story, errorCode }) => {
  if (errorCode) {
    return (
      <>
        <Head>
          <title>{`404 Error - ${APP_NAME}`}</title>
        </Head>
        <div
          style={{
            marginTop: "100px",
            textAlign: "center",
            fontWeight: "800",
            fontSize: "30px",
            fontFamily: "sans-serif",
          }}
        >
          404 Error! Story Not Found
        </div>
      </>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${DOMAIN}/#organization`,
        name: APP_NAME,
        logo: {
          "@type": "ImageObject",
          "@id": `${DOMAIN}/#logo`,
          url: `${DOMAIN}/logo.png`,
          width: "96",
          height: "96",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${DOMAIN}/#website`,
        url: DOMAIN,
        name: APP_NAME,
        alternateName: APP_NAME,
        publisher: { "@id": `${DOMAIN}/#organization` },
        inLanguage: "pa",
      },
      {
        "@type": "ImageObject",
        "@id": story.coverphoto,
        url: story.coverphoto,
        width: "640",
        height: "853",
        caption: story.title,
        inLanguage: "pa",
      },
      {
        "@type": "WebPage",
        "@id": `${DOMAIN}/${story.slug}/#webpage`,
        url: `${DOMAIN}/${story.slug}`,
        name: story.title,
        datePublished: story.date,
        dateModified: story.date,
        isPartOf: { "@id": `${DOMAIN}/#website` },
        primaryImageOfPage: { "@id": story.coverphoto },
        inLanguage: "pa",
      },
      {
        "@type": "Person",
        "@id": `${DOMAIN}/author/divrawat2001/`,
        name: "Divyansh Rawal",
        url: `${DOMAIN}/author/divrawat2001/`,
        image: {
          "@type": "ImageObject",
          "@id": `${DOMAIN}/author/divrawat2001/avatar.jpg`,
          url: `${DOMAIN}/author/divrawat2001/avatar.jpg`,
          caption: "Divyansh Rawal",
          inLanguage: "pa",
        },
        worksFor: { "@id": `${DOMAIN}/#organization` },
      },
      {
        "@type": "NewsArticle",
        headline: `${story.title} - ${APP_NAME}`,
        datePublished: story.date,
        dateModified: story.date,
        author: {
          "@id": `${DOMAIN}/author/divrawat2001/`,
          name: "Divyansh Rawal",
        },
        publisher: { "@id": `${DOMAIN}/#organization` },
        description: `${story.description} - ${APP_NAME}`,
        "@id": `${DOMAIN}/${story.slug}/#richSnippet`,
        isPartOf: { "@id": `${DOMAIN}/${story.slug}/#webpage` },
        image: { "@id": story.coverphoto },
        inLanguage: "pa",
        mainEntityOfPage: { "@id": `${DOMAIN}/${story.slug}/#webpage` },
      },
    ],
  };

  const head = () => (
    <Head>
      <title>{`${story.title} - ${APP_NAME}`}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={story.description} />
      <meta
        name="robots"
        content="follow, index, noarchive, max-snippet:-1, max-video-preview:-1, max-image-preview:large"
      />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="article" />
      <link rel="preconnect" href="https://cdn.ampproject.org" />
      <link rel="preload" as="script" href="https://cdn.ampproject.org/v0/amp-story-1.0.js" />
      <meta property="og:title" content={`${story.title} - ${APP_NAME}`} />
      <meta property="og:description" content={story.description} />
      <meta property="og:url" content={`${DOMAIN}/web-stories/${story.slug}`} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:updated_time" content={story.date} />
      <meta property="og:image" content={story.coverphoto} />
      <meta property="og:image:secure_url" content={story.coverphoto} />
      <meta property="og:image:width" content="640" />
      <meta property="og:image:height" content="853" />
      <meta property="og:image:alt" content="Story image" />
      <meta property="og:image:type" content="image/jpeg" />
      <link rel="canonical" href={`${DOMAIN}/web-stories/${story.slug}`} />
      <link rel="amphtml" href={`${DOMAIN}/web-stories/${story.slug}`} />
      <meta property="article:published_time" content={story.date} />
      <meta property="article:modified_time" content={story.date} />
      <link rel="icon" href={`${DOMAIN}/favicon-32x32.png`} sizes="32x32" />
      <link rel="icon" href={`${DOMAIN}/favicon-192x192.png`} sizes="192x192" />
      <link rel={`${MY_API}`} href={`${API}`} />
      <link rel="alternate" type="application/json" href={`${API}/webstories/${story.slug}`} />
      <link rel="apple-touch-icon" href={`${DOMAIN}/apple-touch-icon.png`} />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${APP_NAME} - Feed`}
        href={`${DOMAIN}/feed/`}
      />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${APP_NAME} » Stories Feed`}
        href={`${DOMAIN}/web-stories/feed/`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Head>
  );

  const formattedDate = format(new Date(story.date), "dd MMM, yyyy");

  return (
    <>
      {head()}
      <Script src="https://cdn.ampproject.org/v0.js" async />
      <Script custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" async />
      <Script custom-element="amp-story-auto-ads" src="https://cdn.ampproject.org/v0/amp-story-auto-ads-0.1.js" async />
      <Script
        custom-element="amp-story-auto-analytics"
        src="https://cdn.ampproject.org/v0/amp-story-auto-analytics-0.1.js"
        async
      />

      <amp-story
        standalone=""
        title={story.title}
        publisher={APP_NAME}
        publisher-logo-src={`${DOMAIN}/logo.png`}
        poster-portrait-src={story.coverphoto}
      >
        {/* Cover Page */}
        <amp-story-page id="cover" auto-advance-after="4s">
          <amp-story-grid-layer template="vertical">
            <amp-img src={story.coverphoto} layout="responsive" width="720" height="1280" />
          </amp-story-grid-layer>

          <amp-story-grid-layer template="vertical" className="bottom">
            <h1>{story.title}</h1>
            <p>{`By ${APP_NAME} Team`}</p>
            <p>{formattedDate}</p>
          </amp-story-grid-layer>
        </amp-story-page>

        {/* Slides */}
        {story.slides.map((slide, i) => (
          <amp-story-page key={i} id={`page${i}`} auto-advance-after="5s">
            <amp-story-grid-layer template="vertical">
              <amp-img src={slide.image} layout="responsive" animate-in="fade-in" width="720" height="1280" />
            </amp-story-grid-layer>

            <amp-story-grid-layer template="vertical" className="bottom">
              {slide.heading && <h2 animate-in="fade-in" animate-in-delay="0.2s">{slide.heading}</h2>}
              <p animate-in="fade-in" animate-in-delay="0.3s">{slide.paragraph}</p>
            </amp-story-grid-layer>
          </amp-story-page>
        ))}

        {/* Optional Last Page */}
        {story.link && story.lastheading && story.lastimage && (
          <amp-story-page id={`page${story.slides.length + 1}`}>
            <amp-story-grid-layer template="vertical">
              <amp-img src={story.lastimage} layout="responsive" animate-in="fade-in" width="720" height="1280" />
            </amp-story-grid-layer>

            <amp-story-grid-layer template="vertical" className="bottom">
              <h3 animate-in="fade-in" animate-in-delay="0.2s">{story.lastheading}</h3>
            </amp-story-grid-layer>

            <amp-story-cta-layer>
              <a href={story.link} className="button">
                Click Here
              </a>
            </amp-story-cta-layer>
          </amp-story-page>
        )}

        <amp-story-auto-analytics gtag-id="G-MD3GK51NZC" data-credentials="include" />
      </amp-story>
    </>
  );
};

// export async function getStaticPaths() {
//   try {
//     const res = await fetch(`${API}/webstories`);

//     if (!res.ok) {
//       console.error("Failed to fetch slugs:", res.status);
//       return { paths: [], fallback: "blocking" };
//     }

//     const stories = await res.json();

//     if (!Array.isArray(stories)) {
//       console.error("Stories is not an array:", stories);
//       return { paths: [], fallback: "blocking" };
//     }

//     const excludedSlugs = ["/admin/edit-blogs"];
//     const paths = stories
//       .filter((story) => !excludedSlugs.includes(story.slug))
//       .map((story) => ({
//         params: { slug: story.slug },
//       }));

//     return {
//       paths,
//       fallback: "blocking", // or true if you want fallback pages
//     };
//   } catch (error) {
//     console.error("Error in getStaticPaths:", error);
//     return { paths: [], fallback: "blocking" };
//   }
// }
export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/webstories/slugs`);
    if (!res.ok) {
      console.error('Failed to fetch slugs:', res.status);
      return { paths: [], fallback: false };
    }
    const slugs = await res.json();
    const paths = slugs.map(slug => ({ params: { slug } }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return { paths: [], fallback: false };
  }
}


export async function getStaticProps({ params }) {
  try {
    const story = await singleStory(params.slug);

    if (!story) {
      return { notFound: true };
    }

    return {
      props: { story },
      revalidate: 10, // ISR to update every 10 seconds optionally
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: { errorCode: 404 },
    };
  }
}

export default Stories;
