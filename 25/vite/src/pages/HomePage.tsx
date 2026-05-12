import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import heroImg from '../assets/hero.png';

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section id='center'>
        <div className='hero'>
          <img src={heroImg} className='base' width='170' height='179' alt='' />
          <img src={reactLogo} className='framework' alt='React logo' />
          <img src={viteLogo} className='vite' alt='Vite logo' />
        </div>
        <div>
          <h1>Vite</h1>
        </div>
        <button
          type='button'
          className='counter'
          onClick={() => setCount((c) => c + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className='ticks'></div>

      <section id='next-steps'>
        <div id='docs'>
          <svg className='icon' role='presentation' aria-hidden='true'>
            <use href='/icons.svg#documentation-icon'></use>
          </svg>
          <h2>Документация</h2>
          <p>Vite и React</p>
          <ul>
            <li>
              <a href='https://vite.dev/' target='_blank' rel='noreferrer'>
                <img className='logo' src={viteLogo} alt='' />
                Vite
              </a>
            </li>
            <li>
              <a href='https://react.dev/' target='_blank' rel='noreferrer'>
                <img className='button-icon' src={reactLogo} alt='' />
                React
              </a>
            </li>
          </ul>
        </div>
        <div id='social'>
          <svg className='icon' role='presentation' aria-hidden='true'>
            <use href='/icons.svg#social-icon'></use>
          </svg>
          <h2>Сообщество</h2>
          <p>Vite на GitHub</p>
          <ul>
            <li>
              <a
                href='https://github.com/vitejs/vite'
                target='_blank'
                rel='noreferrer'
              >
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#github-icon'></use>
                </svg>
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className='ticks'></div>
      <section id='spacer'></section>
    </>
  );
}
