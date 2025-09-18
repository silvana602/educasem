// logout.ts (no es server action)
import { signOut } from "next-auth/react";

export const logout = () => signOut({ callbackUrl: "/" });