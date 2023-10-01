"use client";
import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";
import { toast } from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  desc: string;
  variant: "public" | "admin";
}
const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  desc,
  variant = "public",
}) => {
  const onCopy = (desc: string) => {
    navigator.clipboard.writeText(desc);
    toast.success("Copied");
  };
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[.3rem] py-[.2rem] text-sm font-semibold">
          {desc}
        </code>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => {
            onCopy(desc);
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
