import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMyExpertProfile } from '../../hooks/useExpertProfile';
import { useExpertAppointments, useUpdateAppointmentStatus } from '../../hooks/useAppointments';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  FileText
} from 'lucide-react';

const ExpertDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMyExpertProfile();
  const { data: appointments, isLoading: apptsLoading } = useExpertAppointments(profile?.id);
  const { mutate: updateStatus } = useUpdateAppointmentStatus(profile?.id);

  const [activeTab, setActiveTab] = useState('appointments');

  if (profileLoading || apptsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-expert-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const upcomingAppts = appointments?.filter(a => a.status === 'scheduled') || [];
  const pendingAppts = appointments?.filter(a => a.status === 'pending') || [];

  const handleUpdateStatus = (id, newStatus) => {
    updateStatus({ id, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            <span className="text-expert-400">Expert</span> Portal
          </h2>
          <p className="text-gray-400 text-sm mt-1">{profile?.name || user?.name}</p>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <button 
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'appointments' ? 'bg-expert-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <CalendarIcon className="w-5 h-5 mr-3" />
                Appointments
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-expert-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <User className="w-5 h-5 mr-3" />
                My Profile
              </button>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4">
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-expert-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600 capitalize">{profile?.status || 'Active'}</span>
            </div>
            {profile?.profilePic && (
              <img src={profile.profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-expert-200" />
            )}
          </div>
        </header>

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900">{upcomingAppts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingAppts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-expert-50 text-expert-500 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">{appointments?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Appointment Schedule</h3>
              </div>
              <div className="overflow-x-auto">
                {appointments?.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No appointments found.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm">
                        <th className="p-4 font-medium">Patient</th>
                        <th className="p-4 font-medium">Date & Time</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments?.map(appt => (
                        <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                                {appt.user?.name ? appt.user.name.charAt(0) : 'P'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{appt.user?.name || 'Unknown Patient'}</p>
                                <p className="text-xs text-gray-500">ID: {appt.userId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 flex flex-col">
                            <span className="font-medium text-gray-900">{new Date(appt.date).toLocaleDateString()}</span>
                            <span className="text-sm text-gray-500">{appt.startTime || '10:00 AM'}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              appt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                              appt.status === 'completed' ? 'bg-expert-100 text-expert-700' :
                              appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {appt.status === 'pending' && (
                                <>
                                  <button onClick={() => handleUpdateStatus(appt.id, 'scheduled')} className="p-2 text-expert-600 hover:bg-expert-50 rounded-lg transition-colors" title="Accept">
                                    <CheckCircle size={18} />
                                  </button>
                                  <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                    <XCircle size={18} />
                                  </button>
                                </>
                              )}
                              
                              <button 
                                onClick={() => navigate(`/expert/patient/${appt.userId}/logs`)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm ml-2"
                              >
                                <FileText size={14} />
                                View Logs
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-lg text-gray-900">{profile?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                <p className="text-lg text-gray-900">{profile?.category || 'N/A'}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
                <p className="text-gray-700 leading-relaxed">{profile?.bio || 'No bio provided.'}</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500">To edit your full profile, including qualifications, specialties, and schedule, please contact an administrator or update via the legacy setup panel.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpertDashboard;
