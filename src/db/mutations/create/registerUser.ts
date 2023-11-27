"use server";

import { Prisma, User, UserType } from "@prisma/client";
import prisma from "../../prisma";

interface BackendResponse {
  success: boolean;
  errorCode?: string;
  message: string;
  data?: User;
}

export interface RegisterFormClientInput {
  type: UserType;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  displayName: string;
  profilePictureUrl?: string;
  bio: string;
  tags: string[];
  password: string;
}

export async function registerUser(
  data: RegisterFormClientInput
): Promise<BackendResponse> {
  try {
    const user = await prisma.user.create({
      data: {
        type: data.type,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        birthday: data.birthday,
        displayName: data.displayName,
        profilePictureUrl: data.profilePictureUrl,
        bio: data.bio,
        tags: {
          connect: data.tags.map((tag) => ({
            name: tag,
          })),
        },
        password: data.password,
      },
    });
    return {
      success: true,
      message: "User created successfully",
      data: user,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        //@ts-expect-error target is not defined in the Prisma type
        const target = error.meta.target.split("_").slice(1, 2).join(" ");

        return {
          success: false,
          errorCode: error.code,

          message: `${
            target === "User displayName" ? "Username" : target
          } is already used`,
        };
      }
      return {
        success: false,
        errorCode: error.code,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "User creation failed",
    };
  }
}
