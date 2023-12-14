import {
  GIPHY_API_KEY,
  GIPHY_URL,
  LIMIT,
  SEARCH,
  TRENDING,
} from "../constants/giphyConstants";
import { GIFsInfo } from "../types/types";
export const loadTrending = async (): Promise<{
  success: boolean;
  data: GIFsInfo;
  error?: string;
}> => {
  try {
    const req = await fetch(
      `${GIPHY_URL}/${TRENDING}?api_key=${GIPHY_API_KEY}&${LIMIT}`,
    );
    const trendingGifs = await req.json();

    return {
      success: true,
      data: trendingGifs.data,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: (error as Error).message,
    };
  }
};

export const loadSearched = async (query: string): Promise<{
  success: boolean;
  data: GIFsInfo;
  error?: string;
}> => {
  const tags = ["cats", "dogs"];
  try {
    if (query == "") {
      const req = await fetch(
        `${GIPHY_URL}/random?api_key=${GIPHY_API_KEY}&tag=${
          Math.random() > 0.5 ? tags[1] : tags[0]
        }`,
      );
      const searchedGifs = await req.json();
      return searchedGifs.data;
    }
    const req = await fetch(
      `${GIPHY_URL}/${SEARCH}?api_key=${GIPHY_API_KEY}&q=${query}&${LIMIT}`,
    );
    const searchedGifs = await req.json();

    return {
      success: true,
      data: searchedGifs.data || [],
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: (error as Error).message,
    };
  }
};
