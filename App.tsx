import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { BriefingDisplay } from './components/BriefingDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { Welcome } from './components/Welcome';
import { generateBriefing } from './services/geminiService';

const saveData = (input: string) => {
  if (!input.trim()) return; // Don't save empty input

  try {
    const history = JSON.parse(localStorage.getItem('decisionDeskHistory') || '[]');
    const newEntry = {
      date: new Date().toISOString(),
      data: input,
    };
    // Keep history to a reasonable size, e.g., last 30 entries
    const updatedHistory = [newEntry, ...history].slice(0, 30);
    localStorage.setItem('decisionDeskHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
};

const businessTypeToClass: { [key: string]: string } = {
  'Coffee': 'bg-coffee',
  'Restaurant': 'bg-restaurant',
  'Gym': 'bg-gym',
  'Fashion': 'bg-fashion',
  'Tech': 'bg-tech',
  'Marketing': 'bg-marketing',
  'Real Estate': 'bg-real-estate',
  'Education': 'bg-education',
  'Travel': 'bg-travel',
  'Music': 'bg-music',
  'Other': 'bg-default'
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [briefing, setBriefing] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [tone, setTone] = useState<string>('Strategic');
  const [backgroundClass, setBackgroundClass] = useState<string>('bg-default');

  const handleGenerateBriefing = useCallback(async () => {
    if (!userInput.trim() && !briefing) { 
      // If no input and no briefing yet, generate the default tip
    } else if (!userInput.trim() && briefing) {
      setError('Please enter your business data for a new briefing.');
      return;
    }

    setIsLoading(true);
    setError('');
    setBriefing('');

    try {
      const { briefing: result, businessType } = await generateBriefing(userInput, tone);
      setBriefing(result);
      setBackgroundClass(businessTypeToClass[businessType] || 'bg-default');
      saveData(userInput);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate briefing. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, briefing, tone]);

  return (
    <div className={`min-h-screen text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 dynamic-bg ${backgroundClass}`}>
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8">
          <InputForm
            userInput={userInput}
            setUserInput={setUserInput}
            onSubmit={handleGenerateBriefing}
            isLoading={isLoading}
            tone={tone}
            setTone={setTone}
          />
          <div className="mt-8 min-h-[300px]">
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && briefing && <BriefingDisplay briefing={briefing} />}
            {!isLoading && !error && !briefing && <Welcome />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;