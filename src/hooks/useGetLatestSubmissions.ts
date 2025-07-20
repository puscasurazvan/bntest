import { useQuery } from "@tanstack/react-query";

interface LatestSubmissionResponse {
  ok: true;
  latestSubmission: {
    date: string;
  };
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

  if (response.status === 404) {
    return {
      ok: false,
      reason: "notFound",
    };
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch latest submissions: ${response.statusText}`
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
