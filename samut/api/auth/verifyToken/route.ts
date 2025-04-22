//app/api/auth/verifyToken/route.ts
import { NextResponse } from "next/server";

import admin from "@/lib/firebaseAdmin";


export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }
  
    const decodedToken = await admin.auth().verifyIdToken(token);
    return NextResponse.json(decodedToken, { status: 200 });
  }
  catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
