
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        DecisionDesk AI
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        Your AI Business Strategist for a Focused Day.
      </p>
    </header>
  );
};
