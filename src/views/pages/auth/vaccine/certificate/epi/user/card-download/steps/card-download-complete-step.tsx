import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import Downloader from "@/components/custom-ui/chooser/Downloader";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { motion } from "framer-motion";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export interface ICompleteStepProps {
  description: string;
  successText: string;
  downloadText: string;
  passport_number: string;
  visit_id: string;
  closeText: string;
  closeModel: () => void;
}

export default function CardDownloadCompleteStep(props: ICompleteStepProps) {
  const {
    description,
    closeModel,
    closeText,
    successText,
    downloadText,
    passport_number,
    visit_id,
  } = props;
  const { t } = useTranslation();
  const { userData } = useContext(StepperContext);

  return (
    <div className="flex flex-col items-center mt-8">
      <div
        className={`rounded-full transition duration-500 ease-in-out border-2 size-[80px] flex items-center justify-center py-3 bg-green-600 text-white font-bold border-green-600`}
      >
        {/* <span className=" text-white font-bold text-[32px]">&#10003;</span> */}
        <svg width="45px" height="43px" viewBox="0 0 130 85">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: 0,
              repeatType: "loop",
              repeatDelay: 0,
            }}
            strokeWidth={20}
            strokeLinecap="round"
            className=" fill-none stroke-white z-50"
            d="M10,50 l25,40 l85,-90"
          />
        </svg>
      </div>
      <h1 className="text-green-600 rtl:text-[22px] ltr:text-lg-ltr font-semibold uppercase mt-4">
        {successText}
      </h1>
      <h1 className="rtl:text-2xl-rtl font-medium text-primary ltr:text-lg-ltr mb-4">
        {description}
      </h1>
      <Downloader
        downloadText={downloadText}
        filetoDownload={{
          id: "",
          path: "",
          name: passport_number + "_card_download.pdf",
          extension: "pdf",
          size: 2212,
        }}
        errorText={t("error")}
        cancelText={t("cancel")}
        onComplete={() => {}}
        apiUrl={"epi/generate/certificate"}
        params={{
          passport_number: passport_number,
          visit_id: visit_id,
          payment_number: userData.payment_number,
        }}
      />
      <PrimaryButton
        className="rounded-md mt-14 min-w-[80px] shadow-md rtl:text-xl-rtl bg-red-500 hover:bg-red-500"
        onClick={closeModel}
      >
        {closeText}
      </PrimaryButton>
    </div>
  );
}
