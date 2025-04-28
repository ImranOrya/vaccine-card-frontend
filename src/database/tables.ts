import { DateObject } from "react-multi-date-picker";

export type Role =
  | { role: 1; name: "epi_super" }
  | { role: 2; name: "epi_admin" }
  | { role: 3; name: "epi_user" }
  | { role: 4; name: "finance_super" }
  | { role: 5; name: "finance_admin" }
  | { role: 6; name: "finance_user" }
  | { role: 7; name: "debugger" };

export type StatusType =
  | { active: 1 }
  | { blocked: 2 }
  | { unregistered: 3 }
  | { not_logged_in: 4 }
  | { in_progress: 5 }
  | { register_form_submited: 6 };

export type Permission = {
  name: string;
};
export interface SubPermission {
  id: number;
  name: string;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  singleRow: boolean;
}
export type UserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  visible: boolean;
  permission: string;
  icon: string;
  priority: number;
  sub: Map<number, SubPermission>;
};
export type SelectUserPermission = UserPermission & {
  allSelected: boolean;
};
export type Contact = {
  id: string;
  value: string;
  created_at: string;
};
export type Email = {
  id: string;
  value: string;
  created_at: string;
};
export type Status = {
  id: number;
  name: string;
  created_at: string;
};
export type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  status: Status;
  grant: boolean;
  profile: any;
  role: Role;
  contact: string;
  job: string;
  destination: string;
  permissions: Map<string, UserPermission>;
  created_at: string;
};

export type Notifications = {
  id: string;
  message: string;
  type: string;
  read_status: number;
  created_at: string;
};
export type Job = {
  id: string;
  name: string;
  created_at: string;
};
export type Gender = {
  id: string;
  name: string;
};
export type NidType = {
  id: string;
  name: string;
};
// APPLICATION

export type DestinationType = {
  id: string;
  name: string;
  created_at: string;
};
export type Destination = {
  id: string;
  name: string;
  color: string;
  type: DestinationType;
  created_at: string;
};

export type Country = {
  id: string;
  name: string;
};
export type District = {
  id: string;
  name: string;
};
export type Province = {
  id: string;
  name: string;
};
export type Address = {
  id: string;
  country: Country;
  province: Province;
  district: District;
  area: string;
};

export type Audit = {
  id: string;
  user_id: string;
  user: string;
  action: string;
  table: string;
  table_id: string;
  old_values: any;
  new_values: any;
  url: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
};

///////////////////////////////App
export type Epi = {
  id: string;
  registeration_number: string;
  full_name: string;
  username: string;
  email: string;
  status: number;
  grant: boolean;
  profile: any;
  role: Role;
  contact: string;
  job: string;
  destination: string;
  permissions: Map<string, UserPermission>;
  created_at: string;
  zone: string;
  province: string;
  gender: string;
};
export type Finance = {
  id: string;
  registeration_number: string;
  full_name: string;
  username: string;
  email: string;
  status: number;
  profile: any;
  role: Role;
  contact: string;
  job: string;
  destination: string;
  permissions: Map<string, UserPermission>;
  created_at: string;
  disabled_parmanently: number;
  zone: string;
  province: string;
  gender: string;
};
export type Person = {
  id: string;
  full_name: string;
  father_name: string;
  passport_number: string;
  date_of_birth: string | DateObject;
  contact: string;
  gender: { id: string; name: string };
  nationality: { id: string; name: string };
  district: { id: string; name: string };
  province: { id: string; name: string };
};
export type PersonCertificate = {
  id: string;
  passport_number: string;
  full_name: string;
  father_name: string;
  contact: string;
  gender: string;
  last_visit_date: string;
  visit_id: string;
  payment_status_id: number;
  vaccine_payment_id: number;
};

export type CertificatePayment = {
  id: string;
  passport_number: string;
  full_name: string;
  father_name: string;
  contact: string;
  payment_status_id: number;
  last_visit_date: string;
  visit_id: string;
  amount: number;
  currency: string;
};
export type VaccineType = {
  id: string;
  name: string;
  description?: string;
  doses?: string;
  created_at?: string;
};
export type VaccineCenter = {
  id: string;
  name: string;
};
export type Dose = {
  id: string;
  dose: string;
  batch_number: string;
  vaccine_date: string | DateObject;
  added_by: string;
};
export type Vaccine = {
  id: string;
  vaccine_type?: VaccineType;
  registration_number: string;
  volume: string;
  page: string;
  registration_date: DateObject;
  vaccine_center?: VaccineCenter;
  doses: Dose[];
};
export type PersonVisit = {
  vaccine_type: string;
  visited_date: string;
  travel_type: string;
  destination_country: string;
};
export type CheckList = {
  id: string;
  type: string;
  type_id: number;
  name: string;
  acceptable_extensions: string;
  active: number;
  file_size: number;
  acceptable_mimes: string;
  accept: string;
  description: string;
  saved_by: string;
  created_at: string;
};

export interface ActivityModel {
  id: string;
  profile: string;
  username: string;
  userable_type: string;
  action: string;
  ip_address: string;
  device: string;
  browser: string;
  date: string;
}
export interface SystemPayment {
  id: string;
  active: number;
  amount: number;
  finance_user: string;
  finance_user_id: string;
  payment_status: string;
  currency: string;
  created_at: string;
}
export interface Currency {
  id: string;
  name: string;
}
export interface PaymentStatus {
  id: number;
  name: string;
}
