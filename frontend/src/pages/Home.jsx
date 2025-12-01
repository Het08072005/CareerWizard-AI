import { Link } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContext"; // import AuthContext

// Helper component for the feature cards (re-used for consistency)
const FeatureCard = ({ title, description, icon: Icon, iconColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 
                transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl">
        {/* Icon Placeholder */}
        <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center 
                     bg-white shadow-xl ${iconColor.replace('text-', 'shadow-')}/40`}>
            {/* The actual icon will go here. Using a simple colored circle as a placeholder. */}
            {Icon ? <Icon className={`w-6 h-6 ${iconColor}`} /> : <div className={`w-6 h-6 rounded-full ${iconColor.replace('text-', 'bg-')}`}></div>}
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);


// Placeholder Icons for Feature Cards (you can replace these with actual SVG icons from libraries like Heroicons)
const IconAIPowered = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-3-4m6-6l4-2m3 5l2-2M10 20l-2-2m0 0l-4-4m4-4l4-2m3 5l2-2m-3 5l-2-2M9 5l-2-2m2 2l2-2m-2 2l-2-2m2-2l2-2m-2-2l-2-2m-2-2l-2-2m-2-2l-2-2m-2-2l-2-2M12 4v16m0-4h4m-4 0H8m6 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconPersonalized = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292V15.5a4 4 0 110 0v-6.854a4 4 0 010-5.292zM12 10a2 2 0 100 4 2 2 0 000-4z" /></svg>;
const IconEasyToUse = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>;


export default function Home() {
   const { isLoggedIn } = useContext(AuthContext); // get login state
  return (
    <div className="min-h-screen  bg-gray-50 flex flex-col">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center grow text-center px-6 py-20 bg-gradient-to-r from-gray-50 to-gray-100  ">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          AI-Driven Job Match <span className="text-violet-600">& Career Prep Hub</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-xl">
          Find jobs that match your skills, plan your career roadmap, and prep for interviews with AI.
        </p>
        <div className="space-x-4">
          <Link
            to={isLoggedIn ? "/overview" : "/signup"}
            className="bg-violet-600 text-white px-8 py-3 rounded-lg text-lg font-semibold 
                       hover:bg-violet-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            to="/signup" // Navigate to a public job listing page or dashboard if user is logged in
            className="bg-white text-violet-600 px-8 py-3 rounded-lg text-lg font-semibold 
                       border-2 border-violet-600 hover:bg-violet-50 transition duration-300"
          >
            Explore Jobs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="AI Powered"
            description="Smart job recommendations tailored for you."
            icon={IconAIPowered}
            iconColor="text-violet-600"
          />
          <FeatureCard 
            title="Personalized"
            description="Jobs matching your skills and interests."
            icon={IconPersonalized}
            iconColor="text-pink-500"
          />
          <FeatureCard 
            title="Easy to Use"
            description="Simple interface to explore and discover new opportunities."
            icon={IconEasyToUse}
            iconColor="text-teal-500"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-violet-600 text-white text-center p-6">
        © {new Date().getFullYear()} AI Career Platform. All rights reserved.
      </footer>
    </div>
  );
}