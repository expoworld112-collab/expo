import { API } from '../config';

export const createwebstory = async (story, token) => {
    try {
        const response = await fetch(`${API}/webstory`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: story,
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
};


export const singleStory = async (slug) => {
    try {
        const response = await fetch(`${API}/webstories/${slug}`, {
            method: 'GET'
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
};



export const list = async() => {
    try {
        const response = await fetch(`${API}/allwebstories`, {
            method: 'GET'
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
};


// export const allslugs = async() => {
//     try {
//         const response = await fetch(`${API}/allslugs`, {
//             method: 'GET'
//         });
//         return await response.json();
//     } catch (err) {
//         return console.log(err);
//     }
// };
export async function allslugs() {
  try {
    const res = await fetch(process.env.API_URL + '/api/slugs'); // Example URL

    if (!res.ok) {
      console.error(`Failed to fetch slugs: ${res.status} ${res.statusText}`);
      return []; // fallback
    }

    const data = await res.json();
    
    // Ensure the data is an array or return empty fallback
    if (!Array.isArray(data)) {
      console.error('Slugs response is not an array:', data);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in allslugs():', error);
    return []; // fallback to avoid breaking build
  }
}




export const sitemap = async() => {
    try {
        const response = await fetch(`${API}/sitemap`, {
            method: 'GET'
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
};


export const DeleteStory = async (slug, token) => {

    try {
        const response = await fetch(`${API}/webstorydelete/${slug}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
};



export const updateStory = async (story, token, slug) => {

    try {
        const response = await fetch(`${API}/webstoriesupdate/${slug}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: story
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
};