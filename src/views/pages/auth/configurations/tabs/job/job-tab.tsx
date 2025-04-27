import NastranModel from "@/components/custom-ui/model/NastranModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import axiosClient from "@/lib/axois-client";
import { toLocaleDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import JobDialog from "./job-dialog";
import { Job, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
interface JobTabProps {
  permissions: UserPermission;
}
export default function JobTab(props: JobTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    job: any;
  }>({
    visible: false,
    job: undefined,
  });
  const [jobs, setJobs] = useState<{
    unFilterList: Job[];
    filterList: Job[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`jobs`);
      const fetch = response.data as Job[];
      setJobs({
        unFilterList: fetch,
        filterList: fetch,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  const searchOnChange = (e: any) => {
    const { value } = e.target;
    // 1. Filter
    const filtered = jobs.unFilterList.filter((item: Job) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setJobs({
      ...jobs,
      filterList: filtered,
    });
  };
  const add = (job: Job) => {
    setJobs((prev) => ({
      unFilterList: [job, ...prev.unFilterList],
      filterList: [job, ...prev.filterList],
    }));
  };
  const update = (job: Job) => {
    setJobs((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === job.id ? { ...item, name: job.name } : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };

  const dailog = useMemo(
    () => (
      <NastranModel
        size="lg"
        visible={selected.visible}
        isDismissable={false}
        button={<button></button>}
        showDialog={async () => {
          setSelected({
            visible: false,
            job: undefined,
          });
          return true;
        }}
      >
        <JobDialog job={selected.job} onComplete={update} />
      </NastranModel>
    ),
    [selected.visible]
  );
  const job = permissions.sub.get(
    PermissionEnum.configurations.sub.configuration_job
  );
  const hasEdit = job?.edit;
  const hasAdd = job?.add;
  const hasView = job?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add_job")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <JobDialog onComplete={add} />
          </NastranModel>
        )}

        <CustomInput
          size_="lg"
          placeholder={`${t("search")}...`}
          parentClassName="flex-1"
          type="text"
          onChange={searchOnChange}
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
        />
      </div>
      <Table className="bg-card rounded-md mt-1 py-8 w-full">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start">{t("id")}</TableHead>
            <TableHead className="text-start">{t("name")}</TableHead>
            <TableHead className="text-start">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {loading ? (
            <TableRow>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ) : (
            jobs.filterList.map((job: Job, index: number) => (
              <TableRowIcon
                read={hasView}
                remove={false}
                edit={hasEdit}
                onEdit={async (job: Job) => {
                  setSelected({
                    visible: true,
                    job: job,
                  });
                }}
                key={index}
                item={job}
                onRemove={async () => {}}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{job.id}</TableCell>
                <TableCell>{job.name}</TableCell>
                <TableCell>
                  {toLocaleDate(new Date(job.created_at), state)}
                </TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      {dailog}
    </div>
  );
}
