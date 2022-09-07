import { NextPage } from "next";
import Header from "../../components/header/header";
import FormLogin from "../../components/formLogin/formLogin";
import UserSecurity from "../../components/protect/protect";

const Dashboard: NextPage = () => {
  return (
    <>
      <Header />
      {UserSecurity("user") && <h1>User connected</h1>}
    </>
  );
};

export default Dashboard;
