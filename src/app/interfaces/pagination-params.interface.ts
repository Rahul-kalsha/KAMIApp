export interface PaginationParams {
  _page: number;
  _limit: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
  q?: string;  // for search
} 