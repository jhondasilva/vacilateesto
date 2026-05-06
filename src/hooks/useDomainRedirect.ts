import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook that handles automatic redirection based on the domain.
 * When accessing from vacilateelmundial.com, redirects to /vacilate-el-futbol
 */
export const useDomainRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    
    // Check if accessing from vacilateelmundial.com domain
    const isVacilateElMundialDomain = 
      hostname === 'vacilateelmundial.com' || 
      hostname === 'www.vacilateelmundial.com';

    // If on the VEM domain and not already on the VEM page, redirect
    if (isVacilateElMundialDomain && location.pathname !== '/vacilate-el-futbol') {
      navigate('/vacilate-el-futbol', { replace: true });
    }
  }, [navigate, location.pathname]);
};
