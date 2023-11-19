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
// For Other projects

// import { DefaultSession, DefaultUser } from "next-auth";
// import { JWT, DefaultJWT } from "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role: string;
//     } & DefaultSession;
//   }

//   interface User extends DefaultUser {
//     role: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT extends DefaultJWT {
//     role: string;
//   }
// }
