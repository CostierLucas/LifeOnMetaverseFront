import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";
import Accordion from "react-bootstrap/Accordion";
import styles from "./updateEdition.module.scss";
import { Form, Button } from "react-bootstrap";

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

const UpdateEdition: React.FC<IEditionProps> = ({ editions }) => {
  return (
    <div className={styles.update}>
      <h3>Modify edition</h3>
      <div className={styles.accordion}>
        {editions.map((edition, i: number) => (
          <Accordion defaultActiveKey="0" key={i}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Edition #{i}</Accordion.Header>
              <Accordion.Body>
                <div className={styles.formGroup}>
                  <label>Supply</label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="Enter supply"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter supply
                  </Form.Control.Feedback>
                </div>
                <div className={styles.formGroup}>
                  <label>Categories</label>
                  <Form.Control required type="text" placeholder="Diamond" />
                  <Form.Control.Feedback type="invalid">
                    Please enter supply
                  </Form.Control.Feedback>
                </div>
                <div className={styles.formGroup}>
                  <label>Base uri</label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="ipfs://cid, etc..."
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter baseURI
                  </Form.Control.Feedback>
                </div>
                <div className={styles.formGroup}>
                  <label>Price</label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="100, 100, etc..."
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter price
                  </Form.Control.Feedback>
                </div>
                <div className={styles.formGroup}>
                  <label>Percentages</label>
                  <Form.Control
                    required
                    type="number"
                    placeholder="50,50, etc..."
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter percentages
                  </Form.Control.Feedback>
                </div>
                <div className={styles.formGroup}>
                  <label>List title</label>
                  <Form.Control
                    type="text"
                    placeholder="Exclusive access to an unreleased mix of the song..."
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter list
                  </Form.Control.Feedback>
                  <Button className={styles.btnAddTitle}>Add title</Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default UpdateEdition;
