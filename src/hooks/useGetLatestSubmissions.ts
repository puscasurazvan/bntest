import { useQuery } from "@tanstack/react-query";

interface LatestSubmissionResponse {
  ok: true;
  latestSubmission: string;
  // Assuming latestSubmission is a string representing the date
}

interface NotFoundResponse {
  ok: false;
  reason: "notFound";
}

type GetLatestSubmissionsResponse = LatestSubmissionResponse | NotFoundResponse;

const apiUrl = import.meta.env.VITE_API_URL;

const fetchLatestSubmissions = async (
  user: string
): Promise<GetLatestSubmissionsResponse> => {
  const response = await fetch(
    `${apiUrl}/submissions?user=${encodeURIComponent(user)}`
  );

  if (!response.ok) {
    throw new Error(
      `User hasn't submitted any answers, ${response.statusText}`
    );
  }

  return response.json();
};

export const useGetLatestSubmissions = (user: string | null) => {
  return useQuery({
    queryKey: ["latestSubmissions", user],
    queryFn: () => fetchLatestSubmissions(user!),
    enabled: !!user,
  });
};
