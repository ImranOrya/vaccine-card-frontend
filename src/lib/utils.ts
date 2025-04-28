import { SubPermission, UserPermission } from "@/database/tables";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Configuration } from "./types";
import arabic_ar from "react-date-object/locales/arabic_ar";
import arabic_en from "react-date-object/locales/arabic_en";
import arabic_fa from "react-date-object/locales/arabic_fa";
import gregorian_fa from "react-date-object/locales/gregorian_fa";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import persian_ar from "react-date-object/locales/persian_ar";
import persian_en from "react-date-object/locales/persian_en";
import { CALENDAR, CALENDAR_LOCALE } from "./constants";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import persian from "react-date-object/calendars/persian";
import { DateObject } from "react-multi-date-picker";
import { toast } from "@/components/ui/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const isString = (value: any) => typeof value === "string";

export const returnPermissionsMap = (
  permissions: any
): Map<string, UserPermission> => {
  const permissionMap = new Map<string, UserPermission>();
  if (permissions != null || permissions != undefined) {
    for (let i = 0; i < permissions.length; i++) {
      const item: any = permissions[i];
      const subPermissions = item.sub as SubPermission[];
      const subMap: Map<number, SubPermission> = new Map(
        subPermissions.map((subPermission) => [subPermission.id, subPermission])
      );
      const permission: UserPermission = {
        id: item.user_permission_id,
        view: item.view,
        edit: item.edit,
        delete: item.delete,
        add: item.add,
        visible: item.visible,
        icon: item.icon,
        priority: item.priority,
        permission: item.permission,
        sub: subMap,
      };
      permissionMap.set(item.permission, permission);
    }
  }
  return permissionMap;
};

export const loadFont = async (direction: string) => {
  if (direction == "rtl") {
    document.body.style.fontFamily = "Arial";
  } else document.body.style.fontFamily = "Segoe UI";
};

export const getCalender = (calendar: string, locale: string) => {
  //
  if (calendar === CALENDAR.Gregorian) {
    if (locale === CALENDAR_LOCALE.english) {
      return {
        locale: gregorian_en,
        calender: gregorian,
        calendarId: CALENDAR.Gregorian,
        localeId: CALENDAR_LOCALE.english,
      };
    } else if (locale === CALENDAR_LOCALE.arabic) {
      return {
        locale: gregorian_ar,
        calender: gregorian,
        calendarId: CALENDAR.Gregorian,
        localeId: CALENDAR_LOCALE.arabic,
      };
    } else {
      return {
        locale: gregorian_fa,
        calender: gregorian,
        calendarId: CALENDAR.Gregorian,
        localeId: CALENDAR_LOCALE.farsi,
      };
    }
  } else if (calendar === CALENDAR.SOLAR) {
    if (locale === CALENDAR_LOCALE.english) {
      return {
        locale: persian_en,
        calender: persian,
        calendarId: CALENDAR.SOLAR,
        localeId: CALENDAR_LOCALE.english,
      };
    } else if (locale === CALENDAR_LOCALE.arabic) {
      return {
        locale: persian_ar,
        calender: persian,
        calendarId: CALENDAR.SOLAR,
        localeId: CALENDAR_LOCALE.arabic,
      };
    } else {
      return {
        locale: persian_fa,
        calender: persian,
        calendarId: CALENDAR.SOLAR,
        localeId: CALENDAR_LOCALE.farsi,
      };
    }
  } else {
    if (locale === CALENDAR_LOCALE.english) {
      return {
        locale: arabic_en,
        calender: arabic,
        calendarId: CALENDAR.LUNAR,
        localeId: CALENDAR_LOCALE.english,
      };
    } else if (locale === CALENDAR_LOCALE.arabic) {
      return {
        locale: arabic_ar,
        calender: arabic,
        calendarId: CALENDAR.LUNAR,
        localeId: CALENDAR_LOCALE.arabic,
      };
    } else {
      return {
        locale: arabic_fa,
        calender: arabic,
        calendarId: CALENDAR.LUNAR,
        localeId: CALENDAR_LOCALE.farsi,
      };
    }
  }
};
export const convertNumberToPersian = (num: number): string => {
  // Map English digits to Persian digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  // Convert the number to a string and replace each digit
  return num
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export const toLocaleDate = (date: Date, state: any) => {
  const format = state.systemLanguage.format;
  let object = { date, format };
  const gre = new DateObject(object)
    .convert(state.systemLanguage.calendar, state.systemLanguage.local)
    .format();
  return gre;
};
export const toDateFormat = (
  date: Date,
  format: string,
  local: any,
  calender: any
) => {
  let object = { date, format };
  const gre = new DateObject(object).convert(calender, local).format();
  return gre;
};
export const dateObjectToString = (date: DateObject, state: any) => {
  const gre = date
    .convert(state.systemLanguage.calendar, state.systemLanguage.local)
    .format();
  return gre;
};

export const setDateToURL = (
  queryParams: URLSearchParams,
  selectedDates: DateObject[]
) => {
  if (selectedDates.length == 1) {
    queryParams.set(
      "st_dt",
      selectedDates[0].toDate().toISOString().split("T")[0] //2025-01-01
    );
  } else if (selectedDates.length == 2) {
    queryParams.set(
      "st_dt",
      selectedDates[0].toDate().toISOString().split("T")[0] //2025-01-01
    );
    queryParams.set(
      "en_dt",
      selectedDates[1].toDate().toISOString().split("T")[0] //2025-01-01
    );
  }
};

export const setConfiguration = (data: Configuration) => {
  localStorage.setItem(
    import.meta.env.VITE_TOKEN_STORAGE_KEY,
    JSON.stringify(data)
  );
};
export const getConfiguration = (): Configuration | null => {
  const data = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY);
  if (data) return JSON.parse(data);
  else return null;
};
export const removeToken = () => {
  const configuration = getConfiguration();
  setConfiguration({
    ...configuration,
    token: undefined,
  });
};
export const setToken = (data: { token: string; type: string }) => {
  const configuration = getConfiguration();
  setConfiguration({
    ...configuration,
    token: data.token,
    type: data.type,
  });
};

export const byteTokb = (size: number) => {
  return Math.round(size / 1024) + " KB";
};

export const validateFile = (
  file: File,
  maxFileSize: number,
  validTypes: string[],
  t: any
): File | undefined => {
  if (file.size >= maxFileSize) {
    toast({
      toastType: "ERROR",
      title: t("error"),
      description: t("file_size_must_less") + maxFileSize / 1024 + "kb",
    });
    return;
  }
  /** Type validation */
  if (!validTypes.includes(file.type)) {
    toast({
      toastType: "ERROR",
      title: t("error"),
      description: t("ples_sel_vali_file") + validTypes.join(", "),
    });
    return;
  }

  return file;
};

export const generateUUID = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);
