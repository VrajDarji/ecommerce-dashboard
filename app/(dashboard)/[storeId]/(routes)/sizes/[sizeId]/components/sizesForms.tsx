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
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});
type SizesFormValues = z.infer<typeof formSchema>;
interface SizesFormsProps {
  intialData: Size | null;
}

const SizesForms: React.FC<SizesFormsProps> = ({ intialData }) => {
  const form = useForm<SizesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData || {
      name: "",
      value: "",
    },
  });
  const title = intialData ? "Edit Size" : "Create Size";
  const desc = intialData ? "Edit an existing Size" : "Create a new Size";
  const toastMsg = intialData ? "Size Updated" : "Size Created";
  const action = intialData ? "Save changes" : "Create";
  const param = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: SizesFormValues) => {
    try {
      setLoading(true);
      if (intialData) {
        await axios.patch(`/api/${param.storeId}/sizes/${param.sizeId}`, data);
      } else {
        await axios.post(`/api/${param.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${param.storeId}/sizes`);
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
      await axios.delete(`/api/${param.storeId}/sizes/${param.sizeId}`);
      router.refresh();
      router.push(`/${param.storeId}/sizes`);
      toast.success("Size Deleted");
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
                      placeholder="Size Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size Value"
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
export default SizesForms;
