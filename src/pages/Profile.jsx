// SKILLFORGE/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Camera, Save, Lock, Flame, Crown } from "lucide-react";
import API from "../utils/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me");
        setUser(res.data);
        setName(res.data.name);
        setProfilePic(res.data.profilePic || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("❌ Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // ✅ Upload image to Cloudinary
  const handleImageUpload = async () => {
    if (!profileFile) return profilePic;
    const formData = new FormData();
    formData.append("file", profileFile);
    formData.append("upload_preset", "skillforge_preset");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/quizcloud/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("❌ Image upload failed!");
      return profilePic;
    }
  };

  // ✅ Update profile
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const uploadedPicUrl = await handleImageUpload();

      const res = await API.put("/profile/update", {
        name,
        profilePic: uploadedPicUrl,
      });

      setUser(res.data.user);
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4 flex justify-center">
      <Toaster position="top-center" />
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          My Profile
        </h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={
                profileFile
                  ? URL.createObjectURL(profileFile)
                  : profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Editable Name */}
        <label className="block text-gray-700 dark:text-gray-300 mb-1">
          Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Email */}
        <label className="block text-gray-700 dark:text-gray-300 mb-1">
          Email:
        </label>
        <p className="w-full p-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200">
          {user.email}
        </p>

        {/* Career Stats */}
        <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-3">
          {/* Resume Score */}
          <div>
            <p className="text-sm font-medium text-blue-500 mb-1">
              Resume Score: {user.resumeScore}%
            </p>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${user.resumeScore}%` }}
              ></div>
            </div>
          </div>

          {/* Roadmap Progress */}
          <div>
            <p className="text-sm font-medium text-green-500 mb-1">
              Roadmap Progress: {user.roadmapProgress}%
            </p>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${user.roadmapProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Interests */}
          <p className="text-sm">
            <strong className="text-purple-500">Interests:</strong>{" "}
            {user.interests?.length > 0
              ? user.interests.join(", ")
              : "Not added yet"}
          </p>

          {/* 🔥 Streaks */}
          <div className="flex gap-3 mt-3">
            <span className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 dark:bg-purple-500 text-orange-600 dark:text-white rounded-full shadow">
              <Flame size={16} /> Current Streak: {user.currentStreak || 0}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 dark:bg-green-500 text-yellow-700 dark:text-white rounded-full shadow">
              <Crown size={16} /> Longest Streak: {user.longestStreak || 0}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => navigate("/reset-password")}
            className="flex items-center justify-center gap-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Lock size={18} /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
