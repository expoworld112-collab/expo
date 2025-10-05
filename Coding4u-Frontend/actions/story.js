
import { API } from '../config';

// Create a new web story
export const createwebstory = async (storyData, token) => {
  try {
    const response = await fetch(`${API}/webstories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });
    return await response.json();
  } catch (err) {
    console.error('createwebstory error:', err);
    return null;
  }
};

// List all web stories
export const list = async () => {
  try {
    const response = await fetch(`${API}/webstories`);
    return await response.json();
  } catch (err) {
    console.error('list error:', err);
    return [];
  }
};

// Delete a story by ID
export const DeleteStory = async (id, token) => {
  try {
    const response = await fetch(`${API}/webstories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.error('DeleteStory error:', err);
    return null;
  }
};

// Update a story by ID
export const updateStory = async (id, storyData, token) => {
  try {
    const response = await fetch(`${API}/webstories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });
    return await response.json();
  } catch (err) {
    console.error('updateStory error:', err);
    return null;
  }
};

// Fetch single story by slug
export const singleStory = async (slug) => {
  try {
    const response = await fetch(`${API}/webstories/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch story: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error('singleStory error:', err);
    return null;
  }
};

// Fetch all slugs for SSG paths
export const getAllWebStorySlugs = async () => {
  try {
    const response = await fetch(`${API}/webstories/slugs`);
    if (!response.ok) throw new Error(`Failed to fetch slugs: ${response.status}`);
    const data = await response.json();
    return data.map((item) => item.slug);
  } catch (err) {
    console.error('getAllWebStorySlugs error:', err);
    return [];
  }
};
