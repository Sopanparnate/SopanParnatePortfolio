/**
 * projects.js — Single source of truth for all project data.
 *
 * API-READY: When you wire up the backend, replace this array with a
 * fetch call to GET /api/projects and return the same shape.
 *
 * Shape per project:
 * {
 *   id:          string   — unique slug, used in URLs if you add detail pages later
 *   number:      string   — display index e.g. "01"
 *   title:       string
 *   tagline:     string   — one-line elevator pitch (shown on full page)
 *   description: string   — 2-3 sentence detailed description
 *   stack:       string[] — tech tags
 *   category:    string   — used for filter tabs: "Full-Stack" | "Frontend" | "Backend" | "Tool"
 *   status:      string   — "Live" | "In Progress" | "Archived"
 *   year:        string
 *   github:      string | null
 *   live:        string | null
 *   featured:    boolean  — shown in homepage section
 * }
 */

export const PROJECTS = [
  {
  id: 'schemesathi',
  number: '01',
  title: 'SchemeSathi',
  tagline: 'Smart government scheme discovery platform for citizens.',
  description:
    'A full-stack platform that helps users discover eligible government schemes through an intelligent multi-filter search system. Features secure authentication, responsive UI, and real-time filtering for a smooth user experience.',
  stack: ['MongoDB', 'Express.js', 'HTML', 'CSS', 'JavaScript', 'Node.js'],
  category: 'Full-Stack',
  status: 'Completed',
  year: '2025',
  github: 'https://github.com',
  live: 'https://example.com',
  featured: true,
},
{
  id: 'codezenith',
  number: '02',
  title: 'CodeZenith',
  tagline: 'Real-time competitive coding and contest platform.',
  description:
    'A competitive coding platform featuring live leaderboards, timed contests, and real-time score updates using Socket.io. Includes a code editor, problem management system, submission validation, and role-based access control for admins and participants.',
  stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io'],
  category: 'Full-Stack',
  status: 'Completed',
  year: '2025',
  github: 'https://github.com',
  live: 'https://example.com',
  featured: true,
},
{
  id: 'agriguard',
  number: '03',
  title: 'AgriGuard',
  tagline: 'AI-powered crop disease detection platform.',
  description:
    'An intelligent plant disease detection system that uses machine learning to identify crop diseases from uploaded images and provide preventive recommendations. Built with a responsive interface designed for accessibility and real-time prediction results.',
  stack: ['React', 'Node.js', 'Python', 'Machine Learning', 'Flask'],
  category: 'AI / Full-Stack',
  status: 'Completed',
  year: '2025',
  github: 'https://github.com',
  live: 'https://example.com',
  featured: true,
},
{
  id: 'gym-management',
  number: '04',
  title: 'Gym Management System',
  tagline: 'Smart fitness and membership management platform.',
  description:
    'A responsive gym management system designed to handle memberships, trainer schedules, workout plans, attendance tracking, and payment management. Built with a clean dashboard interface for both admins and members.',
  stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
  category: 'Web Application',
  status: 'Completed',
  year: '2025',
  github: 'https://github.com',
  live: 'https://example.com',
  featured: false,
},
{
  id: 'hotel-management',
  number: '05',
  title: 'Hotel Management System',
  tagline: 'Modern hotel booking and management solution.',
  description:
    'A full-stack hotel management platform that streamlines room booking, customer management, check-in/check-out operations, and reservation tracking with an intuitive and responsive user interface.',
  stack: ['React', 'Node.js', 'Express.js', 'MongoDB'],
  category: 'Full-Stack',
  status: 'Completed',
  year: '2025',
  github: 'https://github.com',
  live: 'https://example.com',
  featured: false,
},
{
  id: 'yoga-classes',
  number: '06',
  title: 'Yoga Classes Website',
  tagline: 'Modern wellness and yoga booking platform.',
  description:
    'A premium responsive yoga classes website designed for wellness studios and fitness brands. Includes class schedules, trainer profiles, membership plans, contact forms, and smooth modern UI interactions for an engaging user experience.',
  stack: ['HTML', 'CSS', 'JavaScript', 'React'],
  category: 'Frontend / Web Design',
  status: 'Completed',
  year: '2025',
  github: 'https://github.com',
  live: 'https://example.com',
  featured: true,
},


];

/** Distinct category labels derived from data — use for filter tabs */
export const CATEGORIES = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
