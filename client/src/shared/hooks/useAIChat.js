import { useMutation } from "@tanstack/react-query";
import { askAI } from "../../services/aiService.js";

export default function useAIChat() {
  return useMutation({
    mutationFn: ({ message, context }) => askAI(message, context),
  });
}
