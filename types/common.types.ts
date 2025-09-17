// Common Types used across the application

export type PreviewMode = 'desktop' | 'mobile';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ClickableComponentProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
}

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface SearchParams extends PaginationParams, SortParams {
  filters?: FilterParams;
  query?: string;
}