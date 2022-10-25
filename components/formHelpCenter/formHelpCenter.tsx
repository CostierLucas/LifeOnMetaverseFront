import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import styles from "./formHelpCenter.module.scss";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ReactS3Client from "react-aws-s3-typescript";
import { s3Config } from "../../config/s3";
import { toast } from "react-toastify";

const FormHelpCenter: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<any>({
    email: "",
    subject: "",
    description: "",
    image: null,
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
    const { email, subject, description, image } = contactInfo;

    try {
      let imageURL = await uploadFile();

      fetch("/api/contact/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subject,
          description,
          imageURL,
        }),
      }).then((res) => {
        if (res.status == 200) {
          toast.info("Email sended!");
          setContactInfo({
            email: "",
            subject: "",
            description: "",
            image: null,
          });
        } else {
          toast.error("Email not sended");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const uploadFile = async () => {
    const s3 = new ReactS3Client(s3Config);

    try {
      const image = await s3.uploadFile(
        contactInfo.image as File,
        contactInfo.image?.name + "/" + Date.now() + "/" + contactInfo.email
      );

      return {
        image: image.location,
      };
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={styles.formHelpCenter}>
      <Form noValidate onSubmit={handleSubmit(sendEmail)}>
        <div className={styles.title}>
          <h3>Submit a request</h3>
        </div>
        <div className={styles.formGroup}>
          <label>Your email address</label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            {...register("email")}
            value={contactInfo.email}
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
            value={contactInfo.subject}
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
            value={contactInfo.description}
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
        <div className={styles.formGroup}>
          <label>Attachment</label>
          <Form.Control
            value={contactInfo.image}
            type="file"
            size="sm"
            onChange={({ target }: { target: any }) =>
              setContactInfo({ ...contactInfo, image: target.files[0] })
            }
          />
          <div className="invalid-feedback">
            {errors.description?.message as string}
          </div>
        </div>
        <div className={styles.btnSubmit}>
          <Button type="submit">SUBMIT</Button>
        </div>
      </Form>
    </div>
  );
};

export default FormHelpCenter;
