// Query parameters for list operations
export interface ListQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
  search?: string;
}
