import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Define routes that do NOT require authentication
const publicRoutes = ['/', '/login', '/signup'];

const RouteGuard = () => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const location = useLocation();

  console.log('RouteGuard: Checking route for', location.pathname, '- User:', user ? 'Authenticated' : 'Not Authenticated', '- Loading:', loading);

  // If authentication state is still loading, render nothing or a loading indicator
  if (loading) {
    console.log('RouteGuard: Authentication state is loading...');
    return null; // Or return a loading spinner component
  }

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.includes(location.pathname);
  console.log('RouteGuard: Path', location.pathname, 'is public route:', isPublicRoute);

  // If the user is not authenticated
  if (!user) {
    console.log('RouteGuard: User is not authenticated.');
    // If the route is not public, redirect to login
    if (!isPublicRoute) {
      console.log('RouteGuard: Redirecting to login.');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // If the user is authenticated AND trying to access a public auth route (login/signup), redirect to my-team
  // This prevents authenticated users from seeing the login/signup pages.
  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
      console.log('RouteGuard: User is authenticated and trying to access login/signup, redirecting to /my-team.');
      return <Navigate to="/my-team" replace />;
  }

  // If authenticated and not a public auth route, or if not authenticated and is a public route
  // Allow access to the requested route.
  console.log('RouteGuard: User is authenticated or route is public, allowing access.');
  return <Outlet />;
};

export default RouteGuard;
