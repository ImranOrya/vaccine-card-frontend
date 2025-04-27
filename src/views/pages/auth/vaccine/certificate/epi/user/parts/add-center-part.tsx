import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { CountryEnum } from "@/lib/constants";
import { setServerError } from "@/validation/validation";
import { FileText, Save } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface IAddCenterPartProps {
  onComplete: () => void;
}

export function AddCenterPart(props: IAddCenterPartProps) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const [error, setError] = useState<Map<string, string>>(new Map());

  const [center, setCenter] = useState<{
    center_name: string;
    province: { id: string; name: string } | undefined;
    district: { id: string; name: string } | undefined;
  }>({
    center_name: "",
    province: undefined,
    district: undefined,
  });
  const storeCenter = async () => {
    try {
      const response = await axiosClient.post("epi/store/center", {
        center: center.center_name,
        province: center?.province?.id,
        district: center?.district?.id,
      });
      if (response.status == 200) {
        onComplete();
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
      return false;
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
        onClick={storeCenter}
        className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr col-span-2"
      >
        {t("save")}
        <Save className="text-tertiary size-[18px] transition mx-auto cursor-pointer" />
      </PrimaryButton>
    </div>
  );
}
