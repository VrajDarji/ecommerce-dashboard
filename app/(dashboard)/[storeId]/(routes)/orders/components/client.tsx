"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders(${data.length})`}
        desc="Manage orders for your store"
      />

      <Separator className="" />
      <DataTable columns={columns} data={data} searchKey="label" />
    </>
  );
};
