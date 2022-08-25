import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import FormEdition from "../../components/formEdition/formEdition";
import Header from "../../components/header/header";

const Admin: NextPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.role !== "admin") {
      window.location.href = "/";
    }
  }, []);

  return (
    <>
      <Header />
      {session?.role === "admin" && <FormEdition />}
    </>
  );
};

export default Admin;
