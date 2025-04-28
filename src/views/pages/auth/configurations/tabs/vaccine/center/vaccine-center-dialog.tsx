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
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { VaccineCenterType } from "@/lib/types";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { CountryEnum } from "@/lib/constants";

export interface VaccineCenterDialogProps {
  onComplete: (VaccineCenter: VaccineCenterType) => void;
  VaccineCenter?: VaccineCenterType;
}
export default function VaccineCenterDialog(props: VaccineCenterDialogProps) {
  const { onComplete, VaccineCenter } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<VaccineCenterType>({
    id: "",
    name: "",
    description: "",
    province: undefined,
    district: undefined,
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      const response = await axiosClient.get(
        `epi/vaccine/center/${VaccineCenter?.id}`
      );
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (VaccineCenter) fetch();
  }, []);
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
            name: "name",
            rules: ["required"],
          },
          {
            name: "province",
            rules: ["required"],
          },
          {
            name: "district",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("name", userData.name);
      if (userData.province)
        formData.append("province_id", userData.province?.id);
      if (userData.district)
        formData.append("district_id", userData.district?.id);
      const response = await axiosClient.post(
        "epi/vaccine/center/store",
        formData
      );
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.vaccine_center);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const update = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "name",
            rules: ["required"],
          },
          {
            name: "province",
            rules: ["required"],
          },
          {
            name: "district",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. update
      let formData = new FormData();
      if (VaccineCenter?.id) formData.append("id", VaccineCenter.id);
      formData.append("name", userData.name);
      if (userData.province)
        formData.append("province_id", userData.province?.id);
      if (userData.district)
        formData.append("district_id", userData.district?.id);
      const response = await axiosClient.post(
        `epi/vaccine/center/update`,
        formData
      );
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.vaccine_center);
        modelOnRequestHide();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const destrict = userData?.province && (
    <APICombobox
      placeholderText={t("search_item")}
      errorText={t("no_item")}
      onSelect={(selection: any) =>
        setUserData({ ...userData, ["district"]: selection })
      }
      lable={t("district")}
      required={true}
      selectedItem={userData["district"]?.name}
      placeHolder={t("select_a")}
      errorMessage={error.get("district")}
      apiUrl={"districts/" + userData?.province?.id}
      mode="single"
      key={userData?.province?.id}
    />
  );

  return (
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {VaccineCenter ? t("edit") : t("add")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CustomInput
          size_="sm"
          dir="ltr"
          className="rtl:text-end"
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("translate_en")}
          defaultValue={userData.name}
          type="text"
          name="name"
          errorMessage={error.get("name")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("name")}
            </h1>
          }
        />
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          required={true}
          requiredHint={`* ${t("required")}`}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["province"]: selection })
          }
          lable={t("province")}
          selectedItem={userData["province"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("province")}
          apiUrl={"provinces/" + CountryEnum.afghanistan}
          mode="single"
        />

        {destrict}
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
          onClick={VaccineCenter ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
