// import express from "express";
// const router = express.Router();
// import { requireSignin, adminMiddleware } from "../controllers/auth.js"
// import { createWebStory, fetchWebStoryBySlug, allstories, deletestory, updateStory, sitemap, allslugs } from "../controllers/webstories.js";

// router.post('/webstory', requireSignin, adminMiddleware, createWebStory);
// router.get('/webstories/:slug', fetchWebStoryBySlug);
// router.get('/allwebstories', allstories);
// router.get('/allslugs', allslugs);
// router.get('/sitemap', sitemap);
// router.delete('/webstorydelete/:slug', requireSignin, adminMiddleware, deletestory);
// router.patch('/webstoriesupdate/:slug', requireSignin, adminMiddleware, updateStory);



// export default router;
// import express from "express";
// const router = express.Router();
// import { requireSignin, adminMiddleware } from "../controllers/auth.js"
// import {
//   createWebStory,
//   fetchWebStoryBySlug,
//   allstories,
//   deletestory,
//   updateStory,
//   sitemap,
//   allslugs
// } from "../controllers/webstories.js";

// router.post('/webstory', requireSignin, adminMiddleware, createWebStory);
// router.get('/webstories/:slug', fetchWebStoryBySlug);
// router.get('/allwebstories', allstories);
// router.get('/allslugs', allslugs);
// router.get('/sitemap', sitemap);
// router.delete('/webstorydelete/:slug', requireSignin, adminMiddleware, deletestory);
// router.patch('/webstoriesupdate/:slug', requireSignin, adminMiddleware, updateStory);

// // ✅ Add this route to support frontend build
// router.get('/web-stories-slugs', allslugs);
// import express from "express";
// const router = express.Router();
// import { requireSignin, adminMiddleware } from "../controllers/auth.js";
// import {
//   createWebStory,
//   fetchWebStoryBySlug,
//   allstories,
//   deletestory,
//   updateStory,
//   sitemap,
//   allslugs
// } from "../controllers/webstories.js";

// router.post('/webstory', requireSignin, adminMiddleware, createWebStory);
// router.get('/webstories/:slug', fetchWebStoryBySlug);
// router.get('/allwebstories', allstories);
// router.get('/allslugs', allslugs);
// router.get('/sitemap', sitemap);
// router.delete('/webstorydelete/:slug', requireSignin, adminMiddleware, deletestory);
// router.patch('/webstoriesupdate/:slug', requireSignin, adminMiddleware, updateStory);

// // ✅ Add this route to support frontend build
// router.get('/web-stories-slugs', allslugs);

// // ✅ ✅ ADD THIS LINE TO FIX VERCEL CRASH
// export default router;
import express from "express";
import {
  createWebStory,
  fetchWebStoryBySlug,
  allstories,
  deletestory,
  updateStory,
  sitemap,
  allslugs,
} from "../controllers/webstories.js";
import { requireSignin, adminMiddleware } from "../controllers/auth.js";

const router = express.Router();

// Create a new web story (Admin only)
router.post("/webstory", requireSignin, adminMiddleware, createWebStory);

// Fetch a single web story by slug
router.get("/webstories/:slug", fetchWebStoryBySlug);

// Fetch all web stories
router.get("/allwebstories", allstories);

// Fetch all slugs for frontend (e.g., for getStaticPaths in Next.js)
router.get("/allslugs", allslugs);
router.get("/web-stories-slugs", allslugs); // Alias (optional but useful)

// Sitemap generation
router.get("/sitemap", sitemap);

// Delete a story (Admin only)
router.delete("/webstorydelete/:slug", requireSignin, adminMiddleware, deletestory);

// Update a story (Admin only)
router.patch("/webstoriesupdate/:slug", requireSignin, adminMiddleware, updateStory);

// Export the router to be used in your main index.js
export default router;
