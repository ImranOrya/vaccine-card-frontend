import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { toast } from "@/components/ui/use-toast";
import { VaccineCenter } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { CountryEnum } from "@/lib/constants";
import { setServerError, validate } from "@/validation/validation";
import { FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface IAddCenterPartProps {
  onComplete: (vaccine_center: VaccineCenter) => void;
}

export function AddCenterPart(props: IAddCenterPartProps) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);

  const [center, setCenter] = useState<{
    center_name: string;
    province: { id: string; name: string } | undefined;
    district: { id: string; name: string } | undefined;
  }>({
    center_name: "",
    province: undefined,
    district: undefined,
  });
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "center_name",
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
        center,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("name", center.center_name);
      if (center.province) formData.append("province_id", center.province?.id);
      if (center.district) formData.append("district_id", center.district?.id);
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
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="col-span-full mx-auto lg:w-[360px] space-y-4">
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("center_name")}
        placeholder={t("enter")}
        value={center["center_name"]}
        type="text"
        name="center_name"
        errorMessage={error.get("center_name")}
        onChange={(e: any) => {
          const { name, value } = e.target;
          setCenter({ ...center, [name]: value });
        }}
        startContent={
          <FileText className="text-tertiary size-[18px] pointer-events-none" />
        }
        required={true}
        requiredHint={`* ${t("required")}`}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setCenter({ ...center, province: selection })
        }
        lable={t("province")}
        selectedItem={center?.province?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("province")}
        apiUrl={"provinces/" + CountryEnum.afghanistan}
        mode="single"
      />
      {center?.province && (
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) =>
            setCenter({ ...center, district: selection })
          }
          lable={t("district")}
          required={true}
          requiredHint={`* ${t("required")}`}
          selectedItem={center?.district?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("district")}
          apiUrl={"districts/" + center.province?.id}
          mode="single"
          key={center.province?.id}
        />
      )}
      <PrimaryButton
        disabled={loading}
        onClick={store}
        className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr col-span-2"
      >
        <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
      </PrimaryButton>
    </div>
  );
}
