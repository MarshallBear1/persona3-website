import hospitalVideo from "./assets/cyberpunk-hospital-10min.mp4";
import hospitalPoster from "./assets/cyberpunk-hospital-poster.webp";

export default function VideoBackground() {
  return (
    <div className="local-background-shell" aria-hidden="true">
      <video
        className="local-background-video"
        src={hospitalVideo}
        poster={hospitalPoster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
      />
    </div>
  );
}
