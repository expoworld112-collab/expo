// import styles from "../../styles/signup.module.css";
// import { useState, useEffect } from 'react';
// import { signup, isAuth, preSignup } from '../../actions/auth';
// import Link from "next/link";
// import Router from 'next/router';


// const SignupComponent = () => {
//   const [values, setValues] = useState({
//       name: '',
//       username:'',
//       email: '',
//       password: '',
//       error: '',
//       loading: false,
//       message: '',
//       showForm: true
//   });



//   const { name, username, email, password, error, loading, message, showForm } = values;

//   useEffect(() => {
//     isAuth() && Router.push(`/`);
// }, []);




//   const handleSubmit = e => {
//       e.preventDefault();
//       setValues({ ...values, loading: true, error: false });
//       const user = { name, username, email, password };



//       preSignup(user).then(data => {
//           if (data && data.error) {
//               setValues({ ...values, error: data.error, loading: false });

              
//           } else {
//               setValues({
//                   ...values,
//                    name: '',
//                    username:'',
//                    email: '',                  
//                   password: '',
//                   error: '',
//                   loading: false,
//                   message: data.message,
//                   // showForm: false
//               });

//             //   function redirect() {
//             //     // Router.replace(`/${postslug}`);
//             //     Router.push(`/signin`);
//             // }
//             // setTimeout(redirect, 400)
              
//           }
//       });
//   };




//   const handleChange = name => e => {
//       setValues({ ...values, error: false, [name]: e.target.value });
//   };



//   const showLoading = () => (loading ? <div className={styles.showLoading}>Loading...</div> : '');
//   const showError = () => (error ? <div className={styles.showError}>{error}</div> : '');
//   const showMessage = () => (message ? <div className={styles.showMessage}>{message}</div> : '');



//   const signupForm = () => {
//     return (
      
//       <>
// <div className={styles.wrapper}>
//     <h1 className={styles.heading}>New User ?</h1>
//     <p className={styles.paragraph}>Please create an account <br/> with us</p>


//     <form autoComplete="off" onSubmit={handleSubmit}>
//      <input className={styles.inputs} value={name} onChange={handleChange('name')} name="name" type="text" placeholder="Name"/>
//      <input className={styles.inputs} value={username} onChange={handleChange('username')} name="username" type="text" placeholder="Username"/>
//       <input className={styles.inputs} value={email} onChange={handleChange('email')} name="email" type="text" placeholder="Email"/>
//       <input className={styles.inputs} value={password} onChange={handleChange('password')} name="password" type="password" placeholder="Password"/>
 
    
//     <button className={styles.button}>Sign Up</button>
   
//     <div className={styles.notmember}>
//       Already a member ? &nbsp; <Link href="/signin"> Sign In</Link>
//     </div>
//     </form>
//   </div>
// </>
    
//     )
//   }


//   return (
//     <div className={styles.backImg}>
//     <br/>
//     <br/>
//       {showError()}
//       {showLoading()}
//       {showMessage()}
//       {showForm && signupForm()}
//     <br/><br/>
     
//     </div>
//   )
// }

// export default SignupComponent
import styles from "../../styles/signup.module.css";
import { useState, useEffect } from "react";
import { isAuth, preSignup } from "../../actions/auth";
import Link from "next/link";
import Router from "next/router";

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const {
    name,
    username,
    email,
    password,
    error,
    loading,
    message,
    showForm,
  } = values;

  useEffect(() => {
    if (isAuth()) {
      Router.push("/");
    }
  }, []);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({
      ...prev,
      [field]: e.target.value,
      error: "",
      message: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!name || !username || !email || !password) {
      setValues((prev) => ({
        ...prev,
        error: "All fields are required",
      }));
      return;
    }

    // Optionally validate email format, length, etc.

    setValues((prev) => ({
      ...prev,
      loading: true,
      error: "",
      message: "",
    }));

    const user = { name, username, email, password };

    preSignup(user)
      .then((data) => {
        if (data && data.error) {
          setValues((prev) => ({
            ...prev,
            error: data.error || "Signup failed",
            loading: false,
          }));
        } else {
          setValues((prev) => ({
            ...prev,
            name: "",
            username: "",
            email: "",
            password: "",
            error: "",
            loading: false,
            message: data.message || "Signup successful — please check your email",
            showForm: false,
          }));
          // Optionally redirect to sign-in page
          // setTimeout(() => Router.push("/signin"), 2000);
        }
      })
      .catch((err) => {
        console.error("preSignup error:", err);
        setValues((prev) => ({
          ...prev,
          error: err.message || "Network error",
          loading: false,
        }));
      });
  };

  const showLoading = () =>
    loading ? <div className={styles.showLoading}>Loading...</div> : null;
  const showError = () =>
    error ? <div className={styles.showError}>{error}</div> : null;
  const showMessage = () =>
    message ? <div className={styles.showMessage}>{message}</div> : null;

  const signupForm = () => (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>New User?</h1>
      <p className={styles.paragraph}>
        Please create an account <br />
        with us
      </p>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          className={styles.inputs}
          value={name}
          onChange={handleChange("name")}
          name="name"
          type="text"
          placeholder="Name"
          required
        />
        <input
          className={styles.inputs}
          value={username}
          onChange={handleChange("username")}
          name="username"
          type="text"
          placeholder="Username"
          required
        />
        <input
          className={styles.inputs}
          value={email}
          onChange={handleChange("email")}
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className={styles.inputs}
          value={password}
          onChange={handleChange("password")}
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className={styles.notmember}>
          Already a member? &nbsp; <Link href="/signin">Sign In</Link>
        </div>
      </form>
    </div>
  );

  return (
    <div className={styles.backImg}>
      <br />
      <br />
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signupForm()}
      <br />
      <br />
    </div>
  );
};

export default SignupComponent;
