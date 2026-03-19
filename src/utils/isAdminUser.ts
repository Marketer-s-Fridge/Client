import { UserResponseDto } from "@/features/auth/types";

export const isAdminUser = (user?: UserResponseDto | null) => {
  if (!user) return false;

  if (user.isAdmin === true) return true;

  const role = user.role;
  if (typeof role === "string" && role.toUpperCase().includes("ADMIN")) {
    return true;
  }

  return user.id?.toLowerCase() === "mf-admin";
};
