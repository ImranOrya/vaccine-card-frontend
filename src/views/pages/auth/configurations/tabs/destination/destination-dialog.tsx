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
import { useEffect, useMemo, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { Destination, DestinationType } from "@/database/tables";
import ColorPicker from "@/components/custom-ui/picker/color-picker";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { useGeneralAuthState } from "@/context/AuthContextProvider";

export interface DestinationDialogProps {
  onComplete: (destination: Destination) => void;
  destination?: Destination;
}
export default function DestinationDialog(props: DestinationDialogProps) {
  const { onComplete, destination } = props;
  const { user } = useGeneralAuthState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    farsi: string;
    english: string;
    pashto: string;
    type: DestinationType | undefined;
    color: string;
  }>({
    farsi: "",
    english: "",
    pashto: "",
    type: undefined,
    color: destination ? "" : "#B4D455",
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const authData = useMemo(() => {
    const isFinance = user.role.name.startsWith("finance");

    return {
      destination_add_url: isFinance
        ? "finance/destination/store"
        : "epi/destination/store",
      destination_edit_url: isFinance
        ? "finance/destination/update"
        : "epi/destination/update",
    };
  }, [user.role.name]);
  const fetch = async () => {
    try {
      const response = await axiosClient.get(`destination/${destination?.id}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (destination) fetch();
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
            name: "english",
            rules: ["required"],
          },
          {
            name: "farsi",
            rules: ["required"],
          },
          {
            name: "pashto",
            rules: ["required"],
          },
          {
            name: "type",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("english", userData.english);
      formData.append("farsi", userData.farsi);
      formData.append("pashto", userData.pashto);
      formData.append("color", userData.color);
      if (userData.type)
        formData.append("destination_type_id", userData.type.id);
      const response = await axiosClient.post(
        authData.destination_add_url,
        formData
      );
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        const destination = response.data.destination as Destination;
        if (userData.type)
          destination.type = {
            id: userData.type.id,
            name: userData.type?.name,
            created_at: userData.type?.created_at,
          };
        onComplete(destination);
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
            name: "english",
            rules: ["required"],
          },
          {
            name: "farsi",
            rules: ["required"],
          },
          {
            name: "pashto",
            rules: ["required"],
          },
          {
            name: "type",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. update
      let formData = new FormData();
      if (destination?.id) formData.append("id", destination.id);
      formData.append("english", userData.english);
      formData.append("farsi", userData.farsi);
      formData.append("pashto", userData.pashto);
      formData.append("color", userData.color);
      if (userData.type)
        formData.append("destination_type_id", userData.type.id);
      const response = await axiosClient.post(
        authData.destination_edit_url,
        formData
      );
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        const destination = response.data.destination as Destination;
        if (userData.type)
          destination.type = {
            id: userData.type.id,
            name: userData.type?.name,
            created_at: userData.type?.created_at,
          };
        onComplete(destination);
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

  return (
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {destination ? t("edit") : t("add")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <CustomInput
          size_="sm"
          dir="ltr"
          className="rtl:text-end"
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("translate_en")}
          defaultValue={userData.english}
          type="text"
          name="english"
          errorMessage={error.get("english")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("en")}
            </h1>
          }
        />
        <CustomInput
          size_="sm"
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("translate_fa")}
          defaultValue={userData.farsi}
          type="text"
          name="farsi"
          errorMessage={error.get("farsi")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("fa")}
            </h1>
          }
        />
        <CustomInput
          size_="sm"
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("translate_ps")}
          defaultValue={userData.pashto}
          type="text"
          name="pashto"
          errorMessage={error.get("pashto")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("ps")}
            </h1>
          }
        />
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["type"]: selection })
          }
          required={true}
          requiredHint={`* ${t("required")}`}
          selectedItem={userData.type?.name}
          placeHolder={t("select_type")}
          errorMessage={error.get("type")}
          apiUrl={"destination-types"}
          mode="single"
        />
        <div className="flex flex-col mt-3">
          <label className="w-fit capitalize font-semibold">{t("color")}</label>
          <ColorPicker
            gradientTitle={t("gradient")}
            solidTitle={t("solid")}
            background={userData.color}
            setBackground={(background: string) =>
              setUserData({
                ...userData,
                color: background,
              })
            }
            className=" self-start w-fit"
          />
        </div>
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
          onClick={destination ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
