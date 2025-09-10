import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../store/auth';

export function useAuthListener() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, [setUser]);
}