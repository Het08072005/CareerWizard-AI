import { useState } from "react";
import { getRecommendations } from "../services/recommendationService";
import JobCard from "../components/JobCard"; // Ensure your JobCard component is styled nicely!

export default function Dashboard() {
  const [skill, setSkill] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!skill.trim()) return; // Don't search if the input is empty

    setIsLoading(true);
    setHasSearched(true);
    setJobs([]); // Clear previous results

    try {
      // Assuming getRecommendations handles the API call
      const res = await getRecommendations(skill); 
      setJobs(res.data.jobs || []); // Handle potential empty array
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header Section */}
        <h2 className="text-3xl font-extrabold text-violet-800 mb-2">
          Job Recommendations
        </h2>
        <p className="text-gray-500 mb-8">
          Enter your key skills or role to get personalized job suggestions.
        </p>

        {/* Interactive Search Bar */}
        <div className="flex mb-10 shadow-lg rounded-4xl overflow-hidden border border-violet-300">
          <input
            type="text"
            placeholder="e.g., React, Python, Data Science"
            className="grow p-4 pl-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-150"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => { // Allows searching with Enter key
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-violet-600 text-white px-6 py-4 font-semibold hover:bg-violet-700 transition duration-300 disabled:opacity-80"
            disabled={isLoading || !skill.trim()}
          >
            {isLoading ? (
                // Simple loading spinner
                <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Searching...
                </div>
            ) : (
                'Get Jobs'
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="mt-8">
          
          {isLoading && (
              <p className="text-center text-violet-500 font-medium">Loading recommendations...</p>
          )}

          {!isLoading && hasSearched && jobs.length === 0 && (
            <div className="text-center p-8 bg-white rounded-xl shadow-md border border-gray-100">
                <p className="text-gray-600 font-medium">No job recommendations found for "{skill}". Try different keywords!</p>
            </div>
          )}

          {!isLoading && jobs.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{jobs.length} Recommendations Found</h3>
              <div className="space-y-4">
                {jobs.map((job, idx) => (
                  // Assuming JobCard takes a title prop and renders an individual result
                  <JobCard key={idx} title={job} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}