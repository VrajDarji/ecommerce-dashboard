"use client";

import AlertModal from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface SettingsFormsProps {
  intialData: Store;
}
const formSchema = z.object({
  name: z.string().min(1),
});
type SettingsFormValues = z.infer<typeof formSchema>;
const SettingsForms: React.FC<SettingsFormsProps> = ({ intialData }) => {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData,
  });
  const param = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${param.storeId}`, data);
      router.refresh();
      toast.success("Store Updated");
    } catch (err) {
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${param.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store Deleted");
    } catch (err) {
      toast.error("Make sure you removed all products and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <div className="w-full">
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        loading={loading}
        onConfirm={() => {
          onDelete();
        }}
      />
      <div className="flex items-center justify-between w-full mb-2">
        <Heading title="Settings" desc="Manage Store preferences" />
        <Button
          variant={"destructive"}
          size={"sm"}
          onClick={() => {
            setOpen(true);
          }}
          disabled={loading}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator className="my-4" />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        desc={`${origin}/api/${param.storeId}`}
        variant="public"
      />
    </div>
  );
};
export default SettingsForms;
