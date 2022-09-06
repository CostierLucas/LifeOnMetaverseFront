import { useState } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import db from "../../config/db";
import { IEditionProps } from "../../interfaces/interfaces";
import Accordion from "react-bootstrap/Accordion";
import styles from "./updateEdition.module.scss";
import { Form, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const artist = e.currentTarget.artist.value;
    const title = e.currentTarget.titlee.value;
    const description = e.currentTarget.description.value;
    const categorie = e.currentTarget.type.value;
    const date = e.currentTarget.date.value;
    setIsLoading(true);

    try {
      fetch("/api/edition/modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          artist,
          title,
          description,
          categorie,
        }),
      });
      setIsLoading(false);
      setIsConfirmed(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.update}>
      <h3>Modify edition</h3>
      <div className={styles.accordion}>
        {editions.map((edition, i: number) => (
          <Accordion key={i}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Edition #{i}</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={handleUpdate}>
                  <Form.Control
                    required
                    type="text"
                    name="date"
                    placeholder="Enter artist"
                    defaultValue={edition.date}
                    hidden
                  />
                  <div className={styles.formGroup}>
                    <label>Artist</label>
                    <Form.Control
                      required
                      type="text"
                      name="artist"
                      placeholder="Enter artist"
                      defaultValue={edition.artist}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter artist
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <Form.Control
                      required
                      type="text"
                      name="titlee"
                      placeholder="Diamond"
                      defaultValue={edition.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter title
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <Form.Control
                      required
                      placeholder="Enter description"
                      name="description"
                      as="textarea"
                      rows={3}
                      defaultValue={edition.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter baseURI
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Categorie</label>
                    <Form.Select
                      aria-label="Default select example"
                      defaultValue={edition.type}
                      name="type"
                    >
                      <option value="single">Single</option>
                      <option value="album">Album</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Please enter price
                    </Form.Control.Feedback>
                  </div>
                  <div className={styles.btnSubmitModify}>
                    <Button type="submit">
                      {isLoading ? (
                        <Spinner animation="border" className="#fff" />
                      ) : (
                        "Modify collection"
                      )}
                    </Button>
                  </div>
                  <div className={styles.confirmed}>
                    {isConfirmed && <p> ✅ Collection modified </p>}
                  </div>
                  {/* <div className={styles.btnSubmitModify}>
                    <Button type="submit" variant="danger">
                      Delete collection
                    </Button>
                  </div> */}
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default UpdateEdition;
