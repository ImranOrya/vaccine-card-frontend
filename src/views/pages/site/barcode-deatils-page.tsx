import CachedImage from "@/components/custom-ui/image/CachedImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Dose } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { toDateFormat } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
interface vaccines {
  vaccine_type_name: string;
  vaccine_center: string;
  doses: Dose[];
}
export function BarcodeDetailsPage() {
  let { id } = useParams();
  const { t } = useTranslation();
  const [vaccineDetails, setVaccineDetails] = useState<
    {
      full_name: string;
      father_name: string;
      date_of_birth: string;
      passport_number: string;
      issue_date: string;
      gender: string;
      certificate_id: string;
      vaccines: vaccines[];
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const loadList = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 2. Send data
      const response = await axiosClient.get("certificate/qrcode/search/" + id);
      setVaccineDetails(response.data?.data);
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadList();
  }, []);
  return (
    <div dir="ltr" className=" bg-secondary p-12">
      <div className="relative mb-6 grid gap-8 border p-8 rounded-lg shadow-md bg-card">
        <CachedImage
          src={"images/app-logo.png"}
          alt="Avatar"
          media=""
          shimmerClassName="absolute top-6 left-4 w-20 h-20 object-contain"
          className="absolute top-6 left-4 w-20 h-20 object-contain"
          routeIdentifier={"public"}
        />
        <CachedImage
          src={"images/moph.png"}
          alt="Avatar"
          media=""
          shimmerClassName="absolute top-6 right-4 w-20 h-20 object-contain"
          className="absolute top-6 right-4 w-20 h-20 object-contain"
          routeIdentifier={"public"}
        />

        <div className="text-center mt-8">
          <h1 className="text-2xl font-bold">Islamic Emirate of Afghanistan</h1>
          <h2 className="text-xl font-semibold">Ministry of Public Health</h2>
          <h3 className="text-lg font-medium">
            General Directorate of Disease Prevention and Control
          </h3>
        </div>
        {vaccineDetails.map((item) => {
          return (
            <>
              <div className="flex justify-start gap-x-16 border-dashed border-b-[2px] p-4 rounded-lg mt-8">
                <div className="grid grid-cols-2 gap-y-2 w-fit place-items-start gap-x-4 p-4">
                  <h1 className=" font-bold">Name:</h1>
                  <h1 className=" text-primary/90">{item.full_name}</h1>
                  <div className="h-[1px] w-full bg-primary/10 col-span-2" />
                  <h1 className=" font-bold">Date of birth:</h1>
                  <h1 className=" text-primary/90">
                    {toDateFormat(
                      new Date(item.date_of_birth),
                      "YYYY-MM-DD",
                      gregorian_en,
                      gregorian
                    )}
                  </h1>
                </div>

                <div className="grid grid-cols-2 w-fit place-items-start gap-x-4 gap-y-2 p-4">
                  <h1 className=" font-bold">Father name:</h1>
                  <h1 className=" text-primary/90">{item.father_name}</h1>
                  <div className="h-[1px] w-full bg-primary/10 col-span-2" />
                  <h1 className=" font-bold">Certificate-No:</h1>
                  <h1 className=" text-primary/90">{item.certificate_id}</h1>
                </div>
                <div className="grid grid-cols-2 w-fit place-items-start gap-x-4 gap-y-2 p-4">
                  <h1 className=" font-bold">Issue date:</h1>
                  <h1 className=" text-primary/90">
                    {toDateFormat(
                      new Date(item.issue_date),
                      "YYYY-MM-DD",
                      gregorian_en,
                      gregorian
                    )}
                  </h1>
                  <div className="h-[1px] w-full bg-primary/10 col-span-2" />
                  <h1 className=" font-bold">Gender:</h1>
                  <h1 className=" text-primary/90">{item.gender}</h1>
                </div>
              </div>
              <h5 className="text-xl font-semibold mb-4 text-center uppercase">
                Vaccination Details
              </h5>
              {item.vaccines.map((vaccine, index: number) => {
                return (
                  <Table className="w-full">
                    <TableHeader className=" bg-primary/20">
                      <TableRow>
                        <TableCell className=" p-2 font-semibold text-center">
                          #
                        </TableCell>
                        <TableCell className=" p-2 font-semibold">
                          Vaccine
                        </TableCell>
                        <TableCell className=" p-2 font-semibold">
                          Vaccine Center
                        </TableCell>
                        <TableCell className=" p-2 font-semibold">
                          Doses
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="border p-2 text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="border p-2">
                          {vaccine.vaccine_type_name}
                        </TableCell>
                        <TableCell className="border p-2">
                          {vaccine.vaccine_type_name}
                        </TableCell>
                        <TableCell className=" m-0 p-0 border">
                          {vaccine.doses.map((dose) => {
                            return (
                              <Table className="w-full">
                                <TableHeader className=" bg-tertiary">
                                  <TableRow>
                                    <TableCell className="border p-2 font-semibold">
                                      Dose
                                    </TableCell>
                                    <TableCell className="border p-2 font-semibold">
                                      Batch No
                                    </TableCell>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className=" p-2">
                                      {dose.dose}
                                    </TableCell>
                                    <TableCell className=" p-2">
                                      {dose.batch_number}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            );
                          })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
}
