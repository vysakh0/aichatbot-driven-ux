import { useAtom } from "jotai";
import { userAtom, type UserProfile } from "@/store/user";

export function useProfile() {
  const [user, setUser] = useAtom(userAtom);

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return {
    user,
    updateProfile,
  };
}
