import Link from 'next/link';
import { APP_NAME } from "../config";
import styles from "../styles/NavbarFooter.module.css";
import { FacebookIcon, WhatsappIcon, LinkedinIcon,TwitterIcon,RedditIcon } from 'next-share';

const Footer = () => {
  const socialmedia = () => {
    return (
        <div style={{marginTop:'15px'}} className="Footerlogos">
          <a href='/'>  <FacebookIcon style={{ padding: "5px" }} size={45} round /> </a>
          <a href='/'>  <LinkedinIcon style={{ padding: "5px" }} size={45} round /></a>
          <a href='/'>  <WhatsappIcon style={{ padding: "5px" }} size={45} round /> </a>
          <a href='/'>  <TwitterIcon style={{ padding: "5px" }} size={45} round /></a>
          <a href='/'> <RedditIcon style={{ padding: "5px" }} size={45} round /></a>
        </div>
    )
}


  const currentYear = new Date().getFullYear();

  return (
    <>

      <footer className={styles.footerbackground} >
        <div className={styles.footergrid}>

          <div className={styles.footerbox1} >
          <div className={styles.footerheading00}>{APP_NAME}</div>
            <div>ExpoWorld.com is a website where user can share blogs post on different ideas places etc. </div>


            <div className={styles.Footerlogos}>
              {socialmedia()}
            </div>


          </div>



          <div className={styles.footerbox}>
          <div className={styles.footerheading}>Explore</div>
          <ul>
            <li> <Link href="/about-us">About Us </Link>  </li>
            <li> <Link href="/contact-us">Contact Us </Link>  </li>
            <li> <Link href="/disclaimer">Disclaimer </Link>  </li>
            <li> <Link href="/privacy-policy">Privacy Policy </Link>  </li>
            </ul>
          </div>



          <div className={styles.footerbox}>
          <div className={styles.footerheading}>Categories</div>
          <ul>
          <li><Link href="/categories/hotels"> HOTELS </Link>  </li>
            <li> <Link href=" /categories/old-and-gold-resturants">OLD GOLD RESTURANTS </Link>  </li>
            <li> <Link href="/categories/places"> PLACES </Link>  </li>
            <li> <Link href="/categories/historical">HISTORICAL </Link>  </li>
            <li> <Link href="/categories/nature"> NATURE </Link>  </li>
            <li> <Link href="/categories/posts">POSTS </Link>  </li>
            <li> <Link href="/categories/food"> FOOD </Link>  </li>
            </ul>
          </div>





          {/* <div className={styles.footerbox}>
            
            <div className={styles.footerheading}>Articles</div>
            <ul>
            <li><Link href="/categories/hotels"> HOTELS </Link>  </li>
            <li> <Link href="/old-and-gold-resturants">OLD GOLD RESTURANTS </Link>  </li>
            <li> <Link href="/categories/places"> PLACES </Link>  </li>
            <li> <Link href="/categories/historical">HISTORICAL </Link>  </li>
            <li> <Link href="/categories/nature"> NATURE </Link>  </li>
            <li> <Link href="/categories/posts">POSTS </Link>  </li>
            <li> <Link href="/categories/food"> FOOD </Link>  </li>
            </ul>
          </div> */}


        </div>


          <div className={styles.footercopyright}>Copyright {currentYear} @ {APP_NAME}</div>

      </footer>

    </>

  )
}

export default Footer

// export default dynamic(() => Promise.resolve(Footer), { ssr: false })