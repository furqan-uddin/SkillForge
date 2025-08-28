// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Camera,
  Save,
  Lock,
  Plus,
  X,
  Award,
  User,
} from "lucide-react";
import API from "../utils/axiosInstance";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newInterest, setNewInterest] = useState("");
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me");
        setUser(res.data);
        setName(res.data.name);
        setProfilePic(res.data.profilePic || "");
        setInterests(res.data.interests || []);
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

  // ✅ Update profile (name + picture)
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

  // ✅ Save Interests
  const handleAddInterest = async () => {
    if (!newInterest.trim()) return;
    try {
      const updated = [...interests, newInterest.trim()];
      const res = await API.post("/auth/save-interests", { interests: updated });
      setInterests(res.data.interests);
      setNewInterest("");
      toast.success("✅ Interest added");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to save interest");
    }
  };

  const handleRemoveInterest = async (interest) => {
    try {
      const updated = interests.filter((i) => i !== interest);
      const res = await API.post("/auth/save-interests", { interests: updated });
      setInterests(res.data.interests);
      toast.success("❌ Interest removed");
    } catch (err) {
      toast.error("Failed to update interests");
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white py-12 px-6 flex justify-center">
      <Toaster position="top-center" />
      <div className="max-w-3xl w-full space-y-10">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
        >
          My Profile
        </motion.h1>

        {/* Profile Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl rounded-2xl p-6 flex flex-col items-center gap-6 border border-gray-200/40 dark:border-gray-700/40">
          <div className="relative group">
            <img
              src={
                profileFile
                  ? URL.createObjectURL(profileFile)
                  : profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-lg"
            />
            {/* Hover Overlay */}
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition opacity-90 group-hover:opacity-100">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-center p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>

        {/* Career Interests */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-600 mb-4">
            <User className="w-5 h-5" /> Career Interests
          </h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {interests.length > 0 ? (
              interests.map((interest, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 dark:from-indigo-600 dark:to-blue-600 dark:text-white rounded-full text-sm shadow-md flex items-center gap-2"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </motion.span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">
                No interests added yet. Start building your learning journey!
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add new interest..."
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            />
            <button
              onClick={handleAddInterest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-yellow-600 mb-4">
            <Award className="w-5 h-5" /> Achievements
          </h2>
          {user.badges?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-600 text-yellow-700 dark:text-white text-sm shadow"
                >
                  <Award size={14} /> {badge}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No badges earned yet. Keep progressing to unlock achievements! 🌟
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save size={18} />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => navigate("/reset-password")}
            className="flex items-center justify-center gap-2 w-full sm:w-1/2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Lock size={18} /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
