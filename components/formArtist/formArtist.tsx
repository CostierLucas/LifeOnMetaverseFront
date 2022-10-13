import { FormEvent, useState } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./formArtist.module.scss";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

const FormArtist = () => {
  const [artistInfo, setArtistInfo] = useState({
    name: "",
    email: "",
    phone: "",
    music: "rock",
    streaming: "yes",
    artwork: "yes",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, email, phone, music, streaming, artwork, description } =
      artistInfo;

    fetch("/api/formArtist/formArtist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        music,
        streaming,
        artwork,
        description,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Your message was sent successfully!");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      })
      .catch((err) => console.log(err));

    setIsLoading(false);
  };

  return (
    <div className={styles.formArtist}>
      <Form onSubmit={sendEmail}>
        <h3>Artist submission form</h3>
        <div className={styles.formGroup}>
          <label>Artist Name</label>
          <Form.Control
            type="text"
            required
            onChange={(e) =>
              setArtistInfo({ ...artistInfo, name: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label>Artist Email</label>
          <Form.Control
            type="email"
            required
            onChange={(e) =>
              setArtistInfo({ ...artistInfo, email: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label>Artist Phone</label>
          <Form.Control
            type="text"
            required
            onChange={(e) => {
              setArtistInfo({
                ...artistInfo,
                phone: e.target.value,
              });
            }}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Music genre</label>
          <select
            className="form-control"
            onChange={(e) =>
              setArtistInfo({ ...artistInfo, music: e.target.value })
            }
          >
            <option>Rock</option>
            <option>Pop</option>
            <option>Electro</option>
            <option>Classical</option>
            <option>Other</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>
            Do you own 100% of the streaming revenue rights to the song?
          </label>
          <select
            className="form-control"
            onChange={(e) =>
              setArtistInfo({ ...artistInfo, streaming: e.target.value })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>
            Do you own 100% of your artwork and have the ability to create
            derivatives?
          </label>
          <select
            className="form-control"
            onChange={(e) =>
              setArtistInfo({ ...artistInfo, artwork: e.target.value })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Is there anything else we should know about you? </label>
          <Form.Control
            as="textarea"
            rows={3}
            onChange={(e) =>
              setArtistInfo({ ...artistInfo, description: e.target.value })
            }
          />
        </div>
        <Button type="submit">
          {isLoading ? (
            <Spinner animation="border" variant="light" />
          ) : (
            "Submit"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default FormArtist;
