import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import styles from "./formHelpCenter.module.scss";

const FormHelpCenter: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    username: "",
    confirmation: "",
  });
  const [validated, setValidated] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const { email, password, username } = userInfo;
    const form = e.currentTarget;
    e.preventDefault();
    setValidated(true);

    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    } else if (password !== userInfo.confirmation) {
      e.stopPropagation();
      return;
    } else {
      fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
          });
        });
    }
  };

  return (
    <div className={styles.formHelpCenter}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h3>Submit a request</h3>
        <div className={styles.formGroup}>
          <label>Your email address</label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, username: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter your username
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>What would you like to contact us about</label>
          <Form.Control
            required
            type="text"
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, email: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter your subject
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Subject</label>
          <Form.Control
            required
            type="text"
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, email: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter your subject
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <Form.Control
            required
            as="textarea"
            rows={3}
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, email: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter your description
          </Form.Control.Feedback>
        </div>
        <Button type="submit">SUBMIT</Button>
      </Form>
    </div>
  );
};

export default FormHelpCenter;
