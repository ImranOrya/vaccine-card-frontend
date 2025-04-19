import CustomInput from "@/components/custom-ui/input/CustomInput";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";

interface EditProfilePasswordProps {
  url: string;
}
export function EditProfilePassword(props: EditProfilePasswordProps) {
  const { url } = props;
  const { user, logoutUser, logoutEpi, logoutFinance } = useGeneralAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [passwordData, setPasswordData] = useState({
    new_password: "",
    confirm_password: "",
    old_password: "",
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  const saveData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      // 1. Validate before submission
      const result: boolean = await validate(
        [
          { name: "new_password", rules: ["required", "max:45", "min:8"] },
          { name: "confirm_password", rules: ["required", "max:45", "min:8"] },
          { name: "old_password", rules: ["required", "max:45", "min:8"] },
        ],
        passwordData,
        setError
      );
      if (!result) {
        setLoading(false);
        return;
      }

      // 2. Add data
      const formData = new FormData();
      formData.append("new_password", passwordData.new_password);
      formData.append("old_password", passwordData.old_password);
      formData.append("confirm_password", passwordData.confirm_password);
      const response = await axiosClient.post(url, formData);
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
        // If user changed his password he must login again
        if (user.role.name.startsWith("epi")) {
          await logoutEpi();
        } else if (user.role.name.startsWith("finance")) {
          await logoutFinance();
        } else {
          await logoutUser();
        }
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("update_account_password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_pass_descrip")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-x-4 gap-y-6 w-full lg:w-1/2 2xl:h-1/3">
        <CustomInput
          size_="sm"
          lable={t("password")}
          name="old_password"
          defaultValue={passwordData.old_password}
          onChange={handleChange}
          placeholder={t("old_password")}
          errorMessage={error.get("old_password")}
          type={"password"}
        />
        <CustomInput
          size_="sm"
          name="new_password"
          defaultValue={passwordData.new_password}
          onChange={handleChange}
          lable={t("new_password")}
          placeholder={t("new_password")}
          errorMessage={error.get("new_password")}
          type={"password"}
        />
        <CustomInput
          size_="sm"
          name="confirm_password"
          defaultValue={passwordData.confirm_password}
          onChange={handleChange}
          placeholder={t("confirm_password")}
          lable={t("confirm_password")}
          errorMessage={error.get("confirm_password")}
          type={"password"}
        />
      </CardContent>
      <CardFooter>
        <PrimaryButton
          onClick={async () => {
            await saveData();
          }}
          className={`shadow-lg`}
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
