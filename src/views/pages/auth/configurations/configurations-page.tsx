import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MapPinHouse } from "lucide-react";
import { useTranslation } from "react-i18next";
import JobTab from "./tabs/job/job-tab";
import DestinationTab from "./tabs/destination/destination-tab";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import VaccineTypeTab from "./tabs/vaccine/type/vaccine-type-tab";
import VaccineCenterTab from "./tabs/vaccine/center/vaccine-center-tab";
import PaymentTab from "./tabs/payment/payment-tab";

export default function ConfigurationsPage() {
  const { user } = useUserAuthState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const per: UserPermission = user?.permissions.get(
    PermissionEnum.configurations.name
  ) as UserPermission;

  const tableList = Array.from(per.sub).map(
    ([key, _subPermission], index: number) => {
      return key == PermissionEnum.configurations.sub.configuration_job ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("job")}
        </TabsTrigger>
      ) : key == PermissionEnum.configurations.sub.configuration_destination ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("reference")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.configuration_vaccine_type ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("vaccine_type")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.configuration_vaccine_center ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("vaccine_center")}
        </TabsTrigger>
      ) : key == PermissionEnum.configurations.sub.configuration_payment ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("payment")}
        </TabsTrigger>
      ) : undefined;
    }
  );
  return (
    <>
      <Breadcrumb className="mx-2 mt-2">
        <BreadcrumbHome />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("settings")}</BreadcrumbItem>
      </Breadcrumb>
      <Tabs
        dir={direction}
        defaultValue={per.sub.values().next().value?.id.toString()}
        className="flex flex-col items-center pb-12"
      >
        <TabsList className="px-0 pb-1 h-fit mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
          {tableList}
        </TabsList>
        <TabsContent
          value={PermissionEnum.configurations.sub.configuration_job.toString()}
          className="w-full px-4 pt-8"
        >
          <JobTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.configuration_destination.toString()}
          className="w-full px-4 pt-8"
        >
          <DestinationTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.configuration_vaccine_center.toString()}
          className="w-full px-4 pt-8"
        >
          <VaccineCenterTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.configuration_vaccine_type.toString()}
          className="w-full px-4 pt-8"
        >
          <VaccineTypeTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.configuration_payment.toString()}
          className="w-full px-4 pt-8"
        >
          <PaymentTab permissions={per} />
        </TabsContent>
      </Tabs>
    </>
  );
}
