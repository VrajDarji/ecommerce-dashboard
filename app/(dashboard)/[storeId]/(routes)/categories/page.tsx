import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
const page = async ({ params }: { params: { storeId: string } }) => {
  const category = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedCategory: CategoryColumn[] = category.map((e) => ({
    id: e.id,
    name: e.name,
    billboardLabel: e.billboard.label,
    createdAt: format(e.createdAt, "MMM do,yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategory} />
      </div>
    </div>
  );
};
export default page;
