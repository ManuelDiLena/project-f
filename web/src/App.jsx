import { Outlet, Link, useLocation } from 'react-router-dom';

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className='min-h-screen'>
      <nav className='sticky top-0 border-b bg-white/80 backdrop-blur z-10'>
        <div className='max-w-5xl mx-auto px-4 py-3 flex items-center gap-4'>
          <Link to='/' className='font-bold'>⚽ Futbol App</Link>
          <div className='ml-auto flex gap-3 text-sm'>
            <Link to='/login' className={pathname==='/login' ? 'font-semibold' : ''}>Login</Link>
            <Link to='/register' className={pathname==='/register' ? 'font-semibold' : ''}>Register</Link>
          </div>
        </div>
      </nav>
      <main className='max-w-5xl mx-auto p-4'>
        <Outlet />
      </main>
    </div>
  );
}