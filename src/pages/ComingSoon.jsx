import React from "react";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="relative h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Link
        to="/login"
        className="absolute top-6 left-6 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Back to Login
      </Link>
      <h1 className="text-4xl font-bold text-gray-700">Coming Soon</h1>
    </div>
  );
}
