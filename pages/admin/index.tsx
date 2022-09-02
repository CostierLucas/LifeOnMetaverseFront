import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import FormEdition from "../../components/formEdition/formEdition";
import Header from "../../components/header/header";
import UpdateEdition from "../../components/updateEdition/updateEdition";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";
import styles from "./admin.module.scss";

export const getStaticProps: GetStaticProps = async (context) => {
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
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.role !== "admin") {
      window.location.href = "/";
    }
  }, []);

  return (
    <>
      <Header />
      {session?.role === "admin" && (
        <section className={styles.admin}>
          <h3>Admin</h3>
          <UpdateEdition editions={editions} /> <FormEdition />{" "}
        </section>
      )}
    </>
  );
};

export default Admin;
