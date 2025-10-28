
import React from 'react';

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

export const BriefingDisplay: React.FC<BriefingDisplayProps> = ({ briefing }) => {
  const parsedSections = parseBriefing(briefing);

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
