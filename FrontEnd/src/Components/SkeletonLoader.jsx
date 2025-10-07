import React from "react";

// Usage: <SkeletonLoader lines={3} avatar />
const SkeletonLoader = ({ lines = 3, avatar = false, className = "" }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {avatar && (
      <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
    )}
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-300 rounded w-full"
        style={{ width: `${90 - i * 10}%` }}
      ></div>
    ))}
  </div>
);

export default SkeletonLoader;
