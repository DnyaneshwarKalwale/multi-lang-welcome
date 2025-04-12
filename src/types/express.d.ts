declare module 'express' {
  export interface Request {
    method?: string;
    params: Record<string, string>;
    query: Record<string, string | string[]>;
    body: any;
  }
  
  export interface Response {
    status(code: number): Response;
    json(data: any): void;
  }
} 