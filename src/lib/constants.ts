export const LanguageEnum = {
  english: "english",
  farsi: "farsi",
  pashto: "pashto",
};

export const RoleEnum = {
  epi_super: 1,
  epi_admin: 2,
  epi_user: 3,
  finance_super: 4,
  finance_admin: 5,
  finance_user: 6,
  debugger: 7,
};
export const TaskTypeEnum = {
  epi: 1,
  finance: 2,
};
export const ChecklistEnum = {
  reciept: 1,
  epi_user_letter_of_introduction: 2,
  finance_user_letter_of_introduction: 3,
  epi_letter_of_password_change: 4,
  finance_letter_of_password_change: 5,
};
export const PaymentStatusEnum = {
  payment: 1,
  no_payment: 2,
  paid: 3,
  unpaid: 4,
};

export const PermissionEnum = {
  dashboard: { name: "dashboard", sub: {} },
  users: {
    name: "users",
    sub: {
      user_information: 1,
      user_password: 2,
      user_permission: 3,
      user_profile_activity: 4,
      user_issued_certificate: 5,
      user_issued_certificate_payment: 6,
    },
  },
  vaccine_certificate: {
    name: "vaccine_certificate",
    sub: {
      vaccine_certificate_person_info: 11,
      vaccine_certificate_vaccination_info: 12,
      vaccine_certificate_card_issuing: 13,
    },
  },
  certificate_payment: {
    name: "certificate_payment",
    sub: {
      certificate_payment_info: 31,
    },
  },
  reports: { name: "reports", sub: {} },
  configurations: {
    name: "configurations",
    sub: {
      configuration_job: 21,
      configuration_destination: 22,
      configuration_vaccine_type: 23,
      configuration_vaccine_center: 24,
      configuration_payment: 25,
    },
  },
  logs: { name: "logs", sub: {} },
  audit: { name: "audit", sub: {} },
  activity: {
    name: "activity",
    sub: {
      user_activity: 41,
      self_activity: 42,
    },
  },
};
export const StatusEnum = {
  blocked: 1,
};

export const CountryEnum = {
  afghanistan: 2,
};

export const PERMISSIONS_OPERATION = ["Add", "Edit", "Delete", "View"];

export const DestinationTypeEnum = {
  muqam: "1",
  directorate: "2",
};
export const afgMonthNamesFa = [
  "حمل",
  "ثور",
  "جوزا",
  "سرطان",
  "اسد",
  "سنبله",
  "میزان",
  "عقرب",
  "قوس",
  "جدی",
  "دلو",
  "حوت",
];
export const afgMonthNamesEn = [
  "Hamal",
  "Sawr",
  "Jawza",
  "Saratan",
  "Asad",
  "Sonbola",
  "Mezan",
  "Aqrab",
  "Qaws ",
  "Jadi ",
  "Dalwa",
  "Hoot",
];
// Indexedb keys
export const CALENDAR = {
  Gregorian: "1",
  SOLAR: "2",
  LUNAR: "3",
};
export const CALENDAR_LOCALE = {
  english: "1",
  farsi: "2",
  arabic: "3",
};
export const CALENDAR_FORMAT = {
  format_1: "YYYY-MM-DD hh:mm A",
  format_2: "YYYY-MM-DD",
  format_3: "YYYY/MM/dddd",
  format_4: "dddd DD MMMM YYYY / hh:mm:ss A",
};
export const CACHE = {
  VACCINE_CERTIFICATE_TABLE_PAGINATION_COUNT: "VACCINE_CERTIFICATE_TABLE",
  USER_TABLE_PAGINATION_COUNT: "USER_TABLE",
  AUDIT_TABLE_PAGINATION_COUNT: "AUDIT_TABLE",
  USER_ACTIVITY_TABLE_PAGINATION_COUNT: "USER_ACTIVITY_TABLE",
  SYSTEM_CALENDAR: "SYSTEM_CALENDAR",
};
