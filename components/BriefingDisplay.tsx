import React, { useState } from 'react';

interface BriefingDisplayProps {
  briefing: string;
}

const parseBriefing = (text: string) => {
  // Regex to split by the emoji prefixes, keeping the delimiter.
  // This handles cases where sections might not be separated by newlines.
  const sections = text.split(/(?=🧭|⚠️|💡|🔥|💭)/g).filter(s => s.trim());
  return sections.map((sectionText, index) => {
    const trimmedText = sectionText.trim();
    const firstSpaceIndex = trimmedText.indexOf(' ');
    
    if (firstSpaceIndex === -1) {
      return { id: index, emoji: '', title: '', content: trimmedText };
    }
    
    const emoji = trimmedText.substring(0, firstSpaceIndex);
    // Find the dash, but handle multiline content and lists
    const restOfText = trimmedText.substring(firstSpaceIndex + 1).replace(/\*\*/g, '');
    const dashIndex = restOfText.indexOf('—');

    if (dashIndex === -1) {
      return { id: index, emoji, title: restOfText, content: ''};
    }

    const title = restOfText.substring(0, dashIndex).trim();
    const content = restOfText.substring(dashIndex + 1).trim();

    return { id: index, emoji, title, content };
  });
};

const ThumbsUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
    </svg>
);

const ThumbsDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.642a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.2-2.667a4 4 0 00.8-2.4z" />
    </svg>
);

export const BriefingDisplay: React.FC<BriefingDisplayProps> = ({ briefing }) => {
  const parsedSections = parseBriefing(briefing);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (response: 'Yes' | 'No') => {
    setFeedbackGiven(true);
    // Store feedback in localStorage as a simple counter
    const feedbackType = response === 'Yes' ? 'helpful_yes' : 'helpful_no';
    const currentCount = parseInt(localStorage.getItem(feedbackType) || '0', 10);
    localStorage.setItem(feedbackType, (currentCount + 1).toString());
    console.log(`Feedback received: ${response}. Total ${feedbackType} count: ${currentCount + 1}`);
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Your Daily Focus</h2>
      <div className="space-y-6">
        {parsedSections.map(({ id, emoji, title, content }) => (
          <div key={id} className="flex items-start">
            <span className="text-2xl mr-4 mt-1">{emoji}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
              <div 
                className="mt-1 text-slate-300 prose prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5"
                dangerouslySetInnerHTML={{ __html: content.replace(/•/g, '<li>').replace(/\n/g, '<br />') }}
              >
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Section */}
      <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end items-center gap-3">
        {feedbackGiven ? (
          <p className="text-sm text-slate-400 italic">Thanks for your feedback!</p>
        ) : (
          <>
            <p className="text-sm text-slate-400">Was this helpful?</p>
            <button
              onClick={() => handleFeedback('Yes')}
              className="inline-flex items-center px-3 py-1 bg-slate-700/50 text-slate-300 text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
              aria-label="Yes, this was helpful"
            >
              <ThumbsUpIcon />
              Yes
            </button>
            <button
              onClick={() => handleFeedback('No')}
              className="inline-flex items-center px-3 py-1 bg-slate-700/50 text-slate-300 text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
              aria-label="No, this was not helpful"
            >
              <ThumbsDownIcon />
              No
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

const style = document.createElement('style');
style.textContent = fadeInAnimation;
document.head.append(style);