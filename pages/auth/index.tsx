import { NextPage } from "next";
import Header from "../../components/header/header";
import { getCsrfToken } from "next-auth/react";
import FormLogin from "../../components/formLogin/formLogin";
import { CtxOrReq } from "next-auth/client/_utils";

const Login: NextPage = () => {
  return (
    <>
      <Header />
      <FormLogin />
    </>
  );
};

export default Login;
