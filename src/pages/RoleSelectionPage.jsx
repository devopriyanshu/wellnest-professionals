import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    // If already logged in, redirect to correct dashboard
    if (token && user) {
      if (user.role === 'expert') navigate('/expert/dashboard');
      else if (user.role === 'center') navigate('/center/dashboard');
    }
  }, [token, user, navigate]);

  const handleSelectRole = (role) => {
    sessionStorage.setItem('selectedRole', role);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-expert-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-center-600/20 blur-[120px] mix-blend-screen" />
      </div>

      <div className="z-10 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Well<span className="text-emerald-400">Nest</span> Professional
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
            Select your partnership type to access your dedicated portal
          </p>
        </motion.div>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl w-full px-4">
        {/* Expert Card */}
        <motion.button
          onClick={() => handleSelectRole('expert')}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative text-left bg-gray-900 border border-gray-800 rounded-2xl p-8 overflow-hidden hover:border-expert-500/50 transition-all duration-300 shadow-2xl shadow-black/50"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserPlus size={120} className="text-expert-400" />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-expert-500/20 flex items-center justify-center mb-6 group-hover:bg-expert-500/30 transition-colors">
              <UserPlus className="text-expert-400" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-expert-400 transition-colors">
              Expert
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 h-20">
              Doctors, Therapists, Trainers, and individual wellness professionals.
            </p>
            <div className="inline-flex items-center font-medium text-expert-400">
              Continue as Expert <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </motion.button>

        {/* Center Card */}
        <motion.button
          onClick={() => handleSelectRole('center')}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative text-left bg-gray-900 border border-gray-800 rounded-2xl p-8 overflow-hidden hover:border-center-500/50 transition-all duration-300 shadow-2xl shadow-black/50"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 size={120} className="text-center-400" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-center-500/20 flex items-center justify-center mb-6 group-hover:bg-center-500/30 transition-colors">
              <Building2 className="text-center-400" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-center-400 transition-colors">
              Center
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 h-20">
              Hospitals, Clinics, Gyms, and multi-practitioner wellness facilities.
            </p>
            <div className="inline-flex items-center font-medium text-center-400">
              Continue as Center <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </motion.button>
      </div>
      
    </div>
  );
};

export default RoleSelectionPage;
