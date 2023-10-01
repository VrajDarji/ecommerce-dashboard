import prismadb from "@/lib/prismadb";
import CategoriesForms from "./components/CategoryForms";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });
  const billboard = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  }); 
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesForms intialData={category} billboards={billboard} />
      </div>
    </div>
  );
};
export default CategoryPage;
