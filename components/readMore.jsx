"use client";
import { useState } from "react";

const ReadMore = ({ text, maxLength, textSize }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <p className={` text-slate-200 leading-relaxed ${textSize}`}>
      {isReadMore ? `${text.slice(0, maxLength)}...` : text}
      <span
        className="text-gray-100 text-sm font-medium italic cursor-pointer"
        onClick={toggleReadMore}
      >
        {isReadMore ? " read more" : "..less"}
      </span>
    </p>
  );
};

export default ReadMore;
