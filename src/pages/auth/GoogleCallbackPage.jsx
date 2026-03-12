import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { routeByStatus } from '../../utils/statusRouter';

const GoogleCallbackPage = () => {
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUser } = useAuth(); // Needs to just fetch the user since token is already in URL

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const errParam = params.get('error');

        if (errParam) {
          navigate(`/login?error=${errParam}`);
          return;
        }

        if (!token) {
          navigate('/login?error=auth_failed');
          return;
        }

        // Save token
        localStorage.setItem('pro_token', token);

        // Fetch user data manually using the newly saved token
        const userResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!userResponse.ok) throw new Error('Failed to fetch user profile');
        const { data: user } = await userResponse.json();

        // Role Enforcement
        const selectedRole = sessionStorage.getItem('selectedRole');
        
        // If they selected a role but log in with an account of a DIFFERENT role
        if (selectedRole && user.role !== selectedRole && ['expert', 'center'].includes(user.role)) {
          // It's technically another valid pro role, but mismatch. We can let them in to their actual role
          // or block. Let's redirect to their actual role to be helpful.
          sessionStorage.setItem('selectedRole', user.role);
        }

        if (!['expert', 'center'].includes(user.role)) {
          localStorage.removeItem('pro_token');
          setError('Access Denied: This portal is for Experts and Centers only.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Ensure AuthContext is aware before routing
        await fetchUser();
        
        // Route based on profile status
        await routeByStatus(user, navigate);

      } catch (err) {
        console.error('Google Callback Error:', err);
        navigate('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [location, navigate, fetchUser]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center py-12 px-4">
        <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-2xl max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-red-200">{error}</p>
          <p className="text-red-300 mt-4 text-sm">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-400 font-medium">Authenticating via Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
