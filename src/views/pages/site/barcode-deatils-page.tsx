import CachedImage from "@/components/custom-ui/image/CachedImage";
import NetworkSvg from "@/components/custom-ui/image/NetworkSvg";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export function BarcodeDetailsPage() {
  let { id } = useParams();
  const { t } = useTranslation();
  const [vaccineDetails, setVaccineDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadList = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 2. Send data
      const response = await axiosClient.get("certificate/qrcode/search/" + id);
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
  useEffect(() => {}, []);
  return (
    <div className=" bg-secondary p-12">
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

        <div className="flex justify-evenly border-dashed border-b-[2px] p-4 rounded-lg mt-8">
          <div className="grid grid-cols-2 gap-y-4 w-fit place-items-start gap-x-4 p-4">
            <h1 className=" font-bold">{t("name")}:</h1>
            <h1 className=" text-primary/90">Mohammad Jan</h1>
            <h1 className=" font-bold">{t("certificate")}:</h1>
            <h1 className=" text-primary/90">MoPH-2025-00011</h1>
          </div>
          <div className="grid grid-cols-2 w-fit place-items-start gap-x-4 gap-y-4 p-4">
            <h1 className=" font-bold">{t("date_of_birth")}:</h1>
            <h1 className=" text-primary/90">2025-04-09</h1>
            <h1 className=" font-bold">{t("certificate")}:</h1>
            <h1 className=" text-primary/90">MoPH-2025-00011</h1>
          </div>
        </div>

        <div>
          <h5 className="text-xl font-semibold mb-4 text-center">
            Vaccination Details
          </h5>
          <Table className="w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableCell className="border p-2 font-semibold">
                  Vaccine
                </TableCell>
                <TableCell className="border p-2 font-semibold">
                  Vaccine Center
                </TableCell>
                <TableCell className="border p-2 font-semibold">
                  Dose 1 Date
                </TableCell>
                <TableCell className="border p-2 font-semibold">
                  Batch No 1
                </TableCell>
                <TableCell className="border p-2 font-semibold">
                  Dose 2 Date
                </TableCell>
                <TableCell className="border p-2 font-semibold">
                  Batch No 2
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {vaccineDetails.map((detail, index) => (
              <TableRow key={index}>
                <TableCell className="border p-2">{detail.vaccine}</TableCell>
                <TableCell className="border p-2">{detail.center}</TableCell>
                <TableCell className="border p-2">{detail.dose1Date}</TableCell>
                <TableCell className="border p-2">{detail.batchNo1}</TableCell>
                <TableCell className="border p-2">
                  {detail.dose2Date || "N/A"}
                </TableCell>
                <TableCell className="border p-2">
                  {detail.batchNo2 || "N/A"}
                </TableCell>
              </TableRow>
            ))} */}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
