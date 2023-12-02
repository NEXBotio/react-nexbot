import { useQuery } from "react-query";
import { BASE__AND_PATH } from "../config/config";

export const useWebSocketTicket = (
  apiKeyCallback: () => Promise<string>,
  authSecondsToRefresh: number = 30 * 60,
  botId: string
) => {
  const { data: singleUseTokenData } = useQuery(
    ["singleUseToken",botId],
    async () => {
      const token = await apiKeyCallback();
      return token;
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: authSecondsToRefresh * 1000,
      staleTime: (authSecondsToRefresh - 6 * 60) * 1000,
      refetchInterval: (authSecondsToRefresh - 5 * 60) * 1000,
      onError: (error) => {
        console.log("error getting single use token", error);
        throw error;
      },
    }
  );

  const fetchTicket = async (token: string): Promise<string | undefined> => {
    try {
      const response = await fetch(`${BASE__AND_PATH}/get_ws_ticket`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.access_token;
    } catch (e) {
      console.log("error getting ticket", e);
      return undefined;
    }
  };

  const { data: ticketData } = useQuery(
    ["ticket", singleUseTokenData],
    async () => {
      if (singleUseTokenData) {
        return await fetchTicket(singleUseTokenData);
      } else {
        throw new Error("no single use token");
      }
    },
    {
      enabled: !!singleUseTokenData,
      refetchOnWindowFocus: false,
      cacheTime: authSecondsToRefresh * 1000,
      staleTime: (authSecondsToRefresh - 6 * 60) * 1000,
      refetchInterval: (authSecondsToRefresh - 5 * 60) * 1000,
      onError: (error) => {
        console.log("error getting ticket", error);
        throw error;
      },
    }
  );
  return { wsTicket: ticketData };
};
