import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Home sections
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

// Pages
import ProjectsPage from './pages/ProjectsPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function ProjectsLayout() {
  return (
    <>
      <Navbar minimal />
      <ProjectsPage />
      <Footer />
    </>
  );
}

// Redirect to dashboard if already logged in
function AdminLoginGuard() {
  const token = localStorage.getItem('admin_token');
  return token ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />;
}

function App() {
  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      <BrowserRouter>
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/projects"          element={<ProjectsLayout />} />
          <Route path="/admin"             element={<AdminLoginGuard />} />
          <Route path="/admin/dashboard"   element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
