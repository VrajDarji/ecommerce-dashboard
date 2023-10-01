import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
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
    const Cat = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(Cat);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const { name, billboardId } = body;
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
    const Cat = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(Cat);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("no store", { status: 400 });
    }
    const Cat = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(Cat);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}
