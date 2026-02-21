import { User as UserFromPrisma } from "@prisma/client";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserFromPrisma {}
    interface Request {
      user?: UserFromPrisma;
    }
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    PORT?: string;
    FACEBOOK_APP_SECRET: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_CALLBACK_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
  }
}
