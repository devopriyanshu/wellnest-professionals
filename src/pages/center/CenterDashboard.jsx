import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyCenterProfile } from "../../hooks/useCenterProfile";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FaSignOutAlt,
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaRegStar,
  FaCog,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { API_BASE_URL } from "../../services/api"; // Note: might need this for image src if absolute URLs aren't stored

const CenterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch Center Profile using React Query hook
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: profileError,
  } = useMyCenterProfile();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 bg-white shadow-lg flex flex-col p-4">
          <Skeleton height={40} className="mb-8" />
          <Skeleton count={5} height={30} className="mb-4" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton height={150} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton height={100} />
            <Skeleton height={100} />
            <Skeleton height={100} />
          </div>
          <Skeleton height={300} />
        </div>
      </div>
    );
  }

  if (isErrorProfile || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FaBuilding className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load your center profile. It may not exist or there was a
            server error.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="mt-4 text-gray-600 hover:text-gray-900"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MOCK OR DERIVED DATA FOR OVERVIEW ---
  const stats = [
    { label: "Total Bookings", value: "124", icon: <FaCalendarAlt /> },
    { label: "Total Members", value: "85", icon: <FaUsers /> },
    { label: "Rating", value: profile.rating || "4.8", icon: <FaStar /> },
  ];

  /* --- Render Sections --- */

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img 
            src={profile.centerImage ? `${API_BASE_URL}${profile.centerImage}` : "https://via.placeholder.com/300x200?text=Center+Image"} 
            alt={profile.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        <div className="md:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
                <p className="text-indigo-600 font-medium">{profile.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                profile.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile.status.toUpperCase()}
              </span>
            </div>
            
            <p className="text-gray-600 mt-4 line-clamp-3">{profile.description}</p>
            
            <div className="mt-4 flex items-center text-gray-600 text-sm">
              <FaMapMarkerAlt className="mr-2 text-indigo-500" />
              {profile.address || "Address not provided"}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
            <button onClick={() => setActiveTab('settings')} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
              Edit Profile
            </button>
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 font-medium text-sm">
              Visit Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Operating Hours</h2>
      <div className="space-y-4 max-w-2xl">
        {/* We assume schedule data comes with the profile in the future. For now, showing placeholder or basic mapped data. */}
        <p className="text-gray-600">Schedule management will be available here.</p>
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
          Coming Soon: Ability to update center hours, class schedules, and trainer availability.
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Center Settings</h2>
      <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
        <FaCog className="text-4xl text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Settings Hub</h3>
        <p>Update your center's information, manage subscriptions, and configure notifications from here.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">
          Edit Profile Information
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col z-10">
        <div className="p-6 border-b border-gray-100 flex items-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3 shadow-md">
            W
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Center Portal</h1>
            <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">
              {profile?.name || "Dashboard"}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === "overview"
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FaHome className="mr-3 text-lg" />
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === "schedule"
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FaCalendarAlt className="mr-3 text-lg" />
                Schedule & Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === "settings"
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FaCog className="mr-3 text-lg" />
                Settings
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center">
            <div className="bg-indigo-100 text-indigo-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-3 flex-shrink-0">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-800 capitalize">
            {activeTab.replace("-", " ")}
          </h1>
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "C"}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "schedule" && renderSchedule()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default CenterDashboard;
