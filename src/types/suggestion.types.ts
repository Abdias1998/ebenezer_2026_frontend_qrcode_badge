export type SuggestionStatus = "new" | "read";

export interface Suggestion {
  _id: string;
  name?: string;
  contact?: string;
  message: string;
  status: SuggestionStatus;
  createdAt: string;
}

export interface PaginatedSuggestions {
  items: Suggestion[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
