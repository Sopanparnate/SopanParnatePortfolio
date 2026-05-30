import { useState, useEffect } from 'react';
import axios from 'axios';
import { PROJECTS as STATIC_PROJECTS } from '../data/projects.js';

const API_URL = 'https://sopanparnateportfolio.onrender.com/api/projects';

// Normalize API project shape to match static data shape
function normalize(p, index) {
  return {
    id:          p._id || p.id,
    number:      String(index + 1).padStart(2, '0'),
    title:       p.title,
    tagline:     p.tagline,
    description: p.description,
    stack:       p.stack || [],
    category:    p.category || 'Full-Stack',
    status:      p.status || 'Live',
    github:      p.github || null,
    live:        p.live || null,
    image:       p.image ? `https://sopanparnateportfolio.onrender.com${p.image}` : null,
    featured:    p.featured || false,
    year:        p.year || '',
  };
}

export function useProjects() {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fromApi, setFromApi]     = useState(false);

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data.map(normalize));
          setFromApi(true);
        } else {
          // API returned empty — fall back to static
          setProjects(STATIC_PROJECTS);
        }
      })
      .catch(() => {
        // API unreachable — fall back to static
        setProjects(STATIC_PROJECTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, fromApi };
}
