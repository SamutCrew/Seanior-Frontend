// app/api/user/create/[action]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ActionParams = {
  params: Promise<{ action: string }>; // Update type to reflect that params is a Promise
};

// Handler functions for each action
const handlers: {
  [key: string]: (req: Request) => Promise<NextResponse>;
} = {
  checkUser: async (req: Request) => {
    try {
      const { firebase_uid } = await req.json();

      if (!firebase_uid) {
        return NextResponse.json({ error: "Firebase UID is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { firebase_uid },
      });

      return NextResponse.json(user || null, { status: user ? 200 : 404 });
    } catch (error) {
      console.error("Error checking user:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  },

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

// Main POST handler
export async function POST(req: Request, { params }: ActionParams) {
  const { action } = await params; // Await params to resolve the Promise

  const handler = handlers[action];
  if (!handler) {
    return NextResponse.json(
      { error: `Action '${action}' not supported` },
      { status: 400 }
    );
  }

  return handler(req);
}