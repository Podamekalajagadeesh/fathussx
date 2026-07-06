import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoConference = () => {
  const roomName = 'my-awesome-room'; // Generate a unique room name

  return (
    <div className="video-conference-container">
      <JitsiMeeting
        roomName={roomName}
        getIFrameRef={(iframe) => {
          iframe.style.height = '100vh';
          iframe.style.width = '100%';
        }}
      />
    </div>
  );
};

export default VideoConference;