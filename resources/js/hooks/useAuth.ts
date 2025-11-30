import { usePage } from "@inertiajs/react";
import { IUser } from "@/types/user.interface";

export const useAuth = () => {
  const user = usePage().props.user as IUser;

  if (!user) {
    return null;
  }

  return {
    email: user?.email,
    role: user?.role,
    id: user?.id,
    client_id: user?.client_id,
    publication_max: user?.publication_max,
  } as IUser;
};
