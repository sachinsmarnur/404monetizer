import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function useAuthRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  const handleAuthRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/sign-in');
    }
  };

  return { handleAuthRedirect };
} 