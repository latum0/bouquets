declare global {
  namespace Express {
    interface User {
      id: number;
      login: string;
      nomComplet: string;
    }

    interface Request {
      user?: User;
      isAuthenticated?: boolean;
    }
  }
}

export {};
