import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateAvatar } = useAuthStore();
  const [avatar, setAvatar] = useState(authUser?.avatar);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setAvatar(base64);
        updateAvatar(base64); // Update avatar in the Zustand store and localStorage
        toast.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">
          You need to log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Profile
        </h2>

        <div className="flex flex-col items-center">
          <div className="relative group mb-4">
            <img
              src={avatar}
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-md transition duration-300 group-hover:opacity-80"
            />
            <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-white rounded-full cursor-pointer transition">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 text-center space-y-2">
            <p className="text-lg">
              <strong>👤 Username:</strong> {authUser.username || "Chưa có tên"}
            </p>
            <p className="text-lg">
              <strong>📧 Email:</strong> {authUser.email || "Chưa có email"}
            </p>
            <p className="text-lg">
              <strong>🎓 Role:</strong> {"Người dùng"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
