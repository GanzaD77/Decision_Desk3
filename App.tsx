
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { BriefingDisplay } from './components/BriefingDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { Welcome } from './components/Welcome';
import { generateBriefing } from './services/geminiService';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [briefing, setBriefing] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [tone, setTone] = useState<string>('Balanced');

  const handleGenerateBriefing = useCallback(async () => {
    if (!userInput.trim() && briefing) { // Allow empty input to get default tip if no briefing yet
      setError('Please enter your business data.');
      return;
    }

    setIsLoading(true);
    setError('');
    setBriefing('');

    try {
      const result = await generateBriefing(userInput, tone);
      setBriefing(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate briefing. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, briefing, tone]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
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
