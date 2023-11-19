import { SessionUser } from "@/pages/api/auth/[...nextauth]";

declare module "next-auth" {
  interface User extends SessionUser {}

  interface Session extends DefaultSession {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: UserType;
    profilePictureUrl: string | undefined;
  }
}
