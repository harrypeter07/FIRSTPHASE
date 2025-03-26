export type User = {
    id: string;
    email: string;
    name?: string;
    role: 'user' | 'company' | 'interviewer';
  };
  