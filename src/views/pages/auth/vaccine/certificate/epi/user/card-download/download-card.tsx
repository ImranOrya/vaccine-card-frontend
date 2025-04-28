import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { setServerError } from "@/validation/validation";
import { Check, Coins } from "lucide-react";
import CardPaymentDetail from "./steps/card-payment-detail";
import CardDownloadCompleteStep from "./steps/card-download-complete-step";

interface DownloadCardProps {
  passport_number: string;
  visit_id: string;
  onComplete: () => void;
}
export default function DownloadCard(props: DownloadCardProps) {
  const { onComplete, passport_number, visit_id } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const beforeStepSuccess = async (
    _userData: any,
    _currentStep: number,
    _setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    return true;
  };
  const stepsCompleted = async (
    userData: any,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    try {
      const response = await axiosClient.post("epi/store/reciept/document", {
        passport_number: passport_number,
        visit_id: visit_id,
        payment_number: userData.payment_number,
      });
      if (response.status == 200) {
        // path: response.data?.path,

        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete();
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
    return true;
  };
  const closeModel = () => {
    modelOnRequestHide();
  };

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex px-1 py-1 fixed w-full justify-end">
        <CloseButton dismissModel={closeModel} />
      </div>
      {/* Body */}
      <Stepper
        isCardActive={true}
        size="wrap-height"
        className="bg-transparent dark:!bg-transparent"
        progressText={{
          complete: t("complete"),
          inProgress: t("in_progress"),
          pending: t("pending"),
          step: t("step"),
        }}
        loadingText={t("store_infor")}
        backText={t("back")}
        nextText={t("next")}
        confirmText={t("confirm")}
        steps={[
          {
            description: t("vaccine_detail"),
            icon: <Coins className="size-[16px]" />,
          },
          {
            description: t("complete"),
            icon: <Check className="size-[16px]" />,
          },
        ]}
        components={[
          {
            component: <CardPaymentDetail />,
            validationRules: [{ name: "payment_number", rules: ["required"] }],
          },
          {
            component: (
              <CardDownloadCompleteStep
                visit_id={visit_id}
                successText={t("congratulation")}
                closeText={t("close")}
                closeModel={closeModel}
                description={t("card_success")}
                downloadText={t("download_card")}
                passport_number={passport_number}
              />
            ),
            validationRules: [],
          },
        ]}
        beforeStepSuccess={beforeStepSuccess}
        stepsCompleted={stepsCompleted}
      />
    </div>
  );
}
