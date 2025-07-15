// src/pages/Error.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import errorImage from "../assets/error.png"; // adjust if path differs
import { Button } from "./ui/button"; // if using shadcn/ui

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
      <img
        src={errorImage}
        alt="Page Not Found"
        className="w-80 h-auto mb-6 animate-bounce"
      />
      <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate("/")}>Go Home</Button>
    </div>
  );
}
