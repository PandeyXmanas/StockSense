"use client";

import { useEffect, useState } from "react";

export default function PassengerInterface() {
  // 120-second tabular countdown
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-offwhite text-charcoal max-w-md mx-auto border-x-2 border-charcoal">
      
      {/* Header */}
      <header className="border-b-2 border-charcoal p-4 bg-charcoal text-offwhite">
        <h1 className="font-mono text-xl font-bold uppercase tracking-widest">
          Gantavya Pass
        </h1>
        <p className="font-mono text-sm opacity-80 uppercase mt-1">
          LKO <span className="mx-2">→</span> BASTI / GKP
        </p>
      </header>

      {/* COMPONENT A: Arrival Board */}
      <section className="p-4 border-b-2 border-charcoal">
        <h2 className="font-bold uppercase tracking-wider mb-4">Arrival Board</h2>
        
        <div className="flex flex-col gap-4">
          {/* Route Card 1 */}
          <div className="border-2 border-charcoal p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-mono font-bold text-2xl">UP32 AB 8492</h3>
                <p className="text-sm font-bold uppercase mt-1">White Swift Dzire | KAMTA MICRO-STAND A</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold tabular-nums">Expected:</p>
                <p className="font-mono tabular-nums text-lg">5:00 - 5:15 PM</p>
              </div>
            </div>
            <button className="w-full bg-charcoal text-offwhite font-mono font-bold uppercase py-3 border-2 border-charcoal hover:bg-offwhite hover:text-charcoal transition-colors">
              Lock Seat (₹20)
            </button>
          </div>

          {/* Route Card 2 */}
          <div className="border-2 border-charcoal p-4 opacity-75">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-mono font-bold text-2xl">UP53 CY 1104</h3>
                <p className="text-sm font-bold uppercase mt-1">Mahindra Bolero | POLYTECHNIC JIT ZONE</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold tabular-nums">Expected:</p>
                <p className="font-mono tabular-nums text-lg">5:15 - 5:30 PM</p>
              </div>
            </div>
            <button className="w-full bg-offwhite text-charcoal font-mono font-bold uppercase py-3 border-2 border-charcoal hover:bg-charcoal hover:text-offwhite transition-colors">
              Standby
            </button>
          </div>
        </div>
      </section>

      {/* COMPONENT B: Pedestrian Nav & Token */}
      <section className="p-4">
        {/* Nav Direction */}
        <div className="border-2 border-charcoal p-6 mb-6 flex flex-col items-center justify-center bg-offwhite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mb-4 text-charcoal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="square" strokeLinejoin="miter" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <h2 className="font-bold text-2xl uppercase tracking-widest text-center">
            Walk North<br />200m
          </h2>
        </div>

        {/* Boarding Gate Flashcard */}
        <div className="border-2 border-charcoal bg-warning p-6 text-center">
          <p className="font-bold uppercase tracking-widest mb-2 text-charcoal">
            Boarding Gate
          </p>
          <div className="border-y-2 border-charcoal py-4 my-4">
            <h1 className="font-mono text-7xl font-extrabold text-charcoal tabular-nums">
              B-42
            </h1>
          </div>
          <div className="mt-4">
            <p className="font-bold uppercase text-sm mb-1 text-charcoal">Valid For</p>
            <p className="font-mono text-5xl font-bold tabular-nums text-charcoal">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
