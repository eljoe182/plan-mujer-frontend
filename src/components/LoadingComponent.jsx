import React from "react";

const LoadingComponent = ({ text }) => {
  return (
    <div className="my-20">
      <div className="spinner"></div>
      <h4 className="text-center">{text}</h4>
    </div>
  );
};

export default LoadingComponent;
