import { useSession } from "next-auth/react";

const UserSecurity = (role: string) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
    },
  });

  if (status === "loading") {
    console.log("Loading...");
    return false;
  }

  if (
    (status === "authenticated" && session?.role === role) ||
    session?.role === "admin"
  ) {
    console.log(`User is authenticated and has ${role} role`);
    return true;
  }
};

export default UserSecurity;
