import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function PrivateRoute() {
  const { user, loading } = useAuthStore();
  if (loading) return <p>Loading...</p>;
  return user ? <Outlet /> : <Navigate to='/login' />;
}