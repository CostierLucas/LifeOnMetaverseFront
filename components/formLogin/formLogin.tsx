import { Button } from "react-bootstrap";
import styles from "./formLogin.module.scss";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import Router from "next/router";

const FormLogin: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | undefined>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = userInfo;

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error === null) {
      Router.push("/");
    } else {
      setError(signInResult?.error);
    }
  };

  return (
    <div className={styles.formLogin}>
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        <div className={styles.formGroup}>
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required
            onChange={({ target }) =>
              setUserInfo({ ...userInfo, email: target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="exampleInputEmail1">Password</label>
          <input
            type="password"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Enter password"
            required
            onChange={({ target }) =>
              setUserInfo({ ...userInfo, password: target.value })
            }
          />
        </div>
        <Button type="submit">SUBMIT</Button>
      </form>
    </div>
  );
};

export default FormLogin;
