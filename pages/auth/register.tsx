import { NextPage } from "next";
import FormRegister from "../../components/formRegister/formRegister";
import Header from "../../components/header/header";

const Register: NextPage = () => {
  return (
    <>
      <Header />
      <FormRegister />
    </>
  );
};

export default Register;
