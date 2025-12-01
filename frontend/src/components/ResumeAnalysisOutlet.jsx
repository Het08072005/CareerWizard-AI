import React, { useState, useRef, useEffect } from "react";
import api from "../api/axiosClient";

// --- Reusable Feedback Item ---
const FeedbackItem = ({ text, type }) => {
  const isStrength = type === "strength";
  const iconClass = isStrength ? "text-green-500" : "text-orange-500";

  return (
    <li className="flex items-start text-gray-700 mb-2">
      <span className="mr-2 mt-1 flex">
        {isStrength ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${iconClass} fill-current`}
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${iconClass} fill-current`}
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.328A1 1 0 019 3h2a1 1 0 01.743.328l6 6a1 1 0 01.077 1.346l-8.5 8.5a1 1 0 01-1.346.077l-6-6a1 1 0 01-.077-1.346l6-6zM10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
      <span>{text}</span>
    </li>
  );
};

// --- Result View Component ---
const ResultView = ({ result }) => {
  const { ats_score, strengths, improvements } = result;
  const scoreColor = "bg-purple-400";

  return (
    <div className="space-y-8 mt-10">
      {/* ATS Score */}
      <div className="border-b pb-4 border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold text-gray-800">ATS Score</h4>
          <div className="flex items-center text-purple-400 font-bold text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            {ats_score}%
          </div>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`${scoreColor} h-full transition-all duration-700`}
            style={{ width: `${ats_score}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {ats_score >= 80
            ? "Excellent! Your resume is optimized."
            : "Good, but there's room for improvement."}
        </p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h5 className="text-lg font-semibold mb-4 flex items-center text-green-600">
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.2l-3.5-3.5a.996.996 0 011.41-1.41L9 13.39l6.09-6.09a.996.996 0 111.41 1.41l-6.75 6.75a.996.996 0 01-1.41 0z" />
              </svg>
            </span>
            Strengths
          </h5>
          <ul>
            {strengths.map((text, index) => (
              <FeedbackItem key={index} text={text} type="strength" />
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h5 className="text-lg font-semibold mb-4 flex items-center text-orange-600">
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </span>
            Improvements Needed
          </h5>
          <ul>
            {improvements.map((text, index) => (
              <FeedbackItem key={index} text={text} type="improvement" />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const ResumeAnalysisOutlet = () => {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState("");

  // Load saved result, pasted text, and file from localStorage
  useEffect(() => {
    const savedResult = localStorage.getItem("resumeResult");
    const savedText = localStorage.getItem("resumeText");
    const savedFile = localStorage.getItem("resumeFile");

    if (savedResult) {
      setResult(JSON.parse(savedResult));
      setShowResults(true);
    }

    if (savedText) setPastedText(savedText);

    if (savedFile) {
      const { name, type, data } = JSON.parse(savedFile);
      const blob = b64toBlob(data, type);
      const file = new File([blob], name, { type });
      setSelectedFile(file);
    }
  }, []);

  // Helper: Convert Base64 to Blob
  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    // --- START: Added logic to clear results on new file selection ---
    setResult(null);
    setShowResults(false);
    localStorage.removeItem("resumeResult");
    // --- END: Added logic to clear results on new file selection ---

    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPastedText("");
      // Save file in localStorage as Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        localStorage.setItem(
          "resumeFile",
          JSON.stringify({ name: file.name, type: file.type, data: base64Data })
        );
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      localStorage.removeItem("resumeFile");
    }
  };

  const handleTextChange = (e) => {
    // --- START: Added logic to clear results on text change ---
    setResult(null);
    setShowResults(false);
    localStorage.removeItem("resumeResult");
    // --- END: Added logic to clear results on text change ---
    
    setPastedText(e.target.value);
    localStorage.setItem("resumeText", e.target.value);
    if (e.target.value.length > 0) {
      setSelectedFile(null);
      fileInputRef.current.value = null;
      localStorage.removeItem("resumeFile");
    }
  };

  const isAnalyzeEnabled = selectedFile || pastedText.length > 0;

  const handleAnalyzeClick = async () => {
    if (!isAnalyzeEnabled) return;
    setLoading(true);
    setError("");
    setShowResults(false);

    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      if (pastedText) formData.append("text", pastedText);

      const response = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
      setShowResults(true);
      localStorage.setItem("resumeResult", JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setShowResults(false);
    setSelectedFile(null);
    setPastedText("");
    fileInputRef.current.value = null;
    localStorage.removeItem("resumeResult");
    localStorage.removeItem("resumeText");
    localStorage.removeItem("resumeFile");
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        Resume ATS Analysis
      </h3>
      <p className="text-gray-600 mb-8">
        Upload your resume or paste the text to get an AI-powered ATS score and
        detailed feedback.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Upload Resume (PDF/DOC)
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 flex flex-col justify-center items-center min-h-[250px]"
            onClick={handleUploadClick}
          >
            {selectedFile ? (
              <div className="text-purple-400 font-semibold text-lg">
                ✅ {selectedFile.name} loaded
                <p className="text-sm text-gray-500 mt-1">Click to change file</p>
              </div>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <p className="text-gray-700 font-medium">Click to upload</p>
                <p className="text-sm text-gray-500">PDF, DOC up to 10MB</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>

        {/* Paste */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Or Paste Resume Text
          </label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-purple-400 focus:border-purple-400 resize-none placeholder-gray-400 text-gray-800"
            rows={10}
            placeholder="Paste your resume content here..."
            style={{ minHeight: "250px" }}
            value={pastedText}
            onChange={handleTextChange}
          ></textarea>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center gap-4">
        <button
          className={`bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-md ${
            isAnalyzeEnabled
              ? "hover:bg-purple-500"
              : "opacity-60 cursor-not-allowed"
          }`}
          onClick={handleAnalyzeClick}
          disabled={!isAnalyzeEnabled || loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        <button
          className="bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-md hover:bg-gray-400"
          onClick={handleClear}
        >
          Clear
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Results */}
      {showResults && result && <ResultView result={result} />}
    </div>
  );
};

export default ResumeAnalysisOutlet;