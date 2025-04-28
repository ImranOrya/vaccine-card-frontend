import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Dose, Vaccine, VaccineCenter } from "@/database/tables";
import { dateObjectToString, generateUUID } from "@/lib/utils";
import { validate } from "@/validation/validation";
import { ChevronsDown, Edit, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { AddCenterPart } from "./add-center-part";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AddVaccinePartProps {
  onComplete: (vaccine: Vaccine) => boolean;
  onEditComplete: (vaccine: Vaccine) => boolean;
  editVaccine?: Vaccine;
}
const inialeVaccine = {
  vaccine: {
    id: "",
    vaccine_type: undefined,
    registration_number: "",
    volume: "",
    page: "",
    registration_date: new DateObject(new Date()),
    vaccine_center: undefined,
    doses: [],
  },
  configurations: {
    dose: "",
    batch_number: "",
    vaccine_date: new DateObject(new Date()),
    new_center: false,
  },
  refetch_centers: "no",
};
export default function AddVaccinePart(props: AddVaccinePartProps) {
  const { onComplete, editVaccine, onEditComplete } = props;
  const [userData, setUserData] = useState<{
    vaccine: Vaccine;
    configurations: {
      batch_number: string;
      vaccine_date: DateObject;
      new_center: boolean;
      dose: string;
    };
    refetch_centers: string;
  }>(inialeVaccine);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const { t } = useTranslation();
  const [state] = useGlobalState();
  useEffect(() => {
    if (editVaccine) {
      setUserData({ ...userData, vaccine: editVaccine });
    }
  }, [editVaccine]);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      vaccine: {
        ...prev.vaccine,
        [name]: value,
      },
    }));
  };
  const addDose = async () => {
    // 1. Validate
    const passed = await validate(
      [
        {
          name: "batch_number",
          rules: ["required", "max:45", "min:1"],
        },
        {
          name: "dose",
          rules: ["required"],
        },
        {
          name: "vaccine_date",
          rules: ["required"],
        },
      ],
      userData.configurations,
      setError
    );
    if (!passed) {
      return;
    }
    const newDose: Dose = {
      id: generateUUID(),
      dose: userData.configurations.dose,
      batch_number: userData.configurations.batch_number,
      vaccine_date: userData.configurations.vaccine_date,
      added_by: "",
    };
    setUserData((prev) => ({
      ...prev,
      vaccine: {
        ...prev.vaccine,
        doses: [...prev.vaccine.doses, newDose],
      },
      configurations: {
        ...prev.configurations,
        dose: "",
        batch_number: "",
        vaccine_date: new DateObject(new Date()),
      },
    }));
  };
  const removeDose = (doseIdToRemove: string) => {
    setUserData((prev) => ({
      ...prev,
      vaccine: {
        ...prev.vaccine,
        doses: prev.vaccine.doses.filter((dose) => dose.id !== doseIdToRemove),
      },
    }));
  };
  const saveVaccineToList = async () => {
    // 1. Validate
    const passed = await validate(
      [
        {
          name: "vaccine_type",
          rules: ["required"],
        },
        {
          name: "registration_date",
          rules: ["required"],
        },
        {
          name: "registration_number",
          rules: ["required"],
        },
        {
          name: "volume",
          rules: ["required"],
        },
        {
          name: "page",
          rules: ["required"],
        },
        {
          name: "vaccine_center",
          rules: ["required"],
        },
      ],
      userData.vaccine,
      setError
    );
    if (!passed) {
      return;
    }
    // 2. Validate doses
    if (userData.vaccine.doses.length == 0) {
      toast({
        toastType: "ERROR",
        title: t("dose"),
        description: t("no_dose_error"),
      });
      return;
    }

    // 3.
    let clearData = false;
    if (editVaccine) {
      clearData = onEditComplete(userData.vaccine);
    } else {
      userData.vaccine.id = generateUUID();
      clearData = onComplete(userData.vaccine);
    }
    if (clearData) setUserData(inialeVaccine);
  };
  const editDose = (dose: Dose) => {
    setUserData((prev) => ({
      ...prev,
      configurations: {
        ...prev.configurations,
        dose: dose.dose,
        batch_number: dose.batch_number,
        vaccine_date: dose.vaccine_date as DateObject,
      },
    }));
    removeDose(dose.id);
  };

  return (
    <>
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData((prev) => ({
            ...prev,
            vaccine: {
              ...prev.vaccine,
              vaccine_type: selection,
            },
          }))
        }
        lable={t("vaccine_type")}
        selectedItem={userData.vaccine?.vaccine_type?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("vaccine_type")}
        apiUrl={"vaccine-types"}
        cacheData={false}
        mode="single"
      />
      <CustomDatePicker
        placeholder={t("select_a_date")}
        lable={t("registration_date")}
        requiredHint={`* ${t("required")}`}
        required={true}
        value={userData.vaccine.registration_date}
        dateOnComplete={(date: DateObject) => {
          setUserData((prev) => ({
            ...prev,
            vaccine: {
              ...prev.vaccine,
              registration_date: date,
            },
          }));
        }}
        className="py-3 w-full"
        errorMessage={error.get("registration_date")}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("registration_number")}
        placeholder={t("enter")}
        value={userData.vaccine["registration_number"]}
        type="text"
        name="registration_number"
        errorMessage={error.get("registration_number")}
        onChange={handleChange}
        startContent={
          <FileText className="text-tertiary size-[18px] pointer-events-none" />
        }
        required={true}
        requiredHint={`* ${t("required")}`}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("volume")}
        placeholder={t("enter")}
        value={userData.vaccine["volume"]}
        type="text"
        name="volume"
        errorMessage={error.get("volume")}
        onChange={handleChange}
        startContent={
          <FileText className="text-tertiary size-[18px] pointer-events-none" />
        }
        required={true}
        requiredHint={`* ${t("required")}`}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("page")}
        placeholder={t("enter")}
        value={userData.vaccine["page"]}
        type="text"
        name="page"
        errorMessage={error.get("page")}
        onChange={handleChange}
        startContent={
          <FileText className="text-tertiary size-[18px] pointer-events-none" />
        }
        required={true}
        requiredHint={`* ${t("required")}`}
      />
      <div className="flex flex-col gap-y-2 items-end">
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          required={true}
          requiredHint={`* ${t("required")}`}
          onSelect={(selection: any) =>
            setUserData((prev) => ({
              ...prev,
              vaccine: {
                ...prev.vaccine,
                vaccine_center: selection,
              },
            }))
          }
          lable={t("vaccine_center")}
          selectedItem={userData.vaccine["vaccine_center"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("vaccine_center")}
          apiUrl={"vaccine-centers"}
          cacheData={false}
          mode="single"
          key={userData?.refetch_centers}
        />
        <CustomCheckbox
          checked={userData.configurations["new_center"]}
          onCheckedChange={(value: boolean) =>
            setUserData((prev) => ({
              ...prev,
              configurations: {
                ...prev.configurations,
                new_center: value,
              },
            }))
          }
          parentClassName="space-x-0"
          text={t("new_center")}
          required={true}
          errorMessage={error.get("new_center")}
        />
      </div>
      {userData.configurations.new_center && (
        <AddCenterPart
          onComplete={function (vaccine_center: VaccineCenter): void {
            setUserData((prev) => ({
              ...prev,
              vaccine: {
                ...prev.vaccine,
                vaccine_center: vaccine_center,
              },
              configurations: {
                ...prev.configurations,
                new_center: false,
              },
              refetch_centers: "yes",
            }));
          }}
        />
      )}
      <div className="col-span-full border-t mt-20 pt-6 relative flex flex-col gap-y-8">
        <h1 className="absolute uppercase text-tertiary font-bold ltr:text-[22px] bg-card -top-5">
          {t("dose")}
        </h1>
        <div className="flex flex-col w-full lg:w-[360px] mx-auto space-y-4">
          <CustomInput
            size_="sm"
            dir="ltr"
            className="rtl:text-end"
            lable={t("dose")}
            placeholder={t("enter")}
            value={userData.configurations.dose}
            type="number"
            name="dose"
            errorMessage={error.get("dose")}
            onChange={(e: any) => {
              const { name, value } = e.target;
              setUserData((prev) => ({
                ...prev,
                configurations: {
                  ...prev.configurations,
                  [name]: value,
                },
              }));
            }}
            startContent={
              <FileText className="text-tertiary size-[18px] pointer-events-none" />
            }
            required={true}
            requiredHint={`* ${t("required")}`}
          />
          <CustomInput
            size_="sm"
            dir="ltr"
            className="rtl:text-end"
            lable={t("batch_number")}
            placeholder={t("enter")}
            value={userData.configurations["batch_number"]}
            type="text"
            name="batch_number"
            errorMessage={error.get("batch_number")}
            onChange={(e: any) => {
              const { name, value } = e.target;
              setUserData((prev) => ({
                ...prev,
                configurations: {
                  ...prev.configurations,
                  [name]: value,
                },
              }));
            }}
            startContent={
              <FileText className="text-tertiary size-[18px] pointer-events-none" />
            }
            required={true}
            requiredHint={`* ${t("required")}`}
          />
          <CustomDatePicker
            placeholder={t("select_a_date")}
            lable={t("vaccine_date")}
            requiredHint={`* ${t("required")}`}
            required={true}
            value={userData.configurations.vaccine_date}
            dateOnComplete={(date: DateObject) => {
              setUserData((prev) => ({
                ...prev,
                configurations: {
                  ...prev.configurations,
                  vaccine_date: date,
                },
              }));
            }}
            className="py-3 w-full"
            errorMessage={error.get("vaccine_date")}
          />
          <PrimaryButton
            onClick={addDose}
            className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr mx-auto"
          >
            {t("add_dose_to_list")}
            <ChevronsDown className="text-tertiary size-[18px] transition mx-auto cursor-pointer" />
          </PrimaryButton>
        </div>
        <Table className="bg-card col-span-full w-full">
          <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr bg-primary/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-start">{t("doses")}</TableHead>
              <TableHead className="text-start">{t("batch_number")}</TableHead>
              <TableHead className="text-start">{t("vaccine_date")}</TableHead>
              <TableHead className="text-center">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
            {userData.vaccine.doses.map((dose: Dose, index: number) => (
              <TableRow key={index}>
                <TableCell className="text-start">{dose.dose}</TableCell>
                <TableCell className="text-start">
                  {dose.batch_number}
                </TableCell>
                <TableCell className="text-start">
                  {dateObjectToString(dose.vaccine_date as DateObject, state)}
                </TableCell>
                <TableCell className="flex gap-x-2 justify-center items-center">
                  <Trash2
                    onClick={() => removeDose(dose.id)}
                    className="text-red-400 size-[18px] transition cursor-pointer"
                  />
                  <Edit
                    onClick={() => editDose(dose)}
                    className="text-green-500 size-[18px] transition cursor-pointer"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PrimaryButton
        onClick={saveVaccineToList}
        className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr mx-auto col-span-full mt-16"
      >
        {editVaccine ? t("save") : t("add_vaccine_to_list")}
        <ChevronsDown className="text-tertiary size-[18px] transition mx-auto cursor-pointer" />
      </PrimaryButton>
    </>
  );
}
