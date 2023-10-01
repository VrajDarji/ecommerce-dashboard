import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/app-beta";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name requires", { status: 400 });
    }
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
