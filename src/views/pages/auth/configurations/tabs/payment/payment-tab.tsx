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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { SystemPayment, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import PaymentDialog from "./payment-dialog";
import TextStatusButton from "@/components/custom-ui/button/TextStatusButton";
interface PaymentTabProps {
  permissions: UserPermission;
}
export default function PaymentTab(props: PaymentTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [systemPayments, setSystemPayments] = useState<{
    unFilterList: SystemPayment[];
    filterList: SystemPayment[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`finance/payments`);
      const fetch = response.data as SystemPayment[];
      setSystemPayments({
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
    const filtered = systemPayments.unFilterList.filter((item: SystemPayment) =>
      item.finance_user.toLowerCase().includes(value.toLowerCase())
    );
    setSystemPayments({
      ...systemPayments,
      filterList: filtered,
    });
  };
  const add = (systemPayment: SystemPayment) => {
    setSystemPayments((prev) => ({
      unFilterList: [systemPayment, ...prev.unFilterList],
      filterList: [systemPayment, ...prev.filterList],
    }));
  };

  const destination = permissions.sub.get(
    PermissionEnum.configurations.sub.configuration_destination
  );
  const hasAdd = destination?.add;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <PaymentDialog onComplete={add} />
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
            <TableHead className="text-start">{t("status")}</TableHead>
            <TableHead className="text-start">{t("amount")}</TableHead>
            <TableHead className="text-start">{t("finance_user")}</TableHead>
            <TableHead className="text-start">{t("payment_status")}</TableHead>
            <TableHead className="text-start">{t("currency")}</TableHead>
            <TableHead className="text-start">{t("created_at")}</TableHead>
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
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ) : (
            systemPayments.filterList.map(
              (systemPayment: SystemPayment, index: number) => (
                <TableRowIcon
                  read={false}
                  remove={false}
                  edit={false}
                  onEdit={async () => {}}
                  key={index}
                  item={systemPayment}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="font-medium">
                    {systemPayment.id}
                  </TableCell>
                  <TableCell>
                    <TextStatusButton
                      id={systemPayment.active}
                      value={
                        systemPayment.active == 1 ? t("active") : t("in_active")
                      }
                    />
                  </TableCell>
                  <TableCell>{systemPayment.amount}</TableCell>
                  <TableCell>{systemPayment.finance_user}</TableCell>
                  <TableCell>{systemPayment.payment_status}</TableCell>
                  <TableCell>{systemPayment.currency}</TableCell>
                  <TableCell>
                    {toLocaleDate(new Date(systemPayment.created_at), state)}
                  </TableCell>
                </TableRowIcon>
              )
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
