// src/pages/Profile.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Edit2, Save, X, Camera } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axiosConfig";

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.put("/auth/profile", formData);
      if (response.data.status === "SUCCESS") {
        updateUser({ ...user!, ...formData });
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="glass-card p-6 text-center sticky top-24">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <button className="absolute bottom-4 right-0 p-2 glass-card rounded-full hover:bg-white/40 transition">
                <Camera className="w-4 h-4 text-purple-600" />
              </button>
            </div>
            <h2 className="text-xl font-bold mb-1">
              {user?.firstname} {user?.lastname}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{user?.email}</p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm text-gray-500">
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/40 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 glass-card hover:bg-white/40 transition flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="glass-button !py-2 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                    className="glass-input w-full"
                  />
                ) : (
                  <p className="text-gray-800">{user?.firstname}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    className="glass-input w-full"
                  />
                ) : (
                  <p className="text-gray-800">{user?.lastname}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="glass-input w-full"
                  />
                ) : (
                  <p className="text-gray-800">{user?.email}</p>
                )}
              </div>

              {/* Account Stats */}
              <div className="pt-6 border-t border-white/20">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Account Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold gradient-text">0</p>
                    <p className="text-sm text-gray-600">Total Reads</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold gradient-text">0</p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-red-200">
                <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
                <button
                  onClick={() =>
                    toast.error("Contact support to delete account")
                  }
                  className="px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
