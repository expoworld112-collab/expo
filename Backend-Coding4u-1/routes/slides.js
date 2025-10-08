


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

// Fetch all slugs (for Next.js getStaticPaths or similar)
router.get("/allslugs", allslugs);
router.get("/web-stories-slugs", allslugs); // Optional alias

// Sitemap
router.get("/sitemap", sitemap);

// Delete a story (Admin only)
router.delete("/webstorydelete/:slug", requireSignin, adminMiddleware, deletestory);

// Update a story (Admin only)
router.patch("/webstoriesupdate/:slug", requireSignin, adminMiddleware, updateStory);

// ✅ ✅ Required for Vercel / ESM builds
export default router;
