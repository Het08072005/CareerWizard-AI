import React, { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "./JobCard";
import JobFilter from "./JobFilter";

const JobMatchOutlet = () => {
  const [jobs, setJobs] = useState([]);
  const [originalJobs, setOriginalJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    jobType: "All",
    skills: []
  });

  // Load all jobs initially
  useEffect(() => {
    const loadAllJobs = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/jobs/all");

        const formatted = res.data.map(j => ({
          ...j,
          match: null, // No match score until resume is uploaded
          requiredSkills: j.required_skills
        }));

        setOriginalJobs(formatted);
        setJobs(formatted);
      } catch (err) {
        setError("Failed to load jobs.");
      }
    };

    loadAllJobs();
  }, []);

  // Resume upload → fetch matched jobs
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResume(file);
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/jobs/match-resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const result = response.data.map((item) => ({
        ...item.job,
        match: item.match,
        requiredSkills: item.job.required_skills
      }));

      // Filter only >= 60% matches
      const filteredResult = result.filter((job) => job.match >= 60);

      setOriginalJobs(filteredResult);
      setJobs(filteredResult);

    } catch (err) {
      setError("Failed to analyze resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters locally
  useEffect(() => {
    let temp = [...originalJobs];

    if (filters.search) {
      temp = temp.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.jobType !== "All") {
      temp = temp.filter((job) => job.type === filters.jobType);
    }

    if (filters.skills.length > 0) {
      temp = temp.filter((job) =>
        filters.skills.every((s) => job.requiredSkills.includes(s))
      );
    }

    setJobs(temp);
  }, [filters, originalJobs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Resume Upload */}
      <div className="bg-white p-5 rounded-lg shadow ">
        <h2 className="text-lg font-semibold mb-2">Upload Resume for Matching</h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
          className="border border-dashed border-gray-300 p-2 rounded w-full"
        />

        {resume && (
          <p className="text-sm text-gray-600 mt-2">
            Uploaded: {resume.name}
          </p>
        )}
      </div>

      {/* Filters */}
      <JobFilter filters={filters} onFilterChange={handleFilterChange} />

      {loading && <div className="p-4">Analyzing resume & matching jobs...</div>}
      {error && <div className="p-4 text-red-500 bg-red-100 rounded">{error}</div>}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {jobs.length} Matched Jobs Found
          </h2>

          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-md text-center text-gray-500">
              No jobs found. Upload a resume or adjust filters.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobMatchOutlet;
