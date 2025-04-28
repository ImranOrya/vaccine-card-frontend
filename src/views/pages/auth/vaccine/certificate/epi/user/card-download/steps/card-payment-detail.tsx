import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { UserRound } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function CardPaymentDetail() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col">
      <CustomInput
        parentClassName="mx-auto min-w-[380px]"
        required={true}
        lable={t("payment_number")}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        name="payment_number"
        defaultValue={userData["payment_number"]}
        placeholder={t("enter")}
        type="text"
        errorMessage={error.get("payment_number")}
        onBlur={handleChange}
        startContent={
          <UserRound className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
    </div>
  );
}
