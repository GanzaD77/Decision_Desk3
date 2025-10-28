
import React from 'react';

interface InputFormProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  tone: string;
  setTone: (value: string) => void;
}

const ButtonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.062 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);


export const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, onSubmit, isLoading, tone, setTone }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };
  
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
      <label htmlFor="businessData" className="block text-sm font-medium text-slate-300 mb-2">
        Enter Your Daily Business Data
      </label>
      <textarea
        id="businessData"
        rows={6}
        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 placeholder:text-slate-500"
        placeholder="e.g., Sales: $4.2k yesterday, Top Product: Chocolate croissants, Ad spend: $150 Facebook..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-end gap-4">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <label htmlFor="tone-select" className="block text-xs font-medium text-slate-400 mb-1">
            Briefing Tone
          </label>
          <div className="relative">
            <select 
              id="tone-select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={isLoading}
              className="w-full appearance-none bg-slate-900 border border-slate-600 rounded-md py-2 px-3 pr-8 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            >
              <option>Strategic</option>
              <option>Chill</option>
              <option>Tough Love</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end">
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Analyzing...' : <><ButtonIcon /> Get My Briefing</>}
          </button>
          <p className="text-xs text-slate-500 mt-2 text-right">
            or press <kbd className="font-sans px-1.5 py-0.5 text-xs font-semibold text-slate-400 bg-slate-900/50 border border-slate-600 rounded">Cmd/Ctrl</kbd> + <kbd className="font-sans px-1.5 py-0.5 text-xs font-semibold text-slate-400 bg-slate-900/50 border border-slate-600 rounded">Enter</kbd>
          </p>
        </div>
      </div>
    </div>
  );
};
