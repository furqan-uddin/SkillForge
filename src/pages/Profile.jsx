// SKILLFORGE/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Camera, Save, Lock, Plus, X, Award } from "lucide-react";
import API from "../utils/axiosInstance";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4 flex justify-center">
      <Toaster position="top-center" />
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
          My Profile
        </h1>

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4">
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

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>

        {/* Interests */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-inner">
          <h2 className="text-lg font-semibold mb-3 text-purple-600">
            Career Interests
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.length > 0 ? (
              interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white rounded-full text-sm flex items-center gap-2"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No interests added yet.</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add new interest..."
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
            <button
              onClick={handleAddInterest}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-inner">
          <h2 className="text-lg font-semibold mb-3 text-yellow-600">
            Achievements
          </h2>
          {user.badges?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-600 text-yellow-700 dark:text-white text-sm shadow"
                >
                  <Award size={14} /> {badge}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No badges earned yet.</p>
          )}
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
