import type { GetServerSideProps, NextPage } from "next";
import FormEdition from "../../components/formEdition/formEdition";
import Header from "../../components/header/header";
import UpdateEdition from "../../components/updateEdition/updateEdition";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";
import styles from "./admin.module.scss";
import UserSecurity from "../../components/protect/protect";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = {
    TableName: "life-edition",
  };

  const data = await db.scan(params).promise();
  const editions = data.Items;

  return {
    props: {
      editions,
    },
  };
};

const Admin: NextPage<IEditionProps> = ({ editions }) => {
  return (
    <>
      <Header />
      {UserSecurity("admin") && (
        <section className={styles.admin}>
          <h3>Admin</h3>
          <FormEdition />
          <UpdateEdition editions={editions} />{" "}
        </section>
      )}
    </>
  );
};

export default Admin;
