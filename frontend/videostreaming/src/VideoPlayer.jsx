import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import mime from "mime";

export const VideoPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  // Function to determine MIME type for the video sources
  const determineMimeType = (sourceUrl) => {
    const mimeType = mime.getType(sourceUrl);
    return mimeType || "application/octet-stream"; // Fallback for unknown types
  };

  // Enrich options with MIME types for each source
  const enrichedOptions = {
    ...options,
    sources: options.sources.map((source) => ({
      ...source,
      type: determineMimeType(source.src),
    })),
  };

  useEffect(() => {
    // Ensure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      // Initialize the player
      const player = (playerRef.current = videojs(videoElement, enrichedOptions, () => {
        videojs.log("Player is ready");
        if (onReady) onReady(player);
      }));
    } else {
      // Update the player with new options if already initialized
      const player = playerRef.current;
      player.autoplay(enrichedOptions.autoplay);
      player.src(enrichedOptions.sources);
    }
  }, [enrichedOptions, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    // Clean up the player when the component unmounts
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player style={{ width: "600px" }}>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
