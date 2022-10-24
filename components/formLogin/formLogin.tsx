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
  const [show, setShow] = useState(false);
  const [isPasswordForgotten, setIsPasswordForgotten] =
    useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [passwordResetInfo, setPasswordResetInfo] = useState({
    password: "",
    confirmation: "",
    resetCode: "",
  });

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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const resetPassword = () => {
    fetch("/api/auth/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: passwordResetInfo.password,
        resetCode: passwordResetInfo.resetCode,
      }),
    }).then((res) => {
      if (res.status === 200) {
        toast.success("Password reset successful");
        setPasswordResetInfo({
          password: "",
          confirmation: "",
          resetCode: "",
        });
        handleShow();
      } else {
        toast.error("Password reset failed");
      }
    });
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
        handleShow();
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
            <form onSubmit={resetPassword}>
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
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Form noValidate validated={validated} onSubmit={resetPassword}>
                <Modal.Header closeButton>
                  <Modal.Title>Reset password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className={styles.formGroup}>
                    <label htmlFor="exampleInputEmail1">Password</label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Enter password"
                      {...register("password")}
                      onChange={({ target }: { target: any }) => {
                        setPasswordResetInfo({
                          ...passwordResetInfo,
                          password: target.value,
                        });
                      }}
                      value={passwordResetInfo.password}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirmation password</label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Enter password again"
                      {...register("confirmPwd")}
                      onChange={({ target }: { target: any }) =>
                        setPasswordResetInfo({
                          ...passwordResetInfo,
                          confirmation: target.value,
                        })
                      }
                      value={passwordResetInfo.confirmation}
                      className={`form-control ${
                        errors.confirmPwd ? "is-invalid" : ""
                      }`}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Reset Code</label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter code"
                      {...register("resetCode")}
                      onChange={({ target }: { target: any }) =>
                        setPasswordResetInfo({
                          ...passwordResetInfo,
                          resetCode: target.value,
                        })
                      }
                      value={passwordResetInfo.resetCode}
                      className={`form-control ${
                        errors.confirmPwd ? "is-invalid" : ""
                      }`}
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Reset password
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </>
        )}
        {error && <p className="text-danger">{error}</p>}
        <Button type="submit">SUBMIT</Button>
      </form>
    </div>
  );
};

export default FormLogin;
