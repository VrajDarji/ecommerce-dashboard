import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SettingsForms from "./components/settingsForms";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  if (!store) {
    redirect("/");
  }
  return (
    <div className="flex-col w-[100vw] gap-8">
      <div className="flex space-y-4 w-full p-8 pt-6">
        <SettingsForms intialData={store} />
      </div>
    </div>
  );
};
export default SettingsPage;
