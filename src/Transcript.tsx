import  { useEffect, useState } from "react";
import data from "./mocks/data.json";
import markers from "./mocks/marker.json";
import envtt from "./en.vtt";
// import srtParser2 from 'srt-parser-2';
import { WebVTTParser } from "webvtt-parser";
import { OnProgressProps } from "react-player/base";
import VideoPlayer from "./VideoPlayer";

type ParserObjects = {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
};
type SrtObjects = ParserObjects & {
  startSeconds: number;
  endSeconds: number;
  isActive: boolean;
};

function Transcript() {
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [srtArray, setSrtArray] = useState<SrtObjects[]>([]);
  const [flagPosition, setFlagPositon] = useState<number[]>([]);
  const [agendaTitle, setAgendaTitle] = useState<string>("");
  const [userClickCount, setUserClickCount] = useState<number>(0);
  const user ="Swapnil Jain";
  const transcriptDelay = 0;

  // function timeToSeconds(time: string) {
  //   const [hours, minutes, seconds] = time.split(':').map(parseFloat);
  //   return hours * 3600 + minutes * 60 + seconds;
  // }
  useEffect(() => {
    markers.map(
      (item) => item.to <= playedSeconds && setAgendaTitle(item.title)
    );
  }, [playedSeconds]);

  useEffect(() => {
    fetch(envtt)
      .then((response) => response.text())
      .then((data) => {
        // const parser = new srtParser2();
        // const dataObject: ParserObjects[] = parser.fromSrt(data);
        const parser = new WebVTTParser();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataObject: any = parser.parse(data, "metadata");

        const parsedCaptions: SrtObjects[] = dataObject.cues.map(
          (caption: { startTime: string; endTime: string }) => ({
            ...caption,
            startSeconds: caption.startTime,
            endSeconds: caption.endTime,
            isActive: false,
          })
        );

        setSrtArray(parsedCaptions);
      });
  }, []);
  const handleProgress = (_: OnProgressProps) => {
    const { playedSeconds } = _;
    handleVideoPlayer();
    setPlayedSeconds(playedSeconds);
  };
  const handleVideoPlayer = () => {
    const containerEle = document.getElementById("video-container");
    const seekBarHtml = document.createElement("div");
    const cTimeEle = document.getElementById("current-time");
    seekBarHtml.classList.add("seek-bar");
    seekBarHtml.setAttribute("id", "current-time");
    if (containerEle !== null && cTimeEle === null) {
      const divEle = containerEle.querySelector("div");
      divEle && divEle.appendChild(seekBarHtml);
      const videoEle = containerEle.querySelector("video");
      if (videoEle) {
        videoEle.addEventListener("play", function () {
          const maxLengths = markers.map((_) => _.to > 0 && _.to);
          const cTimeEle = document.getElementById("current-time");
          const countMarkers = maxLengths.length;
          if (cTimeEle) {
            const bubblesEle = cTimeEle.querySelectorAll(".bubbles");
            if (bubblesEle.length >= countMarkers) return false;
            const containerWidth = cTimeEle
              ? cTimeEle.offsetWidth
              : this.duration;
            const perSecond = containerWidth / this.duration;
            for (let i = 0; i <= Math.floor(this.duration); i++) {
              if (maxLengths.includes(i)) {
                const divEle = document.createElement("div");
                divEle.classList.add("bubbles");
                divEle.setAttribute(
                  "style",
                  `left:${(i * perSecond).toString()}px`
                );
                cTimeEle.append(divEle);
              }
            }
          }
        });
        videoEle.addEventListener("playing", function () {
          const cTimeEle = document.getElementById("current-time");
          cTimeEle && cTimeEle.classList.add("play");
        });
        videoEle.addEventListener("pause", function () {
          const cTimeEle = document.getElementById("current-time");
          cTimeEle && cTimeEle.classList.remove("play");
        });
      }
    }
  };
  const handleFlagClick = () => {
    setFlagPositon([...flagPosition, playedSeconds]);
    setUserClickCount(userClickCount+1)
  };
  const handleDeleteFlag = (item: number) => {
    if (window.confirm("Do you want to delete this flag")) {
      const filteredItems = flagPosition.filter((itemId) => item !== itemId);
      setFlagPositon(filteredItems);
      setUserClickCount(userClickCount-1)
    }
  };
  return (
    <>
      <h2>
        <span className="meeting-title">Current Discussion :</span>{" "}
        {agendaTitle}
      </h2>
      <div className="container-body" id="video-container">
        <VideoPlayer
          videoUrl="Teamwork.mp4"
          thumbnailUrl={data[2].thumbnailUrl}
          onProgress={handleProgress}
        />
        <div className="transcript-container">
          {srtArray.map((subtitle, index) => {
            const isActive =
              subtitle.startSeconds <= playedSeconds - transcriptDelay &&
              subtitle.endSeconds >= playedSeconds - transcriptDelay;

            return (
              <p key={index} className={isActive ? "active" : ""}>
                <span className="transcriptUserName">
                  {flagPosition.map((position, id) => (
                    <span key={id}>
                      {position >= subtitle.startSeconds + transcriptDelay &&
                      position <= subtitle.endSeconds + transcriptDelay ? (
                        <span onClick={() => handleDeleteFlag(position)}>
                          🚩
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  ))}
                  {subtitle.text.slice(
                    subtitle.text.indexOf("v") + 1,
                    subtitle.text.indexOf(">")
                  )}
                </span>{" "}
                -{" "}
                {subtitle.text.slice(
                  subtitle.text.indexOf(">") + 1,
                  subtitle.text.lastIndexOf("<")
                )}
              </p>
            );
          })}
        </div>

        <div className="flag-container">
          <button onClick={handleFlagClick}>🚩</button>
          {/* {(userClickCount!==0) && <p>{`${userClickCount} - ${user}`}</p>} */}
        </div>
      </div>
    </>
  );
}

export default Transcript;
