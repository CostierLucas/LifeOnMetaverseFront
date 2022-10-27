import { Button, Form } from "react-bootstrap";
import styles from "./formRegister.module.scss";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

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
  const formSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is mendatory"),
    password: Yup.string().password().required("Password is mendatory"),
    confirmPwd: Yup.string()
      .required("Password is mendatory")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const registerUser = async () => {
    const { email, password, username } = userInfo;

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
  };

  return (
    <div className={styles.formRegister}>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit(registerUser)}
      >
        <div className={styles.title}>
          <h3>Register</h3>
        </div>
        <div className={styles.formGroup}>
          <label>Username</label>
          <Form.Control
            required
            type="text"
            placeholder="Enter username"
            {...register("username")}
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, username: target.value })
            }
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">
            {errors.username?.message as string}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Email address</label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            {...register("email")}
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, email: target.value })
            }
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">
            {errors.email?.message as string}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            {...register("password")}
            onChange={({ target }: { target: any }) => {
              console.log(target.value);
              setUserInfo({ ...userInfo, password: target.value });
            }}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">
            {errors.password?.message as string}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Confirmation password</label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            {...register("confirmPwd")}
            onChange={({ target }: { target: any }) =>
              setUserInfo({ ...userInfo, confirmation: target.value })
            }
            className={`form-control ${errors.confirmPwd ? "is-invalid" : ""}`}
          />
        </div>
        <div className="invalid-feedback">
          {errors.confirmPwd?.message as string}
        </div>
        <div className={styles.btnSubmit}>
          <Button type="submit">SUBMIT</Button>
        </div>
      </Form>
    </div>
  );
};

export default FormRegister;
