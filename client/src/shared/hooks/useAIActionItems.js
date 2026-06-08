import { useMutation } from "@tanstack/react-query";
import { extractActionItems } from "../../services/aiService.js";

export default function useAIActionItems() {
  return useMutation({
    mutationFn: (transcript) => extractActionItems(transcript),
  });
}
