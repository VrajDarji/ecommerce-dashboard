import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("no store", { status: 400 });
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
    const Size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(Size);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const { name, value } = body;
    if (!name) {
      return new NextResponse("no name", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("no store", { status: 400 });
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
    const Size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(Size);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("no store", { status: 400 });
    }
    const Size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(Size);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}
