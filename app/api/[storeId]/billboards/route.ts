import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/app-beta";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, image } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!label) {
      return new NextResponse("name requires", { status: 400 });
    }
    const fUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!fUser) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    const billB = await prismadb.billboard.create({
      data: {
        label,
        image,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billB);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const billB = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billB);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
