
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
      }
    }
  }, [user, loading]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dsfl-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dsfl-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
