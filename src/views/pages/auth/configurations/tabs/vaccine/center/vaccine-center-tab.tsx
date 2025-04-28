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
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import { VaccineCenterType } from "@/lib/types";
import VaccineCenterDialog from "./vaccine-center-dialog";
interface VaccineCenterProps {
  permissions: UserPermission;
}
export default function VaccineCenterTab(props: VaccineCenterProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    vaccineCenter: any;
  }>({
    visible: false,
    vaccineCenter: undefined,
  });
  const [vaccineCenters, setVaccineCenters] = useState<{
    unFilterList: VaccineCenterType[];
    filterList: VaccineCenterType[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`vaccine-centers`);
      const fetch = response.data as VaccineCenterType[];
      setVaccineCenters({
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
    const filtered = vaccineCenters.unFilterList.filter(
      (item: VaccineCenterType) =>
        item.name.toLowerCase().includes(value.toLowerCase())
    );
    setVaccineCenters({
      ...vaccineCenters,
      filterList: filtered,
    });
  };
  const add = (vaccineCenter: VaccineCenterType) => {
    setVaccineCenters((prev) => ({
      unFilterList: [vaccineCenter, ...prev.unFilterList],
      filterList: [vaccineCenter, ...prev.filterList],
    }));
  };
  const update = (vaccineCenter: VaccineCenterType) => {
    setVaccineCenters((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === vaccineCenter.id
          ? { ...item, name: vaccineCenter.name }
          : item
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
            vaccineCenter: undefined,
          });
          return true;
        }}
      >
        <VaccineCenterDialog
          VaccineCenter={selected.vaccineCenter}
          onComplete={update}
        />
      </NastranModel>
    ),
    [selected.visible]
  );
  const vaccineCenter = permissions.sub.get(
    PermissionEnum.configurations.sub.configuration_vaccine_center
  );
  const hasEdit = vaccineCenter?.edit;
  const hasAdd = vaccineCenter?.add;
  const hasView = vaccineCenter?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("new_center")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <VaccineCenterDialog onComplete={add} />
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
            </TableRow>
          ) : (
            vaccineCenters.filterList.map(
              (vaccineCenter: VaccineCenterType, index: number) => (
                <TableRowIcon
                  read={hasView}
                  remove={false}
                  edit={hasEdit}
                  onEdit={async (item: VaccineCenterType) => {
                    setSelected({
                      visible: true,
                      vaccineCenter: item,
                    });
                  }}
                  key={index}
                  item={vaccineCenter}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="font-medium">
                    {vaccineCenter.id}
                  </TableCell>
                  <TableCell>{vaccineCenter.name}</TableCell>
                </TableRowIcon>
              )
            )
          )}
        </TableBody>
      </Table>
      {dailog}
    </div>
  );
}
