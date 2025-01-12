import { atom, useAtom } from "jotai";

type Profile = {
  name: string;
  email: string;
};

const profileAtom = atom<Profile>({
  name: "",
  email: "",
});

export function useProfile() {
  const [profile, setProfile] = useAtom(profileAtom);

  const updateProfile = async (updates: Partial<Profile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
    return updates;
  };

  return {
    profile,
    updateProfile,
  };
}
