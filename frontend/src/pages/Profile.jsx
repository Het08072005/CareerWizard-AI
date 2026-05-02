import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { enhanceText } from "../api/profile";
import api from "../api/axiosClient";
import { UserCheckIcon, BriefcaseIcon, CheckIcon, DocumentIcon, XIcon, ZapIcon } from "../components/ui/Icons";

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
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [isEnhancing, setIsEnhancing] = useState({ bio: false, experience: false, skills: false });
  const [isDragOver, setIsDragOver] = useState(false);

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
      setMessageType("error");
      setResumeFile(null);
      e.target.value = null;
    } else if (file) {
      setResumeFile(file);
      setMessage(`Attached: ${file.name}`);
      setMessageType("success");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setMessage("File exceeds 10MB limit.");
      setMessageType("error");
      setResumeFile(null);
    } else if (file) {
      setResumeFile(file);
      setMessage(`Attached: ${file.name}`);
      setMessageType("success");
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
      setMessageType("success");

      setTimeout(() => navigate("/overview"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Error saving profile. Please try again.");
      setMessageType("error");
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
      setMessage("Enhancement failed due to server error.");
      setMessageType("error");
    } finally {
      setIsEnhancing(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-28 sm:p-8 sm:pt-32 relative overflow-hidden text-slate-200">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">

        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 inline-flex items-center">
            <UserCheckIcon size={36} className="text-indigo-400 mr-4" />
            My Career Profile
          </h1>
          <p className="text-lg text-slate-400 font-medium">
            Update your details and goals to fine-tune the AI's personalized career analysis and recommendations.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-800">

          {/* Section: Personal Details */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mr-4 text-sm font-bold">1</span>
              Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-[0.1em]">Full Name</label>
                <input value={formData.name} disabled className="w-full p-4 border border-slate-700/50 rounded-2xl bg-slate-800/50 text-slate-500 cursor-not-allowed font-medium shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-[0.1em]">Email</label>
                <input value={formData.email} disabled className="w-full p-4 border border-slate-700/50 rounded-2xl bg-slate-800/50 text-slate-500 cursor-not-allowed font-medium shadow-inner" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-[0.1em]">Current Location</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="San Francisco, CA or Remote" className="w-full p-4 border border-slate-700 rounded-2xl bg-slate-900/50 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 outline-none transition-all font-medium text-white shadow-inner placeholder-slate-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-[0.1em]">LinkedIn Profile URL</label>
                <input name="linkedinURL" value={formData.linkedinURL} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full p-4 border border-slate-700 rounded-2xl bg-slate-900/50 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 outline-none transition-all font-medium text-white shadow-inner placeholder-slate-600" />
              </div>
            </div>
          </div>

          <hr className="border-slate-800 mb-12" />

          {/* Section: Career Goals */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mr-4 text-sm font-bold">2</span>
              Target Career Goals
            </h2>

            <div className="flex space-x-3 mb-6">
              <div className="relative flex-1 group">
                <BriefcaseIcon className="absolute left-4 top-[18px] text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                  type="text"
                  value={newRoleInput}
                  onChange={handleRoleInputChange}
                  onKeyDown={e => e.key === "Enter" && handleAddRole(e)}
                  placeholder="e.g., Full Stack Engineer"
                  className="w-full pl-12 p-4 border border-slate-700 rounded-2xl bg-slate-900/50 focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 outline-none transition-all font-medium text-white shadow-inner placeholder-slate-600"
                />
              </div>
              <button type="button" onClick={handleAddRole} className="bg-slate-800 border border-slate-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-slate-700 hover:border-purple-500/50 transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(168,85,247,0.2)]">
                Add Role
              </button>
            </div>

            {/* Chips container */}
            <div className="min-h-[3rem] p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-wrap gap-2 items-center shadow-inner">
              {targetRoles.length === 0 ? (
                <p className="text-slate-500 text-sm font-medium italic w-full text-center">No target roles added yet.</p>
              ) : (
                targetRoles.map(role => (
                  <span key={role} className="inline-flex items-center bg-slate-800 border border-purple-500/30 text-purple-300 font-bold px-4 py-2 rounded-xl shadow-[0_0_10px_rgba(168,85,247,0.1)] animate-scale-in">
                    {role}
                    <button type="button" onClick={() => handleRemoveRole(role)} className="ml-3 text-purple-400/50 hover:text-purple-400 transition-colors">
                      <XIcon size={16} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <hr className="border-slate-800 mb-12" />

          {/* Section: Experience & Skills */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mr-4 text-sm font-bold">3</span>
              Experience & Skills
            </h2>

            {[
              { id: "bio", label: "Professional Summary", placeholder: "A brief summary of who you are..." },
              { id: "experience", label: "Key Experience", placeholder: "Bullet points of your major career milestones..." },
              { id: "skills", label: "Technical Skills", placeholder: "React, Node.js, Python, AWS..." }
            ].map(field => (
              <div key={field.id} className="mb-8 relative group">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-[0.1em]">
                  {field.label}
                </label>
                <div className="relative rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-400/50 border border-slate-700 bg-slate-900/50 transition-all shadow-inner">
                  <textarea
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    rows={5}
                    placeholder={field.placeholder}
                    className="w-full p-5 resize-none outline-none font-medium leading-relaxed bg-transparent text-white placeholder-slate-600"
                  />
                  <div className="absolute right-4 bottom-4 transition-opacity opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleEnhance(field.id)}
                      disabled={isEnhancing[field.id]}
                      className={`flex items-center space-x-2 px-5 py-2 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all border ${isEnhancing[field.id] ? "bg-indigo-600 cursor-wait border-indigo-500" : "bg-slate-800 border-indigo-500/30 hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-0.5"
                        }`}
                    >
                      <ZapIcon size={16} />
                      <span>{isEnhancing[field.id] ? "Enhancing..." : "Perfect with AI"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-slate-800 mb-12" />

          {/* Section: Resume Upload */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mr-4 text-sm font-bold">4</span>
              Resume Upload
            </h2>

            <label
              className={`flex flex-col items-center justify-center border-2 border-dashed ${isDragOver ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50'} rounded-3xl p-10 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 relative overflow-hidden group`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              {resumeFile ? (
                <div className="flex flex-col items-center text-indigo-400 z-10 animate-scale-in">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl shadow-md border border-slate-700 flex items-center justify-center mb-4">
                    <DocumentIcon size={32} />
                  </div>
                  <span className="font-bold text-lg text-white">{resumeFile.name}</span>
                  <span className="text-sm text-indigo-400/70 mt-2 font-medium">Click or drag a new file to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center z-10 transform group-hover:-translate-y-2 transition-transform">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl shadow-sm border border-slate-700 flex items-center justify-center mb-4 text-slate-500 group-hover:text-indigo-400 transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <span className="font-bold text-white text-lg">Click to browse or drag & drop</span>
                  <span className="text-sm text-slate-500 mt-2 font-medium">PDF, DOC up to 10MB</span>
                </div>
              )}
              <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
            </label>
          </div>

          {/* Submit footer */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">

            <div className={`flex items-center font-bold text-sm px-4 py-3 rounded-xl opacity-0 transition-opacity duration-300 border ${message ? 'opacity-100' : ''} ${messageType === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {message && messageType === 'success' && <CheckIcon size={16} className="mr-2" />}
              {message && messageType === 'error' && <XIcon size={16} className="mr-2" />}
              {message}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full sm:w-auto flex items-center justify-center font-black uppercase tracking-wider text-sm py-4 px-10 rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] text-white hover:-translate-y-1 ${isSaving ? "bg-indigo-500/50 cursor-wait border border-indigo-500/50" : "bg-indigo-600 hover:bg-indigo-500 border border-transparent"
                }`}
            >
              {isSaving ? "Saving..." : "Save Profile & Re-Analyze"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
