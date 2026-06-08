import { useState } from "react";
import useMediaStore from "../../../core/store/mediaStore.js";

export default function useMeetingRecording() {
  const { isRecording, setIsRecording } = useMediaStore();
  const [recorder, setRecorder] = useState(null);

  const startRecording = async (stream) => {
    if (!stream) return;
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = (e) => chunks.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting-${Date.now()}.webm`;
      a.click();
    };
    mr.start();
    setRecorder(mr);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setRecorder(null);
      setIsRecording(false);
    }
  };

  return { isRecording, startRecording, stopRecording };
}
