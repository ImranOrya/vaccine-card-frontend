import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { IUserPermission, UserAction } from "@/lib/types";
import PermissionSub from "@/components/custom-ui/general/PermissionSub";
import { PermissionEnum } from "@/lib/constants";
import { UserPermission } from "@/database/tables";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
export interface EditUserPermissionsProps {
  permissions: UserPermission;
}

export default function EditUserPermissions(props: EditUserPermissionsProps) {
  const { t } = useTranslation();
  const { user } = useGeneralAuthState();
  const { permissions } = props;
  let { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<IUserPermission[]>([]);
  const [saving, setSaving] = useState(false);
  const authData = useMemo(() => {
    const isFinance = user.role.name.startsWith("finance");

    return {
      permission_url: isFinance
        ? "finance/user/permissions"
        : "epi/user/permissions",
      store_permission_url: isFinance
        ? "edit/finance/user/permissions"
        : "edit/epi/user/permissions",
    };
  }, [user.role.name]);
  const loadPermissions = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await axiosClient.get(
        `${authData.permission_url}/${id}`
      );
      if (response.status == 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPermissions();
  }, []);

  const savePermission = async () => {
    try {
      if (saving) return;
      setSaving(true);
      const response = await axiosClient.post(
        authData.store_permission_url,
        {
          permissions: userData,
          user_id: id,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the content type is set to JSON
          },
        }
      );
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        if (failed) {
          setFailed(false);
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    }
    setSaving(false);
  };

  const mainActions: {
    [key in UserAction]: (value: boolean, permission: string) => void;
  } = {
    add: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, add: value } : perm
      );
      setUserData(updatedUserData);
    },
    delete: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, delete: value } : perm
      );
      setUserData(updatedUserData);
    },
    edit: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, edit: value } : perm
      );
      setUserData(updatedUserData);
    },
    view: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission ? { ...perm, view: value } : perm
      );
      setUserData(updatedUserData);
    },
    singleRow: (value: boolean, permission: string) => {
      const updatedUserData = userData.map((perm) =>
        perm.permission === permission
          ? {
              ...perm,
              add: value,
              edit: value,
              delete: value,
              view: value,
              singleRow: value,
            }
          : perm
      );
      setUserData(updatedUserData);
    },
  };
  const subActions: {
    [key in UserAction]: (
      value: boolean,
      permission: string,
      subId: number
    ) => void;
  } = {
    add: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, add: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
    delete: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, delete: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
    edit: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, edit: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
    view: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId ? { ...sub, view: value } : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
    singleRow: (value: boolean, permission: string, subId: number) => {
      const updatedUserData = userData.map((perm) => {
        if (perm.permission === permission) {
          // Update the sub array with the updated SubPermission
          const updatedSub = perm.sub.map((sub) =>
            sub.id === subId
              ? {
                  ...sub,
                  add: value,
                  edit: value,
                  delete: value,
                  view: value,
                  singleRow: value,
                }
              : sub
          );
          return { ...perm, sub: updatedSub }; // Return the updated permission object
        }
        return perm; // No change for other permissions
      });
      setUserData(updatedUserData); // Update the state
    },
  };

  const hasEdit = permissions.sub.get(
    PermissionEnum.users.sub.user_information
  )?.edit;

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("update_account_permissions")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_permis_descrip")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("u_are_not_authzed!")}</h1>
        ) : loading ? (
          <NastranSpinner />
        ) : (
          <>
            {userData.map((item, index) => (
              <PermissionSub
                subActions={subActions}
                mainActions={mainActions}
                permission={item}
                key={index}
              />
            ))}
          </>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={loadPermissions}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          hasEdit &&
          !loading && (
            <PrimaryButton
              disabled={saving}
              onClick={savePermission}
              className={`shadow-md`}
            >
              <ButtonSpinner loading={saving}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
