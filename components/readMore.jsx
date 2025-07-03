"use client";
import { useState } from "react";

const ReadMore = ({ text, maxLength }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <p className=" text-slate-200 leading-relaxed text-sm">
      {isReadMore ? `${text.slice(0, maxLength)}...` : text}
      <span
        className="text-gray-100 text-xl font-medium italic cursor-pointer"
        onClick={toggleReadMore}
      >
        {isReadMore ? " read more" : "less"}
      </span>
    </p>
  );
};

export default ReadMore;
