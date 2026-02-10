// *********************
// IN DEVELOPMENT
// *********************

import React from "react";
import { FaArrowUp } from "react-icons/fa6";


const StatsElement = () => {
  return (
    <div className="w-80 h-32 bg-brand-secondary text-white flex flex-col justify-center items-center rounded-md max-md:w-full shadow-sm">
      <h4 className="text-xl text-white font-serif font-semibold">New Products</h4>
      <p className="text-2xl font-bold text-brand-accent">2,230</p>
      <p className="text-brand-accent flex gap-x-1 items-center"><FaArrowUp />12.5% Since last month</p>
    </div>
  );
};

export default StatsElement;
