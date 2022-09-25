import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import styles from "./formHelpCenter.module.scss";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const FormHelpCenter: React.FC = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    subject: "",
    description: "",
  });
  const formSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Description is required"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const sendEmail = async () => {
    const { email, subject, description } = contactInfo;

    fetch("/api/contact/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        subject,
        description,
      }),
    });
  };

  return (
    <div className={styles.formHelpCenter}>
      <Form noValidate onSubmit={handleSubmit(sendEmail)}>
        <h3>Submit a request</h3>
        <div className={styles.formGroup}>
          <label>Your email address</label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            {...register("email")}
            onChange={({ target }: { target: any }) =>
              setContactInfo({ ...contactInfo, email: target.value })
            }
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />

          <div className="invalid-feedback">
            {errors.email?.message as string}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Subject</label>
          <Form.Control
            required
            type="text"
            {...register("subject")}
            onChange={({ target }: { target: any }) =>
              setContactInfo({ ...contactInfo, subject: target.value })
            }
            className={`form-control ${errors.subject ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">
            {errors.subject?.message as string}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <Form.Control
            required
            as="textarea"
            rows={3}
            {...register("description")}
            onChange={({ target }: { target: any }) =>
              setContactInfo({ ...contactInfo, description: target.value })
            }
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">
            {errors.description?.message as string}
          </div>
        </div>
        <Button type="submit">SUBMIT</Button>
      </Form>
    </div>
  );
};

export default FormHelpCenter;
