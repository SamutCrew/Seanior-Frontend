// app/api/user/create/[action]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type ActionParams = {
  params: Promise<{ action: string }>;
};

const handlers: {
  [key: string]: (req: Request) => Promise<NextResponse>;
} = {
  createUser: async (req: Request) => {
    try {
      const userData = await req.json();

      if (!userData.firebase_uid || !userData.email) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const newUser = await prisma.user.create({
        data: {
          firebase_uid: userData.firebase_uid,
          email: userData.email,
          name: userData.name || "",
          profile_img: userData.profile_img || "",
          user_type: userData.user_type || "user",
        },
      });

      return NextResponse.json(newUser, { status: 200 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Prisma error:", error.message);
        return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
      }
      console.error("Unknown error:", error);
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  },
};

export async function POST(req: Request, { params }: ActionParams) {
  const { action } = await params;

  const handler = handlers[action];
  if (!handler) {
    return NextResponse.json(
      { error: `Action '${action}' not supported` },
      { status: 400 }
    );
  }

  return handler(req);
}