import { useQuery } from "@tanstack/react-query";

interface LatestSubmissionResponse {
  ok: true;
  latestSubmission?: string;
}

type GetLatestSubmissionsResponse = LatestSubmissionResponse;
const apiUrl = import.meta.env.VITE_API_URL;

const fetchLatestSubmissions = async (
  user: string
): Promise<GetLatestSubmissionsResponse> => {
  const response = await fetch(
    `${apiUrl}/submissions?user=${encodeURIComponent(user)}`
  );

  if (response.ok === false && response.status === 404) {
    throw new Error("User hasn't submitted any answers");
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
