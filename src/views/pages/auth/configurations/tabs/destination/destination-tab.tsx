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
import { Destination, UserPermission } from "@/database/tables";
import DestinationDialog from "./destination-dialog";
import { PermissionEnum } from "@/lib/constants";
interface DestinationTabProps {
  permissions: UserPermission;
}
export default function DestinationTab(props: DestinationTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    destination: any;
  }>({
    visible: false,
    destination: undefined,
  });
  const [destinations, setDestinations] = useState<{
    unFilterList: Destination[];
    filterList: Destination[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`complete-destinations`);
      const fetch = response.data as Destination[];
      setDestinations({
        unFilterList: fetch,
        filterList: fetch,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
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
    const filtered = destinations.unFilterList.filter((item: Destination) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setDestinations({
      ...destinations,
      filterList: filtered,
    });
  };
  const add = (destination: Destination) => {
    setDestinations((prev) => ({
      unFilterList: [destination, ...prev.unFilterList],
      filterList: [destination, ...prev.filterList],
    }));
  };
  const update = (destination: Destination) => {
    setDestinations((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === destination.id ? destination : item
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
            destination: undefined,
          });
          return true;
        }}
      >
        <DestinationDialog
          destination={selected.destination}
          onComplete={update}
        />
      </NastranModel>
    ),
    [selected.visible]
  );
  const destination = permissions.sub.get(
    PermissionEnum.configurations.sub.configuration_destination
  );
  const hasEdit = destination?.edit;
  const hasAdd = destination?.add;
  const hasView = destination?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add_reference")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <DestinationDialog onComplete={add} />
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
            <TableHead className="text-start">{t("color")}</TableHead>
            <TableHead className="text-start">{t("type")}</TableHead>
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
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ) : (
            destinations.filterList.map(
              (destination: Destination, index: number) => (
                <TableRowIcon
                  read={hasView}
                  remove={false}
                  edit={hasEdit}
                  onEdit={async (destination: Destination) => {
                    setSelected({
                      visible: true,
                      destination: destination,
                    });
                  }}
                  key={index}
                  item={destination}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="font-medium">
                    {destination.id}
                  </TableCell>
                  <TableCell>{destination.name}</TableCell>
                  <TableCell>
                    <div
                      className="h-5 w-8 rounded !bg-center !bg-cover transition-all"
                      style={{ background: destination.color }}
                    />
                  </TableCell>
                  <TableCell>{destination?.type?.name}</TableCell>
                  <TableCell>
                    {toLocaleDate(new Date(destination.created_at), state)}
                  </TableCell>
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
