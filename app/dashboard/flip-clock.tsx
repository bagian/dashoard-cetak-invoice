"use client";

import {useState, useEffect} from "react";

const FlipUnit = ({value, label}: {value: string; label: string}) => (
  <div className="flex flex-col items-center">
    <div className="relative bg-[#1C1C1C] text-[#B6F09C] px-2 py-1 rounded-lg font-black text-xl shadow-inner overflow-hidden min-w-[45px] text-center border border-white/5">
      <span
        key={value}
        className="animate-in slide-in-from-top-full duration-300 inline-block"
      >
        {value}
      </span>
    </div>
    <span className="text-[9px] font-black uppercase text-gray-400 mt-1 tracking-tighter">
      {label}
    </span>
  </div>
);

export default function FlipClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUnit = (unit: number) => String(unit).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-2xl border border-gray-100 shadow-sm">
      <FlipUnit value={formatUnit(time.getHours())} label="Hrs" />
      <span className="text-[#1C1C1C] font-black mb-4">:</span>
      <FlipUnit value={formatUnit(time.getMinutes())} label="Min" />
      <span className="text-[#1C1C1C] font-black mb-4">:</span>
      <FlipUnit value={formatUnit(time.getSeconds())} label="Sec" />
    </div>
  );
}
