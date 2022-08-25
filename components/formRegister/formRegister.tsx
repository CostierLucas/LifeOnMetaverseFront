import { Button, Form } from "react-bootstrap";
import styles from "./formRegister.module.scss";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

interface userInfo {
  email: string;
  password: string;
  username: string;
  confirmation: string;
}

const FormRegister: React.FC = () => {
  const [userInfo, setUserInfo] = useState<userInfo>({
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
    <div className={styles.formRegister}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h3>Register</h3>
        <div className={styles.formGroup}>
          <label>Username</label>
          <Form.Control
            required
            type="text"
            placeholder="Enter username"
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, username: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter your username
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Email address</label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, email: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter your email
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, password: target.value })
            }
          />
          <Form.Control.Feedback type="invalid">
            Please enter your password
          </Form.Control.Feedback>
        </div>
        <div className={styles.formGroup}>
          <label>Confirmation password</label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, confirmation: target.value })
            }
          />

          <Form.Control.Feedback type="invalid">
            Please enter your confirmation password
          </Form.Control.Feedback>
        </div>
        <Button type="submit">SUBMIT</Button>
      </Form>
    </div>
  );
};

export default FormRegister;
