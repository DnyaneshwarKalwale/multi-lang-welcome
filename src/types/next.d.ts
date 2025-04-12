declare module 'next' {
  export interface NextApiRequest {
    query: Record<string, string | string[]>;
    body: any;
    method: string;
  }
  
  export interface NextApiResponse {
    status(code: number): NextApiResponse;
    json(data: any): void;
  }
} 