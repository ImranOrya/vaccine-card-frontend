import { useTranslation } from "react-i18next";
import { BarChart2, PersonStanding } from "lucide-react";
import DashboardCard from "@/components/custom-ui/card/DashboardCard";

export default function EpiUserDashboardPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Cards */}
      <div className="px-1 sm:px-2 pt-4 grid grid-cols-2 md:grid-cols-4">
        <>
          <DashboardCard
            loading={false}
            key={"country"}
            title={t("country")}
            description={t("january")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={200}
            symbol="+"
            icon={
              <BarChart2 className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
          <DashboardCard
            loading={false}
            key={"district"}
            title={t("district")}
            description={t("january")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={1000}
            symbol="+"
            icon={
              <BarChart2 className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
          <DashboardCard
            loading={false}
            key={"area"}
            title={t("area")}
            description={t("area")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={1600}
            symbol="+"
            icon={
              <BarChart2 className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
          <DashboardCard
            loading={false}
            key={"job"}
            title={t("job")}
            description={t("job")}
            className="overflow-hidden flex-1 space-y-2 h-full p-4"
            value={40}
            symbol="+"
            icon={
              <PersonStanding className="sm:size-[54px] min-w-[32px] min-h-[32px]" />
            }
          />
        </>
        {/* )} */}
      </div>
    </>
  );
}
