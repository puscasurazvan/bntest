import { useQuery } from "@tanstack/react-query";

interface Question {
  id: string;
  text: string;
}

export interface QuestionsResponse {
  questions: Question[];
  user: string;
  completed?: boolean;
  results?: {
    score: number;
    recommendations: string[];
  };
}

const apiUrl = import.meta.env.VITE_API_URL;

const fetchQuestions = async (user: string): Promise<QuestionsResponse> => {
  const response = await fetch(
    `${apiUrl}/questions?user=${encodeURIComponent(user)}`
  );

  if (!response.ok) {
    throw new Error("`Failed to fetch questions: ${response.statusText}`");
  }

  return response.json();
};

export const useFetchQuestions = (user: string | null) => {
  return useQuery({
    queryKey: ["questions", user],
    queryFn: () => fetchQuestions(user!),
    enabled: !!user,
  });
};
