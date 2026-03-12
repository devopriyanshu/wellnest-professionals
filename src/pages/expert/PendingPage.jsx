import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Clock, LogOut } from 'lucide-react';

const ExpertPendingPage = () => {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-expert-900 shadow-2xl rounded-2xl p-10 text-center max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-expert-500" />
        
        <div className="w-20 h-20 bg-expert-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-expert-500/30">
          <Clock className="text-expert-400 w-10 h-10 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Under Review</h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          Your expert application has been received and is currently under review by our administrative team. 
          We typically process applications within <span className="text-expert-400 font-medium">1-2 business days</span>.
        </p>

        <div className="bg-gray-950 rounded-xl p-4 mb-8 border border-gray-800 text-left">
          <h3 className="text-white font-medium mb-3 text-sm uppercase tracking-wider">Application Status</h3>
          <ul className="space-y-3 relative">
            <li className="flex items-start">
               <div className="w-6 h-6 rounded-full bg-expert-500/20 flex items-center justify-center mr-3 mt-0.5 z-10">
                 <div className="w-2 h-2 rounded-full bg-expert-500" />
               </div>
               <div>
                 <p className="text-white text-sm font-medium">Application Submitted</p>
                 <p className="text-gray-500 text-xs">Waiting for admin review</p>
               </div>
            </li>
            <div className="absolute left-3 top-6 w-0.5 h-8 bg-gray-800 -z-0" />
            <li className="flex items-start opacity-40">
               <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-0.5 z-10">
                 <div className="w-2 h-2 rounded-full bg-gray-600" />
               </div>
               <div>
                 <p className="text-white text-sm font-medium">Profile Approval</p>
                 <p className="text-gray-500 text-xs">Pending</p>
               </div>
            </li>
          </ul>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center w-full py-3 px-4 border border-gray-700 hover:bg-gray-800 hover:text-white rounded-xl text-gray-300 transition-colors font-medium text-sm"
        >
          <LogOut size={18} className="mr-2" />
          Log Out for Now
        </button>
      </motion.div>
    </div>
  );
};

export default ExpertPendingPage;
