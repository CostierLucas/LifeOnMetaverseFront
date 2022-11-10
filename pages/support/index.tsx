import { NextPage } from "next";
import Footer from "../../components/footer/footer";
import FormHelpCenter from "../../components/formHelpCenter/formHelpCenter";
import Header from "../../components/header/header";

const HelpCenter: NextPage = () => {
  return (
    <>
      <Header />
      <FormHelpCenter />
      <Footer />
    </>
  );
};

export default HelpCenter;
