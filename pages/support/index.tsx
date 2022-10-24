import { NextPage } from "next";
import FormHelpCenter from "../../components/formHelpCenter/formHelpCenter";
import Header from "../../components/header/header";

const HelpCenter: NextPage = () => {
  return (
    <>
      <Header />
      <FormHelpCenter />
    </>
  );
};

export default HelpCenter;
