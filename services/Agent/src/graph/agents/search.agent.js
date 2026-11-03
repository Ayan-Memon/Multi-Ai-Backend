import { tavily } from "../../utils/llm.models.js";

export const searchAgent = async (state) => {
  try {
    const result = await tavily.invoke({ query: state.prompt });

    return {
      ...state,
      searchResults: result,
      searchResultImages: result.images,
    };
  } catch (error) {
    console.log("search_agent_error:", error);

    return { ...state, searchResults: [], searchResultImages: [] };
  }
};
