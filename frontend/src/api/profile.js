import api from "./axiosClient";

// GET PROFILE
export const getProfile = async () => {
  const response = await api.get("/profile/");
  return response.data; 
};

// UPDATE PROFILE
export const updateProfile = async (profileData) => {
  const formData = new FormData();

  Object.entries(profileData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "targetRoles") {
      formData.append(key, JSON.stringify(value));
    } else if (key === "resume" && value) {
      formData.append("resume", value);
    } else {
      formData.append(key, value);
    }
  });

  const response = await api.put("/profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  
  return response.data.profile;
};

// AI TEXT ENHANCER 
export const enhanceText = async (text, category) => {
  if (!["bio", "experience", "skills"].includes(category)) {
    throw new Error("Invalid category. Must be 'bio', 'experience', or 'skills'.");
  }

  const response = await api.post("/profile/ai", null, {
    params: { text, category },
  });

  return response.data.improved;
};


//  ROADMAP 

export const getRoadmap = async (domain, months) => {
  console.log("🔶 Sending request to backend...");
  const response = await api.get("/roadmap/", {
    params: { domain, months }
  });
  console.log("🔷 Backend response:", response.data);
  return response.data;
};