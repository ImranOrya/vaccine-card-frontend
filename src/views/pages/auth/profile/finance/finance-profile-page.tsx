import { useTranslation } from "react-i18next";
import { useFinanceAuthState } from "@/context/AuthContextProvider";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { EditProfilePassword } from "../general/edit-profile-password";
import { useEffect, useState } from "react";
import { District, Province } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import FinanceProfileHeader from "./finance-profile-header";
import EditFinanceProfileInformation from "./steps/edit-finance-profile-information";
interface EditNgoInformation {
  name_english: string | undefined;
  name_pashto: string;
  name_farsi: string;
  area_english: string;
  area_pashto: string;
  area_farsi: string;
  abbr: string;
  contact: string;
  email: string;
  province: Province;
  district: District;
  status_type_id: number;
  status_type: string;
  optional_lang: string;
}
export default function NgoProfilePage() {
  const { user } = useFinanceAuthState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const [ngoData, setNgoData] = useState<EditNgoInformation>();
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`ngo/profile/info/${user.id}`);
      if (response.status == 200) {
        const ngo = response.data.ngo;
        if (ngo) setNgoData(ngo);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadInformation();
  }, []);
  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;

  return (
    <div className="flex flex-col gap-y-3 px-2 mt-2 pb-12">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("profile")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{user?.username}</BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue="Account"
        className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="sm:min-h-[550px] h-fit pb-8 xxl:min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <FinanceProfileHeader />
          <TabsTrigger
            className={`mt-6 rtl:text-2xl-rtl ltr:text-2xl-ltr  ${selectedTabStyle}`}
            value="Account"
          >
            <Database className="size-[18px]" />
            {t("account_information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-2xl-rtl ltr:text-2xl-ltr ${selectedTabStyle}`}
            value="password"
          >
            <KeyRound className="size-[18px]" />
            {t("update_account_password")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex-1 m-0 overflow-x-auto" value="Account">
          <EditFinanceProfileInformation
            loading={loading}
            failed={failed}
            setLoading={setLoading}
            ngoData={ngoData}
            setError={setError}
            setNgoData={setNgoData}
            error={error}
            loadInformation={loadInformation}
          />
        </TabsContent>
        <TabsContent className="flex-1 m-0" value="password">
          <EditProfilePassword url="ngo/profile/change-password" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
