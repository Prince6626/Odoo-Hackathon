import React from "react";

const Test = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full text-5xl h-screen">
      <div className="flex justify-between space-x-4 mb-6">
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
        <span className="loading loading-ring loading-xl"></span>
      </div>
      <p className="text-lg text-gray-600">Please Wait... Refresh again</p>
    </div>
  );
};

export default Test;
