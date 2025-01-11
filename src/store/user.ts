import { atomWithStorage } from "jotai/utils";

export interface UserProfile {
  name: string;
  email: string;
}

export const userAtom = atomWithStorage<UserProfile>("user-profile", {
  name: "",
  email: "",
});
