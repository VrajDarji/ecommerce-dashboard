"use client";

import AlertModal from "@/components/modals/alert-modal";
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
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  label: z.string().min(1),
  image: z.string().min(1),
});
type BillboardsFormValues = z.infer<typeof formSchema>;
interface BillboardsFormsProps {
  intialData: Billboard | null;
}

const BillboardsForms: React.FC<BillboardsFormsProps> = ({ intialData }) => {
  const form = useForm<BillboardsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData || {
      label: "",
      image: "",
    },
  });
  const title = intialData ? "Edit Billboard" : "Create BillBoard";
  const desc = intialData
    ? "Edit an existing Billboard"
    : "Create a new BillBoard";
  const toastMsg = intialData ? "Billboard Updated" : "BillBoard Created";
  const action = intialData ? "Save changes" : "Create";
  const param = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: BillboardsFormValues) => {
    try {
      setLoading(true);
      if (intialData) {
        await axios.patch(
          `/api/${param.storeId}/billboards/${param.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${param.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${param.storeId}/billboards`);
      toast.success(toastMsg);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${param.storeId}/billboards/${param.billboardId}`
      );
      router.refresh();
      router.push(`/${param.storeId}/billboards`);
      toast.success("Billboard Deleted");
    } catch (err) {
      toast.error(
        "Make sure you removed all categories using this billboard  first"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
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
        <Heading title={title} desc={desc} />
        {intialData && (
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
        )}
      </div>
      <Separator className="mb-3" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
      <Separator className="my-4" />
    </>
  );
};
export default BillboardsForms;
