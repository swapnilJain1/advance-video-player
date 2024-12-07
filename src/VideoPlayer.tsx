import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    videoUrl : string;
    thumbnailUrl : string;
    onProgress?:any;
}

const VideoPlayer = ({videoUrl, thumbnailUrl, onProgress}:VideoPlayerProps)=>{
    return (
    <ReactPlayer
    url={videoUrl}
    config={{ file: { attributes: { disablePictureInPicture: 'true' }}}}
    controls={true}
    light={<img src={thumbnailUrl} alt="Thumbnail" width="600px" height="350px" />}
    onProgress={onProgress}
  />
  )
}

export default VideoPlayer;