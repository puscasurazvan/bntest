import { useMutation } from "@tanstack/react-query";

interface SubmitAnswersBody {
  answers: Array<{
    questionId: string;
    answer: number;
  }>;
}

interface SubmitAnswersParams {
  user: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const submitAnswers = async ({
  user,
  answers,
}: SubmitAnswersParams & SubmitAnswersBody) => {
  const response = await fetch(`${apiUrl}/submissions?user=${user}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit answers:" + response.statusText);
  }

  return response.json();
};

export const useSubmitAnswers = () => {
  return useMutation({ mutationFn: submitAnswers });
};
