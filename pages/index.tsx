import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Artist from "../components/artist/artist";
import Banner from "../components/banner/banner";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import HelpCenter from "../components/helpcenter/helpcenter";
import Howitworks from "../components/howitworks/howitworks";
import MusicDrops from "../components/musicdrops/musicdrops";
import Showcase from "../components/showcase/showcase";
import db from "../config/db";
import { IEditionProps } from "../interfaces/interfaces";

export const getStaticProps: GetStaticProps = async (context) => {
  const params = {
    TableName: "life-edition",
  };

  const data = await db.scan(params).promise();
  const editions = data.Items;

  console.log(editions);

  return {
    props: {
      editions,
    },
  };
};

const Home: NextPage<IEditionProps> = ({ editions }) => {
  return (
    <>
      <Header />
      <Banner />
      <Showcase edition={editions} />
      <Howitworks />
      <MusicDrops edition={editions} />
      <Artist />
      <HelpCenter />
      <Footer />
    </>
  );
};

export default Home;
