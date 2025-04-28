import { useContext, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateObjectToString } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Vaccine } from "@/database/tables";
import AddVaccinePart from "../../parts/add-vaccine-part";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function AddVaccineDetail() {
  const { userData, setUserData } = useContext(StepperContext);
  const [onEdit, setOnEdit] = useState<Vaccine | undefined>();
  const { t } = useTranslation();
  const [state] = useGlobalState();

  const onVaccineComplete = (vaccine: Vaccine) => {
    const vaccines = userData.vaccines_list;
    if (vaccines) {
      const alreadyExists = vaccines.some(
        (v: any) => v?.vaccine_type?.id === vaccine?.vaccine_type?.id
      );
      if (alreadyExists) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("item_exist"),
        });
        return false;
      } else {
        setUserData((prev: any) => ({
          ...prev,
          vaccines_list: [...prev.vaccines_list, vaccine],
        }));
      }
    } else {
      setUserData((prev: any) => ({
        ...prev,
        vaccines_list: [vaccine],
      }));
    }
    // Clear inpput data
    return true;
  };
  const removeVaccine = (id: string) => {
    setUserData((prev: any) => ({
      ...prev,
      vaccines_list: prev.vaccines_list.filter(
        (vaccine: Vaccine) => vaccine.id !== id
      ),
    }));
  };
  const onEditComplete = (updatedVac: Vaccine) => {
    const vaccines = userData.vaccines_list;

    if (vaccines) {
      const alreadyExists = vaccines.some(
        (v: any) =>
          v?.vaccine_type?.id === updatedVac?.vaccine_type?.id &&
          v?.id != updatedVac.id
      );
      if (alreadyExists) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("item_exist"),
        });
        // do not clear input data
        return false;
      } else {
      }
      setUserData((prev: any) => {
        const filtered = prev.vaccines_list.filter(
          (v: Vaccine) => v.id !== updatedVac.id
        );

        return {
          ...prev,
          vaccines_list: [...filtered, updatedVac],
        };
      });
      setOnEdit(undefined);
      // Clear inpput data
    }
    return true;
  };
  const editVaccine = (vac: Vaccine) => {
    setOnEdit(vac); // Just set for editing, don't remove yet
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-baseline xl:grid-cols-3 gap-x-4 xl:gap-x-12 mt-4 gap-y-3 w-full lg:w-full">
      <AddVaccinePart
        editVaccine={onEdit}
        onEditComplete={onEditComplete}
        onComplete={onVaccineComplete}
      />
      <div className="col-span-full flex flex-col border-t mt-5 pt-6 space-y-4 pb-12 relative">
        <h1 className="absolute uppercase text-tertiary font-bold ltr:text-[22px] bg-card -top-5">
          {t("vaccines")}
        </h1>
        <Table className="bg-card rounded-md">
          <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr bg-primary/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-start px-1">
                {t("registration_number")}
              </TableHead>
              <TableHead className="text-start">{t("vaccine_type")}</TableHead>
              <TableHead className="text-start">
                {t("registration_date")}
              </TableHead>
              <TableHead className="text-center">{t("dose")}</TableHead>
              <TableHead className="text-center">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
            {userData.vaccines_list &&
              userData.vaccines_list.map((item: Vaccine) => (
                <TableRow key={item.id}>
                  <TableCell className="text-start truncate px-1 py-0">
                    {item.registration_number}
                  </TableCell>
                  <TableCell className="text-start truncate px-1 py-0">
                    {item.vaccine_type?.name}
                  </TableCell>
                  <TableCell className="text-start truncate">
                    {dateObjectToString(item.registration_date, state)}
                  </TableCell>
                  <TableCell className=" text-center truncate px-1 py-0">
                    {item.doses.length}
                  </TableCell>
                  <TableCell className="flex gap-x-2 justify-center items-center">
                    <Trash2
                      onClick={() => removeVaccine(item.id)}
                      className="text-red-400 size-[18px] transition cursor-pointer"
                    />
                    <Edit
                      onClick={() => editVaccine(item)}
                      className="text-green-500 size-[18px] transition cursor-pointer"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
