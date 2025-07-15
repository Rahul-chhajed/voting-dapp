// src/pages/Error.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import errorImage from "../assets/error.png"; // adjust path if needed
import { Button } from "@/components/ui/button"; // shadcn/ui button

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1b26] px-4 text-center">
      <img
        src={errorImage}
        alt="Page Not Found"
        className="w-72 h-auto mb-6 animate-bounce drop-shadow-lg"
      />
      <h1 className="text-5xl font-extrabold text-purple-400 mb-4">404</h1>
      <p className="text-lg text-gray-300 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Button
        className="bg-purple-600 hover:bg-purple-700 text-white"
        onClick={() => navigate("/")}
      >
        Go Back Home
      </Button>
    </div>
  );
}
