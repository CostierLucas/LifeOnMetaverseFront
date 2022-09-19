import { GetStaticProps, NextPage } from "next";
import Header from "../../components/header/header";
import ClaimCarousel from "../../components/claimCarousel/claimCarousel";
import UserSecurity from "../../components/protect/protect";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";

export const getStaticProps: GetStaticProps = async (context) => {
  const params = {
    TableName: "life-edition",
    ProjectionExpression: "address",
  };

  const data = await db.scan(params).promise();
  const editions = data.Items;

  return {
    props: {
      editions,
    },
  };
};

const Dashboard: NextPage<IEditionProps> = ({ editions }) => {
  return (
    <>
      <Header />
      {UserSecurity("user") && <ClaimCarousel edition={editions} />}
    </>
  );
};

export default Dashboard;
