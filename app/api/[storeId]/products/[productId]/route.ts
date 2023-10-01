import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string,billboardId:string } }
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
    const billB = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billB);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string,billboardId:string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const { label,image } = body;
    if (!label) {
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
    const billB = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        image
      },
    });
    return NextResponse.json(billB);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: {  billboardId: string } }
) {
  try {
   
    if (!params.billboardId) {
      return new NextResponse("no store", { status: 400 });
    }
    const billB = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billB);
  } catch (err) {
    console.error(err);
    return new NextResponse("error", { status: 500 });
  }
}