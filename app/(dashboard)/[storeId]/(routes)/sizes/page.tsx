import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";
const page = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes: SizeColumn[] = sizes.map((e) => ({
    id: e.id,
    name: e.name,
    value: e.value,
    createdAt: format(e.createdAt, "MMM do,yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};
export default page;
