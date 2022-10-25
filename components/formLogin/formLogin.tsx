import { Button, Form, Modal } from "react-bootstrap";
import styles from "./formLogin.module.scss";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import Router from "next/router";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);
import { useForm } from "react-hook-form";

const FormLogin: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPasswordForgotten, setIsPasswordForgotten] =
    useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  const formSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is mendatory"),
    password: Yup.string().password().required("Password is mendatory"),
    confirmPwd: Yup.string()
      .required("Password is mendatory")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
    resetCode: Yup.string().required("Reset code is mendatory"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
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

  const handleResetPassword = () => {
    fetch("/api/auth/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: resetEmail,
      }),
    }).then((res) => {
      if (res.status === 200) {
        toast.success("Email with reset code sent");
        setResetEmail("");
      } else {
        toast.error("Email not found");
      }
    });
  };

  return (
    <div className={styles.formLogin}>
      <form onSubmit={handleSubmitLogin}>
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
          <>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  required
                  value={resetEmail}
                  onChange={({ target }) => setResetEmail(target.value)}
                />
              </div>
              <Button variant="primary" onClick={() => handleResetPassword()}>
                Send reset email
              </Button>
            </form>
          </>
        )}
        {error && <p className="text-danger">{error}</p>}
        <Button type="submit">SUBMIT</Button>
      </form>
    </div>
  );
};

export default FormLogin;
