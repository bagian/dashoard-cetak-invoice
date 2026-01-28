"use client";

import {useEffect, useState} from "react";

export default function AnimatedProgressBar({progress}: {progress: number}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Animasi sliding width (agar memanjang halus dari 0%)
    const timer = setTimeout(() => {
      setWidth(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
      <div
        className={`
          h-full rounded-full 
          transition-all duration-1000 ease-out 
          progress-striped animate-stripes
          ${progress === 100 ? "bg-green-500" : "bg-[#f75454]"}
        `}
        style={{width: `${width}%`}}
      ></div>
    </div>
  );
}
