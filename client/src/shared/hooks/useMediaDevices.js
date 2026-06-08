import { useEffect, useState } from "react";
import useMediaStore from "../../core/store/mediaStore.js";

export default function useMediaDevices() {
  const { setLocalStream, audioEnabled, videoEnabled } = useMediaStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;

    const getMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled,
        });
        setLocalStream(stream);
      } catch (err) {
        setError(err.message);
      }
    };

    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [audioEnabled, videoEnabled, setLocalStream]);

  return { error };
}
