import { NextPage } from "next";
import Header from "../../components/header/header";
import FormArtist from "../../components/formArtist/formArtist";

const Artist: NextPage = () => {
  return (
    <>
      <Header />
      <FormArtist />
    </>
  );
};

export default Artist;
