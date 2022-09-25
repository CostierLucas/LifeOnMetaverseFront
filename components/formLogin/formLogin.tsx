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
  const [isPasswordForgotten, setIsPasswordForgotten] =
    useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = userInfo;

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error === null) {
      setError(undefined);
      Router.push("/");
    } else {
      setError(signInResult?.error);
    }
  };

  const resetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/auth/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userInfo.email,
      }),
    });
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
        <a
          onClick={() => setIsPasswordForgotten(true)}
          className={styles.btnReset}
        >
          Reset password
        </a>
        {isPasswordForgotten && (
          <form onSubmit={resetPassword}>
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
            <Button type="submit" variant="primary">
              Send reset email
            </Button>
          </form>
        )}
        {error && <p className="text-danger">{error}</p>}
        <Button type="submit">SUBMIT</Button>
      </form>
    </div>
  );
};

export default FormLogin;
