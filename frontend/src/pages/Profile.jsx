import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext";
import { enhanceText } from "../api/profile";
import api from "../api/axiosClient";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    linkedinURL: "",
    experience: "",
    skills: "",
  });

  const [targetRoles, setTargetRoles] = useState([]);
  const [newRoleInput, setNewRoleInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEnhancing, setIsEnhancing] = useState({ bio: false, experience: false, skills: false });

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setFormData({
          name: profile.name || user?.name || "",
          email: profile.email || user?.email || "",
          location: profile.location || "",
          bio: profile.bio || "",
          linkedinURL: profile.linkedin_url || profile.linkedinURL || "",
          experience: profile.experience || "",
          skills: profile.skills || "",
        });
        setTargetRoles(profile.target_roles || []);
      } catch (e) {
        console.error("Error parsing localStorage profile:", e);
      }
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: "",
        bio: "",
        linkedinURL: "",
        experience: "",
        skills: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleInputChange = (e) => setNewRoleInput(e.target.value);
  const handleAddRole = (e) => {
    e.preventDefault();
    const role = newRoleInput.trim();
    if (role && !targetRoles.includes(role)) {
      setTargetRoles([...targetRoles, role]);
      setNewRoleInput("");
    }
  };
  const handleRemoveRole = (roleToRemove) => {
    setTargetRoles(targetRoles.filter(r => r !== roleToRemove));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setMessage("File exceeds 10MB limit.");
      setResumeFile(null);
      e.target.value = null;
    } else {
      setResumeFile(file);
      setMessage(file ? `Selected: ${file.name}` : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("location", formData.location || "");
      payload.append("bio", formData.bio || "");
      payload.append("experience", formData.experience || "");
      payload.append("skills", formData.skills || "");
      payload.append("linkedin_url", formData.linkedinURL || "");
      payload.append("target_roles", JSON.stringify(targetRoles || []));
      if (resumeFile) payload.append("resume", resumeFile);

      await api.put("/profile/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const profileData = {
        name: formData.name,
        email: formData.email,
        location: formData.location,
        bio: formData.bio,
        linkedin_url: formData.linkedinURL,
        experience: formData.experience,
        skills: formData.skills,
        target_roles: targetRoles,
      };
      localStorage.setItem("profile", JSON.stringify(profileData));

      setMessage("Profile saved successfully!");

      // Navigate to /overview after save
      navigate("/overview");
    } catch (err) {
      console.error(err);
      setMessage("Error saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnhance = async (field) => {
    try {
      setIsEnhancing(prev => ({ ...prev, [field]: true }));
      const improved = await enhanceText(formData[field], field);
      setFormData(prev => ({ ...prev, [field]: improved }));
    } catch (err) {
      console.error(err);
      alert("Enhancement failed");
    } finally {
      setIsEnhancing(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-violet-800 mb-2">My Career Profile</h1>
        <p className="text-gray-600 mb-8">
          Update your details and goals to fine-tune the AI's career analysis and recommendations.
        </p>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-violet-100">
          {/* Personal Details */}
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={formData.name} disabled className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={formData.email} disabled className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="San Francisco, CA or Remote" className="w-full p-3 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile URL (Optional)</label>
            <input name="linkedinURL" value={formData.linkedinURL} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full p-3 border rounded-lg" />
          </div>

          {/* Career Goals */}
          <h2 className="text-xl font-bold text-gray-800 my-6 pb-2 border-b border-gray-200">Career Goals (Multi-Select)</h2>
          <div className="mb-4 flex space-x-2">
            <input
              type="text"
              value={newRoleInput}
              onChange={handleRoleInputChange}
              onKeyDown={e => e.key === "Enter" && handleAddRole(e)}
              placeholder="e.g., Data Scientist"
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
            <button type="button" onClick={handleAddRole} className="bg-violet-600 text-white p-3 px-8 rounded-lg shadow-md hover:bg-violet-700 transition">Add</button>
          </div>
          <div className="min-h-10 p-2 bg-violet-50 rounded-lg border border-violet-200 mb-6">
            {targetRoles.length === 0
              ? <p className="text-gray-500 text-sm italic py-1 px-2">No target roles added yet.</p>
              : targetRoles.map(role => (
                  <span key={role} className="inline-flex items-center bg-violet-100 text-violet-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 shadow-sm">
                    {role}
                    <button type="button" onClick={() => handleRemoveRole(role)} className="ml-2 h-4 w-4 flex items-center justify-center text-violet-500 hover:text-violet-900 transition">×</button>
                  </span>
                ))
            }
          </div>

          {/* Experience & Skills */}
          <h2 className="text-xl font-bold text-gray-800 my-6 pb-2 border-b border-gray-200">Experience & Skills</h2>
          {["bio", "experience", "skills"].map(field => (
            <div key={field} className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === "bio" ? "Professional Bio/Summary" : field === "experience" ? "Experience Summary" : "Technical Skills"}
              </label>
              <textarea
                name={field}
                value={formData[field]}
                onChange={handleChange}
                rows={4}
                placeholder={`Write your ${field}`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 resize-none pr-28 transition"
              />
              <button
                type="button"
                onClick={() => handleEnhance(field)}
                disabled={isEnhancing[field]}
                className="absolute right-2 bottom-3 px-4 py-1 font-semibold text-sm text-white bg-violet-600 rounded-full flex items-center space-x-1 transition"
              >
                <span>{isEnhancing[field] ? "Enhancing..." : "Write with AI"}</span>
              </button>
            </div>
          ))}

          {/* Resume Upload */}
          <h2 className="text-xl font-bold text-gray-800 my-6 pb-2 border-b border-gray-200">Resume Upload (Max 10MB)</h2>
          <div className="mb-6 border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300">
            <label className="cursor-pointer flex flex-col items-center">
              <span className="font-medium text-gray-700">Click to upload or drag & drop your resume</span>
              <span className="text-sm text-gray-500 mt-1">{resumeFile ? `Selected: ${resumeFile.name}` : "No file selected"}</span>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Submit */}
          <div className="mt-8 pt-4 border-t flex flex-col sm:flex-row justify-between items-center">
            <div className={`text-sm font-medium transition duration-500 ${message.includes("successfully") ? "text-green-600" : message ? "text-red-600" : "text-transparent"}`}>
              {message}
            </div>
            <button type="submit" disabled={isSaving} className={`flex items-center justify-center font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-lg w-full sm:w-auto ${isSaving ? "bg-violet-400 cursor-wait" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
              {isSaving ? "Saving Profile..." : "Save and Re-Analyze Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


