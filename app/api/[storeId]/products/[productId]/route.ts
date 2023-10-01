import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const {
      name,
      image,
      price,
      colorId,
      categoryId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;
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
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        image: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        image: {
          createMany: {
            data: [...image.map((i: { url: string }) => i)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("no store", { status: 400 });
    }
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        image: true,
        size: true,
        category: true,
        color: true,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}
