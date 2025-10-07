
import WebStory from "../models/webstory.js";
import slugify from "slugify";
import moment from "moment-timezone";
import multer from "multer";

const upload = multer({});

// Create a new web story
export const createWebStory = async (req, res) => {
  upload.none()(req, res, async (err) => {
    if (err) return res.status(400).json({ error: "Something went wrong" });

    const {
      title,
      description,
      slug,
      coverphoto,
      slides,
      link,
      lastimage,
      lastheading,
      ads,
    } = req.body;

    // Validate inputs
    if (!title || title.length > 69)
      return res
        .status(400)
        .json({ error: "Title is required, max 69 characters" });
    if (!description || description.length > 200)
      return res
        .status(400)
        .json({ error: "Description is required, max 200 characters" });
    if (!slug) return res.status(400).json({ error: "Slug is required" });
    if (!coverphoto)
      return res.status(400).json({ error: "Cover photo is required" });
    if (!slides) return res.status(400).json({ error: "Slides are required" });

    try {
      const story = new WebStory({
        title,
        slug: slugify(slug).toLowerCase(),
        description,
        coverphoto,
        date: moment().tz("Asia/Kolkata").format(),
        slides: JSON.parse(slides),
        link,
        lastheading,
        lastimage,
        ads,
      });

      const savedStory = await story.save();

      // Trigger revalidation of frontend cache/pages
      fetch(`${process.env.MAIN_URL}/api/revalidate?path=/web-stories/${story.slug}`, {
        method: "POST",
      });
      fetch(`${process.env.MAIN_URL}/api/revalidate?path=/web-stories`, {
        method: "POST",
      });

      return res.status(201).json(savedStory);
    } catch (error) {
      return res.status(500).json({ error: "Slug should be unique" });
    }
  });
};

// Fetch a single web story by slug
export const fetchWebStoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const webStory = await WebStory.findOne({ slug });

    if (!webStory)
      return res.status(404).json({ error: "Web story not found" });

    res.json(webStory);
  } catch (error) {
    console.error("Error fetching web story by slug:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get latest 12 web stories (summary fields)
export const allstories = async (req, res) => {
  try {
    const stories = await WebStory.find({})
      .sort({ date: -1 })
      .select("-_id title slug date coverphoto description")
      .limit(12)
      .exec();

    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all slugs
export const allslugs = async (req, res) => {
  try {
    const slugs = await WebStory.find({})
      .sort({ date: -1 })
      .select("-_id slug")
      .exec();

    res.json(slugs);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Sitemap data
export const sitemap = async (req, res) => {
  try {
    const sitemapData = await WebStory.find({})
      .sort({ date: -1 })
      .select("-_id title slug date coverphoto")
      .exec();

    res.json(sitemapData);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a story by slug
export const deletestory = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const deletedStory = await WebStory.findOneAndRemove({ slug }).exec();

    if (!deletedStory)
      return res.status(404).json({ error: "WebStory not found" });

    // Trigger revalidation after deletion
    fetch(`${process.env.MAIN_URL}/api/revalidate?path=/web-stories/${slug}`, {
      method: "POST",
    });
    fetch(`${process.env.MAIN_URL}/api/revalidate?path=/web-stories`, {
      method: "POST",
    });

    res.json({ message: "WebStory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a story by slug
export const updateStory = async (req, res) => {
  upload.none()(req, res, async (err) => {
    if (err) return res.status(400).json({ error: "Something went wrong" });

    const updateFields = req.body;

    try {
      const slug = req.params.slug.toLowerCase();

      if (!slug) return res.status(404).json({ error: "Story not found" });

      const story = await WebStory.findOne({ slug }).exec();
      if (!story) return res.status(404).json({ error: "Story not found" });

      story.date = moment().tz("Asia/Kolkata").format();

      // Update fields selectively
      for (const key of Object.keys(updateFields)) {
        if (key === "title") story.title = updateFields.title;
        else if (key === "description") story.description = updateFields.description;
        else if (key === "slug") story.slug = slugify(updateFields.slug).toLowerCase();
        else if (key === "coverphoto") story.coverphoto = updateFields.coverphoto;
        else if (key === "ads") story.ads = updateFields.ads;
        else if (key === "slides") story.slides = JSON.parse(updateFields.slides);
        else if (key === "link") story.link = updateFields.link;
        else if (key === "lastimage") story.lastimage = updateFields.lastimage;
        else if (key === "lastheading") story.lastheading = updateFields.lastheading;
      }

      const savedStory = await story.save();

      await fetch(`${process.env.MAIN_URL}/api/revalidate?path=/web-stories/${story.slug}`, {
        method: "POST",
      });
      fetch(`${process.env.MAIN_URL}/api/revalidate?path=/web-stories`, {
        method: "POST",
      });

      return res.status(200).json(savedStory);
    } catch (error) {
      console.error("Error updating web story:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
