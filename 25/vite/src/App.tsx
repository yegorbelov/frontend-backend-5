import { lazy, Suspense } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';

const AboutPage = lazy(() => import('./pages/AboutPage'));

export default function App() {
  return (
    <BrowserRouter>
      <header className='app-shell'>
        <nav className='app-nav' aria-label='Основная навигация'>
          <NavLink className='app-nav-link' to='/' end>
            Главная
          </NavLink>
          <NavLink className='app-nav-link' to='/about'>
            О нас
          </NavLink>
        </nav>
      </header>
      <main className='app-main'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/about'
            element={
              <Suspense fallback={<p className='route-fallback'>Загрузка…</p>}>
                <AboutPage />
              </Suspense>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
