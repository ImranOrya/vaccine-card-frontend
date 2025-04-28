import {
  ActivityModel,
  Audit,
  District,
  Province,
  Role,
  SelectUserPermission,
  SubPermission,
  UserPermission,
} from "@/database/tables";
import { DateObject } from "react-multi-date-picker";

export interface IMenuItem {
  name: string;
  key: string;
}
export interface UserInformation {
  registration_number: string;
  profile: any;
  imagePreviewUrl: any;
  full_name: string;
  username: string;
  password: string;
  email: string;
  status: boolean;
  grant: boolean;
  job: {
    id: string;
    name: string;
    selected: boolean;
  };
  role: {
    id: number;
    name: string;
    selected: boolean;
  };
  contact: string;
  destination: {
    id: string;
    name: string;
    selected: boolean;
  };
  province: {
    id: string;
    name: string;
  };
  zone: {
    id: string;
    name: string;
  };
  gender: {
    id: string;
    name: string;
  };
  permission: Map<string, SelectUserPermission>;
  allSelected: boolean;
  created_at: string;
}

export interface UserPassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
  letter_of_pass_change: FileType | undefined;
}
export type Order = "desc" | "asc";
export type UserSort =
  | "created_at"
  | "username"
  | "destination"
  | "status"
  | "job";
export type UserSearch =
  | "registration_number"
  | "username"
  | "contact"
  | "email"
  | "zone";
export interface UserFilter {
  sort: UserSort;
  order: Order;
  search: {
    column: UserSearch;
    value: string;
  };
  date: DateObject[];
}
export type EpiFinanceUser = {
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
export interface UserPaginationData {
  data: EpiFinanceUser[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type PersonCertificateSearch = "passport_number";
export interface Configuration {
  token?: string;
  type?: string;
  language?: string;
}
// Filter
export interface UserData {
  name: string;
  data: any;
}
export interface UserRecordCount {
  activeUserCount: number | null;
  inActiveUserCount: number | null;
  todayCount: number | null;
  userCount: number | null;
}
export interface AuditPaginationData {
  data: Audit[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
// Multiselector
export interface Option {
  name: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

export type IUserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  singleRow: boolean;
  visible: boolean;
  permission: string;
  icon: string;
  priority: number;
  sub: SubPermission[];
  allSelected: boolean;
};
export type UserAction = "add" | "delete" | "edit" | "view" | "singleRow";

// Application

export interface FileType {
  id: string;
  path: string;
  name: string;
  extension: string;
  size: number;
}
export interface ActivityPaginationData {
  data: ActivityModel[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type ActivitySearch = "user" | "type";
export type VaccineCenterType = {
  id: string;
  name: string;
  description?: string;
  province?: Province;
  district?: District;
};
