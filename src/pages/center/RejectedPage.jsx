import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, LogOut } from 'lucide-react';

const CenterRejectedPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-red-900/50 shadow-2xl rounded-2xl p-10 text-center max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
        
        <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <XCircle className="text-red-500 w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Application Rejected</h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          Unfortunately, your center application could not be approved at this time. 
          This might be due to missing amenities, an incomplete profile, or failure to meet our platform standards.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/center/register?reapply=true')}
            className="flex items-center justify-center w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors font-medium text-sm"
          >
            <RefreshCw size={18} className="mr-2" />
            Update Profile & Reapply
          </button>
          
          <button
            onClick={logout}
            className="flex items-center justify-center w-full py-3 px-4 border border-gray-700 hover:bg-gray-800 hover:text-white rounded-xl text-gray-300 transition-colors font-medium text-sm"
          >
            <LogOut size={18} className="mr-2" />
            Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CenterRejectedPage;
