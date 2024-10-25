import { useForm } from "react-hook-form";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "/src/css/signin.css"; // Import your custom styles if necessary

function SignUpForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  function RouteLogin() {
    navigate("/login");
  }

  function SubmitForm(formData) {
    setIsLoading(true); // Start loading
    const { name, email, password } = formData;

    axios
      .post("http://localhost:8080/register", { name, email, password })
      .then((result) => {
        console.log(result);
        alert("Registration successful");
        reset(); // Reset the form after successful registration
        navigate("/login");
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          console.log("Email already in use.");
          alert(
            "This email is already registered. Please use a different one."
          );
        } else {
          console.log(err);
        }
      })
      .finally(() => {
        setIsLoading(false); // Stop loading when done
      });
  }

  return (
    <div className="login-box ">
      <h1>Sign Up Form</h1>
      <form
        onSubmit={handleSubmit(SubmitForm)}
        className="border p-4 rounded shadow"
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            name="name"
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`} // Add Bootstrap validation class
            id="name"
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
            name="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`} // Add Bootstrap validation class
            id="email"
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            name="password"
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`} // Add Bootstrap validation class
            id="password"
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="text-center mt-3">
        <button type="button" onClick={RouteLogin} className="btn btn-link">
          Already Have an Account
        </button>
      </div>
    </div>
  );
}

export default SignUpForm;
