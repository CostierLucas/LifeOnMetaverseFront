import type { NextPage } from "next";
import Artist from "../components/artist/artist";
import Banner from "../components/banner/banner";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import HelpCenter from "../components/helpcenter/helpcenter";
import Howitworks from "../components/howitworks/howitworks";
import MusicDrops from "../components/musicdrops/musicdrops";
import Showcase from "../components/showcase/showcase";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Banner />
      <Showcase />
      <Howitworks />
      <MusicDrops />
      <Artist />
      <HelpCenter />
      <Footer />
    </>
  );
};

export default Home;
