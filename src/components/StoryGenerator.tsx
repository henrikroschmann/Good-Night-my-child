import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StoryGenerator.css";

type StoryData = {
  story: string;
  images: string[];
};

const StoryGenerator: React.FC = () => {
  const [story, setStory] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [savedStories, setSavedStories] = useState<StoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [storyPrompt, setStoryPrompt] = useState<string>(
    "Create a good night story for children"
  );

  useEffect(() => {
    const storedStories = JSON.parse(
      localStorage.getItem("savedStories") || "[]"
    );
    if (storedStories) {
      setSavedStories(storedStories);
    }
  }, []);

  const handleStoryPromptChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStoryPrompt(event.target.value);
  };

  const generateStory = async () => {
    setLoading(true);
    // Generate story using ChatGPT
    const storyResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: "Create a good night story for children" },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );

    const generatedStory = storyResponse.data.choices[0].message.content.trim();
    setStory(generatedStory);

    // Generate images for the story using DALL-E
    const imagePrompts = generatedStory
      .split(".")
      .slice(0, -1)
      .map((sentence: string) => sentence.trim() + ".");

    const imageResponses = await Promise.all(
      imagePrompts.map((prompt: any) =>
        axios.post(
          "https://api.openai.com/v1/images/generations",
          {
            model: "image-alpha-001",
            prompt: prompt,
            num_images: 1,
            size: "256x256",
            response_format: "url",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
          }
        )
      )
    );
    setLoading(false);

    const generatedImages = imageResponses.map(
      (img: any) => img.data.data[0].url
    );
    setImages(generatedImages);

    // Save the story and images
    const newStory = { story: generatedStory, images: generatedImages };
    const updatedStories = [...savedStories, newStory];
    setSavedStories(updatedStories);
    localStorage.setItem("savedStories", JSON.stringify(updatedStories));
  };

  return (
    <div>
      <div className="input-container">
        <input
          type="text"
          value={storyPrompt}
          onChange={handleStoryPromptChange}
          className="story-prompt-input"
          placeholder="Enter story prompt"
        />
      </div>
      <button onClick={generateStory}>Generate Story</button>
      {loading && <div className="spinner"></div>}
      <div>
        {story.split(".").map((sentence, index) => (
          <div key={index}>
            <p>{sentence}.</p>
            {images[index] && (
              <img src={images[index]} alt={`Illustration for: ${sentence}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryGenerator;
