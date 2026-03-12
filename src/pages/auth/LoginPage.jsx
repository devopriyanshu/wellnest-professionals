import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { routeByStatus } from '../../utils/statusRouter';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const selectedRole = sessionStorage.getItem('selectedRole');
  const isExpert = selectedRole === 'expert';
  
  // Theme colors based on role
  const themeColor = isExpert ? 'expert' : 'center';
  const buttonClass = isExpert 
    ? 'bg-expert-600 hover:bg-expert-500 text-white' 
    : 'bg-center-600 hover:bg-center-500 text-white';
  const ringClass = isExpert ? 'focus:ring-expert-500' : 'focus:ring-center-500';

  useEffect(() => {
    if (!selectedRole) {
      navigate('/');
    }
    
    // Check for auth errors from Google redirect
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'auth_failed') {
      setError('Google authentication failed. Please try again.');
    }
  }, [selectedRole, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      // Route based on profile status
      await routeByStatus(user, navigate);
    } catch (err) {
      setError(err.message || 'Failed to login');
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // We pass state to remember role on return if needed, but backend handles google
    // Alternatively, we save selectedRole in sessionStorage (already done) 
    // and process it in the callback page.
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/v1/auth/google`;
  };

  if (!selectedRole) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow */}
      <div className={`absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-${themeColor}-600/10 blur-[120px] mix-blend-screen pointer-events-none`} />
      <div className={`absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-${themeColor}-900/40 blur-[120px] mix-blend-screen pointer-events-none`} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <button 
          onClick={() => {
            sessionStorage.removeItem('selectedRole');
            navigate('/');
          }}
          className="absolute -top-12 left-0 text-gray-400 hover:text-white flex items-center transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Change Role
        </button>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your <span className={`text-${themeColor}-400 capitalize`}>{selectedRole}</span> account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <Link to="/signup" className={`font-medium text-${themeColor}-400 hover:text-${themeColor}-300 transition-colors`}>
            create a new account
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-gray-900 border border-gray-800 py-8 px-4 shadow-2xl shadow-black/50 sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 bg-gray-950 border border-gray-700 rounded-xl py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${ringClass} focus:border-transparent transition-all`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 bg-gray-950 border border-gray-700 rounded-xl py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${ringClass} focus:border-transparent transition-all`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium ${buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${ringClass} transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-xl shadow-sm bg-gray-950 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-all"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
