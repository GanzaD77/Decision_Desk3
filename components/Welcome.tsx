
import React from 'react';

const ExampleItem: React.FC<{ title: string; text: string }> = ({ title, text }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h4 className="font-semibold text-slate-300">{title}</h4>
        <p className="text-sm text-slate-400">{text}</p>
    </div>
);

export const Welcome: React.FC = () => {
  return (
    <div className="text-center p-8 bg-slate-800/20 border border-dashed border-slate-700 rounded-lg">
      <h2 className="text-2xl font-bold text-slate-100">Welcome to DecisionDesk</h2>
      <p className="mt-2 text-slate-400">
        Input your daily stats above, and I'll generate a focused morning briefing to guide your day.
      </p>
      <div className="mt-6 text-left grid sm:grid-cols-2 gap-4">
        <ExampleItem 
          title="What to provide?" 
          text="Key metrics like sales, user activity, ad spend, or even team morale updates."
        />
        <ExampleItem 
          title="No data today?"
          text="No problem. Submit without data to get a general productivity tip to start your day strong."
        />
      </div>
    </div>
  );
};
