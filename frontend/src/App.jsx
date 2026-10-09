import { NavLink, Route, Routes } from 'react-router-dom';
import Icon from './components/Icon.jsx';
import Overview from './pages/Overview.jsx';
import Interview from './pages/Interview.jsx';
import Quizzes from './pages/Quizzes.jsx';
import QuizPage from './pages/QuizPage.jsx';
import Problems from './pages/Problems.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import History from './pages/History.jsx';

const NAV = [
  ['/', 'Overview', 'overview'],
  ['/interview', 'Practice interview', 'interview'],
  ['/quizzes', 'Quizzes', 'quiz'],
  ['/problems', 'Coding problems', 'code'],
  ['/history', 'History', 'history'],
];

export default function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">R</span>
          <span className="brand-name">Rehearse</span>
        </div>
        <nav>
          {NAV.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <Icon name={icon} />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="side-note">Everything runs on your computer. Your progress is saved in backend/storage.</p>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:id" element={<QuizPage />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemPage />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<p className="muted">This page does not exist.</p>} />
        </Routes>
      </main>
    </div>
  );
}
