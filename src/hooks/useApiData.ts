import { useQuery } from "@tanstack/react-query";

interface Question {
  id: string;
  text: string;
}

interface QuestionsResponse {
  questions: Question[];
  user: string;
  completed?: boolean;
  results?: {
    score: number;
    recommendations: string[];
  };
}

export const useUserFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("user");
};

export const useFetchQuestions = (user: string | null) => {
  return useQuery<QuestionsResponse>({
    queryKey: ["questions", user],
    queryFn: async () => {
      if (!user) {
        throw new Error("User parameter is required");
      }

      const response = await fetch(
        `https://fhc-api.onrender.com/questions?user=${encodeURIComponent(
          user
        )}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!user,
  });
};
