import { NextPage } from "next";
import Header from "../../components/header/header";
import FormArtist from "../../components/formArtist/formArtist";
import Footer from "../../components/footer/footer";

const Artist: NextPage = () => {
  return (
    <>
      <Header />
      <FormArtist />
      <Footer />
    </>
  );
};

export default Artist;
