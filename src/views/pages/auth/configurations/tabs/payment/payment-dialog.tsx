import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { Currency, PaymentStatus, SystemPayment } from "@/database/tables";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { PaymentStatusEnum } from "@/lib/constants";

export interface PaymentDialogProps {
  onComplete: (systemPayment: SystemPayment) => void;
}
export default function PaymentDialog(props: PaymentDialogProps) {
  const { onComplete } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    amount: number;
    currency: Currency | undefined;
    payment_status: PaymentStatus | undefined;
  }>({
    amount: 0,
    currency: undefined,
    payment_status: undefined,
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "amount",
            rules: ["required"],
          },
          {
            name: "currency",
            rules: ["required"],
          },
          {
            name: "payment_status",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("amount", userData.amount.toString());
      if (userData.currency)
        formData.append("currency_id", userData.currency?.id);
      if (userData.payment_status)
        formData.append(
          "payment_status_id",
          userData.payment_status?.id.toString()
        );
      const response = await axiosClient.post(
        "finance/payment/store",
        formData
      );
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.job);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {t("add")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["payment_status"]: selection })
          }
          lable={t("payment_status")}
          required={true}
          requiredHint={`* ${t("required")}`}
          selectedItem={userData["payment_status"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("payment_status")}
          apiUrl={"payment/statuses"}
          mode="single"
          cacheData={false}
        />
        {userData.payment_status?.id == PaymentStatusEnum.payment && (
          <>
            <CustomInput
              size_="sm"
              required={true}
              requiredHint={`* ${t("required")}`}
              placeholder={t("amount")}
              defaultValue={userData.amount}
              type="number"
              min={0}
              lable={t("amount")}
              name="amount"
              errorMessage={error.get("amount")}
              onChange={handleChange}
              startContentDark={true}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setUserData({ ...userData, ["currency"]: selection })
              }
              lable={t("currency")}
              required={true}
              requiredHint={`* ${t("required")}`}
              selectedItem={userData["currency"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("currency")}
              apiUrl={"currencies"}
              mode="single"
              cacheData={false}
            />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("cancel")}
        </Button>
        <PrimaryButton
          disabled={loading}
          onClick={store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
