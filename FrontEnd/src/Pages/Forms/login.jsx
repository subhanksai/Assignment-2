import { useForm } from "react-hook-form";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "/src/css/login.css";

function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  let navigate = useNavigate();

  function SubmitForm(formData) {
    const { email, password } = formData;

    axios
      .post("http://localhost:8080/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "Login Successfull") {
          navigate("/");
        } else {
          console.error("Login failed:", result.data);
        }
      })
      .catch((err) => console.log(err));

    reset();
  }

  return (
    <div className="login-box ">
      <h1>Log In Page</h1>
      <form
        className="border p-4 rounded shadow"
        onSubmit={handleSubmit(SubmitForm)}
      >
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          {errors.email && (
            <div className="text-danger">{errors.email.message}</div>
          )}
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
          {errors.password && (
            <div className="text-danger">{errors.password.message}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Log in
        </button>
      </form>
      <button
        style={{ marginTop: "20px" }}
        type="button"
        onClick={() => navigate("/register")}
      >
        I Don't Have an Account
      </button>
    </div>
  );
}

export default Login;
