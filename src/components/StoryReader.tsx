import React, { useState, useEffect } from 'react';

type Story = {
  story: string;
  images: string[];
};

const StoryReader: React.FC = () => {
  const [savedStories, setSavedStories] = useState<Story[]>([]);

  useEffect(() => {
    const storedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    if (storedStories) {
      setSavedStories(storedStories);
    }
  }, []);

  return (
    <div>
      <h2>Saved Stories</h2>
      {savedStories.map((savedStory, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <h3>Story {index + 1}</h3>
          {savedStory.story.split('.').map((sentence, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
              <p>{sentence}.</p>
              {savedStory.images[index] && <img src={savedStory.images[index]} alt={`Illustration for: ${sentence}`} style={{ maxWidth: '100%', height: 'auto' }} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StoryReader;
