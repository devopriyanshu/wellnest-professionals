import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientLogs } from '../../hooks/usePatientLogs';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  ArrowLeft,
  Moon,
  Activity,
  Utensils,
  Calendar,
  AlertCircle
} from 'lucide-react';

const PatientLogsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePatientLogs(userId);
  const [activeTab, setActiveTab] = useState('sleep');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-20 items-center">
        <div className="w-10 h-10 border-4 border-expert-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 mt-4">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center pt-20">
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error || 'You do not have permission to view these logs.'}</p>
          <button 
            onClick={() => navigate('/expert/dashboard')}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors inline-block"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { sleepLogs = [], activityLogs = [], meals = [], appointments = [] } = data || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/expert/dashboard')}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Data Logs</h1>
              <p className="text-sm text-gray-500 font-medium">Patient ID: {userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-expert-50 px-4 py-2 rounded-xl text-expert-700 font-medium border border-expert-100">
            <Calendar className="w-4 h-4" />
            {appointments?.length} Shared Appointments
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto">
          <TabButton 
            active={activeTab === 'sleep'} 
            onClick={() => setActiveTab('sleep')} 
            icon={<Moon className="w-4 h-4" />} 
            label="Sleep Logs" 
            count={sleepLogs.length}
          />
          <TabButton 
            active={activeTab === 'activity'} 
            onClick={() => setActiveTab('activity')} 
            icon={<Activity className="w-4 h-4" />} 
            label="Activity" 
            count={activityLogs.length}
          />
          <TabButton 
            active={activeTab === 'meals'} 
            onClick={() => setActiveTab('meals')} 
            icon={<Utensils className="w-4 h-4" />} 
            label="Meals" 
            count={meals.length}
          />
        </div>

        {/* Tab Content Panels */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'sleep' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Moon className="text-indigo-500" />
                Sleep History
              </h2>
              {sleepLogs.length === 0 ? <EmptyState itemName="sleep records" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sleepLogs.map(log => (
                    <div key={log.id} className="p-5 border border-gray-100 bg-gray-50 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100" />
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        {log.createdAt ? format(new Date(log.createdAt), 'MMM d, yyyy') : 'Unknown Date'}
                      </p>
                      <div className="flex items-end gap-2 mb-3">
                        <p className="text-3xl font-bold text-gray-900">{log.hoursSpelt}</p>
                        <p className="text-gray-500 mb-1 font-medium">hrs</p>
                      </div>
                      
                      <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Quality</span>
                          <span className="font-semibold text-gray-900">{log.quality}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">In Bed</span>
                          <span className="font-semibold text-gray-900">{log.timeInBed} hrs</span>
                        </div>
                        {log.notes && (
                          <div className="mt-3 bg-white p-3 rounded-lg border border-gray-100 italic text-gray-600">
                            "{log.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="text-emerald-500" />
                Activity History
              </h2>
              {activityLogs.length === 0 ? <EmptyState itemName="activity records" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activityLogs.map(log => (
                    <div key={log.id} className="p-5 border border-gray-100 bg-gray-50 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100" />
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-gray-500">
                          {log.createdAt ? format(new Date(log.createdAt), 'MMM d, yyyy') : 'Unknown Date'}
                        </p>
                        <span className="px-3 py-1 bg-white text-emerald-700 font-bold text-xs rounded-full border border-gray-200">
                          {log.caloriesBurned} kcal
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{log.type}</h3>
                      
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-semibold text-gray-900">{log.duration} mins</span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200 text-sm">
                        <span className="text-gray-500">Intensity:</span> 
                        <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-gray-700 text-xs font-semibold capitalize">{log.intensity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Utensils className="text-orange-500" />
                Meal History
              </h2>
              {meals.length === 0 ? <EmptyState itemName="meal records" /> : (
                <div className="space-y-4">
                  {meals.map(meal => (
                    <div key={meal.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 bg-gray-50 rounded-2xl group hover:border-gray-300 transition-colors">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{meal.name}</h3>
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md tracking-wide ${
                            meal.type === 'breakfast' ? 'bg-amber-100 text-amber-800' :
                            meal.type === 'lunch' ? 'bg-orange-100 text-orange-800' :
                            meal.type === 'dinner' ? 'bg-cyan-100 text-cyan-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {meal.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">
                          {meal.date ? format(new Date(meal.date), 'MMM d, yyyy h:mm a') : 'Unknown Date'}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 items-center">
                        <MacroBadge label="Kcal" value={meal.calories} color="bg-gray-100 text-gray-800" />
                        <MacroBadge label="Pro" value={`${meal.protein}g`} color="bg-rose-100 text-rose-800" />
                        <MacroBadge label="Carb" value={`${meal.carbs}g`} color="bg-yellow-100 text-yellow-800" />
                        <MacroBadge label="Fat" value={`${meal.fats}g`} color="bg-red-100 text-red-800" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

// Subcomponents
const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 flex-1 md:flex-none justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
      active ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`}
  >
    {icon}
    {label}
    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${active ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
      {count}
    </span>
  </button>
);

const MacroBadge = ({ label, value, color }) => (
  <div className={`flex flex-col items-center px-4 py-2 rounded-xl border border-white/50 ${color}`}>
    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</span>
    <span className="text-base font-black">{value}</span>
  </div>
);

const EmptyState = ({ itemName }) => (
  <div className="py-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FileText className="text-gray-400 w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">No data available</h3>
    <p className="text-gray-500">The patient hasn't logged any {itemName} yet.</p>
  </div>
);

export default PatientLogsPage;
