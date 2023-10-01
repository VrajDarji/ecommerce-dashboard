import prismadb from "@/lib/prismadb";
import ProductsForms from "./components/productsForms";

const productPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      image: true,
    },
  });
  const color = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const size = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const category = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsForms intialData={product} color={color} category={category} size={size} />
      </div>
    </div>
  );
};
export default productPage;
