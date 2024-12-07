import { useState } from 'react';
import data from './mocks/data.json';
import Transcript from './Transcript';
import VideoPlayer from './VideoPlayer';
import "./App.css";

interface Video {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
}

function App() {
  const [currentVideo, setCurrentVideo] = useState<string>(data[0].videoUrl);
  const [currentThumbnail, setCurrentThumbnail] = useState<string>(data[0].thumbnailUrl);
  const [showTranscript, setShowTranscript] = useState<boolean>(true);

  const handlePlayVideo = (videoUrl: string, thumbnailUrl: string) => {
    setCurrentVideo(videoUrl);
    setCurrentThumbnail(thumbnailUrl);
  };

  return (
    <div className="video-container">
      <h1>Demo Video Player App</h1>
      <button onClick={() => setShowTranscript(!showTranscript)}>
        {showTranscript ? 'Video with Transcript' : 'Video without transcript'}
      </button>

      {!showTranscript && (
        <main className="container-body">
          <div className="buttons">
            {data.map((video: Video) => (
              <button
                key={video.id}
                onClick={() => handlePlayVideo(video.videoUrl, video.thumbnailUrl)}
              >
                Recording {video.id}
              </button>
            ))}
          </div>

          <div className="video">
            <VideoPlayer
              videoUrl={currentVideo}
              thumbnailUrl={currentThumbnail}
            />
          </div>
        </main>
      )}
      {showTranscript && <Transcript />}
    </div>
  );
}

export default App;
