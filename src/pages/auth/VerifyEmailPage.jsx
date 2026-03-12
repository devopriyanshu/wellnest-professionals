import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { publicAxios } from '../../services/authAxios';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmailPage = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await publicAxios.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res?.message || 'Email verified successfully. You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The token may be expired or invalid.');
      }
    };

    verifyToken();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 py-10 px-8 shadow-2xl sm:rounded-2xl sm:px-10 text-center max-w-md w-full"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Verifying your email</h2>
            <p className="text-gray-400">Please wait a moment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Verification Successful</h2>
            <p className="text-gray-300 mb-8">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
            >
              Log in to your account
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Verification Failed</h2>
            <p className="text-gray-300 mb-8">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium bg-gray-800 hover:bg-gray-700 text-white transition-all"
            >
              Return to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
