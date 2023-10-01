"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}
export const ApiList: React.FC<ApiListProps> = ({
  entityIdName,
  entityName,
}) => {
  const params = useParams();
  const origin = useOrigin();
  const basUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert title="GET" variant="public" desc={`${basUrl}/${entityName}`} />
      <ApiAlert
        title="GET"
        variant="public"
        desc={`${basUrl}/${entityName}/${entityIdName}`}
      />
      <ApiAlert title="POST" variant="admin" desc={`${basUrl}/${entityName}`} />
      <ApiAlert
        title="PATCH"
        variant="admin"
        desc={`${basUrl}/${entityName}/${entityIdName}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        desc={`${basUrl}/${entityName}/${entityIdName}`}
      />
    </>
  );
};
