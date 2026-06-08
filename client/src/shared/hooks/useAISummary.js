import { useMutation } from "@tanstack/react-query";
import { generateSummary } from "../../services/aiService.js";

export default function useAISummary() {
  return useMutation({
    mutationFn: (transcript) => generateSummary(transcript),
  });
}
