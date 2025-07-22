import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'
import Image from './page/Image'
import Information from './page/Information'
import Achievement from './page/Achievement'
import Social from './page/Social'
import Resume from './page/Resume'
import Skill from './page/Skill'
import Text from './page/Text'
import Portfolio from './page/Portfolio'
import Blog from './page/Blog'
import Email from './page/Email'
import InformationField from './component/Information/InformationField'
import AchievementField from './component/Achievement/AchievementField'
import SocialField from './component/Social/SocialField'
import ResumeField from './component/Resume/ResumeField'
import SkillField from './component/Skill/SkillField'
import TextField from './component/Text/TextField'
import PortfolioField from './component/Portfolio/PortfolioField'
import BlogField from './component/Blog/BlogField'
import Login from './page/Login'
import ProtectedRoute from './component/ProtectedRoute'
import 'preline/preline';

function App() {
  useEffect(() => {
    const initPreline = () => {
      if (typeof window !== 'undefined' && window.HSOverlay?.init) {
        window.HSOverlay.init();
      }
    };

    // Wait until DOM is ready before initializing Preline
    if (document.readyState === 'complete') {
      initPreline();
    } else {
      window.addEventListener('load', initPreline);
      return () => window.removeEventListener('load', initPreline);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Navigate to="/information" />}/>
          <Route path='/information' element={<Information/>} />
          <Route path='/information-detail' element={<InformationField/>} />
          <Route path='/achievement' element={<Achievement/>} />
          <Route path='/achievement-detail' element={<AchievementField/>} />
          <Route path='/social' element={<Social/>} />
          <Route path='/social-detail' element={<SocialField/>} />
          <Route path='/resume' element={<Resume/>} />
          <Route path='/resume-detail' element={<ResumeField/>} />
          <Route path='/skill' element={<Skill/>} />
          <Route path='/skill-detail' element={<SkillField/>} />
          <Route path='/text' element={<Text/>} />
          <Route path='/text-detail' element={<TextField/>} />
          <Route path='/portfolio' element={<Portfolio/>} />
          <Route path='/portfolio-detail' element={<PortfolioField/>} />
          <Route path='/blog' element={<Blog/>} />
          <Route path='/blog-detail' element={<BlogField/>} />
          <Route path='/email' element={<Email/>} />
          <Route path='/image' element={<Image/>} />
        </Route>
        <Route path='/login' element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App
