// src/types/index.ts
export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  created_at?: string;
}

export interface Reading {
  id: string;
  content: string;
  total_reads: number;
  today_reads: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: string;
  access_token: string;
  refresh_token: string;
  user: User;
  message?: string;
  code: number;
}

export interface ApiError {
  status: string;
  message: string;
  code: number;
}

export interface ReadingStats {
  total_reads: number;
  today_reads: number;
  recent_reads: Reading[];
}