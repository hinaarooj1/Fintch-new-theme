import React, { useState, useEffect } from "react";
import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { loginApi, registerApi } from "../../../Api/Service";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import LogoNew from "../../../assets/images/img/Logo - Copy.png";

function Register(props) {
  const [isloading, setisloading] = useState(false);
  const [chkbx, setchkbx] = useState(false);
  const [verifyP, setverifyP] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState('');
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const [type2, settype2] = useState("password");
  const [type1, settype1] = useState("password");

  const handleTogglePassword = () => {
    type1 === "password"
      ? settype1("text")
      : type1 === "text"
        ? settype1("password")
        : settype1("password");
  };
  const handleTogglePassword1 = () => {
    type2 === "password"
      ? settype2("text")
      : type2 === "text"
        ? settype2("password")
        : settype2("password");
  };
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    note: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    cpassword: "",
  });
  let handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUserData({ ...userData, [name]: value });

    if (userData.password.length > 6) {
      setverifyP(true);
    } else if (userData.password.length < 8) {
      setverifyP(false);
    }
  };
  let toggleagree = (e) => {
    if (e.target.checked === true) {
      setchkbx(true);
    } else if (e.target.checked === false) {
      setchkbx(false);
    }
  };


  const onSignUp = async (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };

    if (!userData.firstName.trim()) {
      errorObj.firstName = 'Password is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.password,
      })
    }
    if (!userData.lastName.trim()) {
      errorObj.lastName = 'Last Name is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.phone.trim()) {
      errorObj.phone = 'Phone is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.phone.trim()) {
      errorObj.phone = 'Phone is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.country.trim()) {
      errorObj.country = 'Country is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.postalCode.trim()) {
      errorObj.postalCode = 'Postal Code is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.city.trim()) {
      errorObj.city = 'City is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.address.trim()) {
      errorObj.address = 'Address is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (!userData.email.trim()) {
      errorObj.email = 'Email is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.email,
      })
    }
    if (userData.password === '') {
      errorObj.password = 'Password is Required';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.password,
      });
    } else if (userData.password.length < 8) {
      errorObj.password = 'Password must be at least 8 characters long';
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.password,
      });
    }
    if (userData.password != userData.cpassword) {
      errorObj.cpassword = "Password and confirm password doesn't match";
      error = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorObj.cpassword,
      })
    }

    setErrors(errorObj);
    if (error) return;
    setisloading(true)
    try {

      let data = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postalCode: userData.postalCode,
      };

      const updateHeader = await registerApi(data);

      if (updateHeader.success) {
        toast.dismiss();
        toast.info(updateHeader.msg);
        navigate("/auth/login");
      } else {
        toast.dismiss();
        toast.error(updateHeader.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.data?.msg || error?.message || "Something went wrong");
    } finally {
      setisloading(false);
    }
  }
  useEffect(() => {
    if (isAuthenticated() && authUser().user.role === "user") {
      navigate("/dashboard");
      return;
    } else if (isAuthenticated() && authUser().user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, []);
  return (
    <div className="fix-wrapper">
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6">


            <div className="card mb-0 h-auto">
              <div className="card-body">
                <div className="text-center mb-2">
                  <Link to="/">
                    <img src={LogoNew} alt="" />
                  </Link>
                </div>
                <h4 className="text-center mb-4 ">Sign up your account</h4>
                {props.errorMessage && (
                  <div className='text-danger'>
                    {props.errorMessage}
                  </div>
                )}
                {props.successMessage && (
                  <div className='text-danger'>
                    {props.successMessage}
                  </div>
                )}
                <form onSubmit={onSignUp}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      onChange={handleInput}
                      value={userData.firstName}
                      name="firstName"
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                    />
                    {errors.firstName && <div className="text-danger">{errors.firstName}</div>}

                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input

                      onChange={handleInput}
                      value={userData.lastName}
                      name="lastName"
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                    />
                    {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input

                      type="email"
                      onChange={handleInput}
                      value={userData.email}
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      onChange={handleInput}
                      type="number"
                      onFocus={() => (window.onwheel = () => false)} // Disable scrolling on focus
                      onBlur={() => (window.onwheel = null)}
                      onKeyDown={(e) =>
                        [
                          "ArrowUp",
                          "ArrowDown",
                          "e",
                          "E",
                          "+",
                          "-",
                          "*",
                          "",
                        ].includes(e.key) && e.preventDefault()
                      }
                      value={userData.phone}
                      name="phone"
                      className="form-control"
                      placeholder="Ex: 1 234 5678"

                    />
                    {errors.phone && <div className="text-danger">{errors.phone}</div>}

                  </div>
                  <div className="mb-4 relative">
                    <label className="form-label">Password</label>
                    <input className="form-control" placeholder="password"
                      type={type1}
                      onChange={handleInput}
                      value={userData.password}
                      name="password"
                    />
                    <span className={`show-pass eye `}

                      onClick={handleTogglePassword}
                    >
                      {type1 === "password" ? (
                        <i className="fa fa-eye-slash" />
                      ) : (
                        <i className="fa fa-eye" />
                      )}
                    </span>
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                  </div>
                  <div className="mb-4 relative">
                    <label className="form-label">                          Confirm Password
                    </label>
                    <input className="form-control" placeholder="password"
                      type={type2}
                      onChange={handleInput}
                      value={userData.cpassword}
                      name="cpassword"
                    />
                    <span className={`show-pass eye `}

                      onClick={handleTogglePassword1}
                    >
                      {type2 === "password" ? (
                        <i className="fa fa-eye-slash" />
                      ) : (
                        <i className="fa fa-eye" />
                      )}
                    </span>
                    {errors.cpassword && <div className="text-danger">{errors.cpassword}</div>}
                  </div>


                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input

                      type="text"
                      onChange={handleInput}
                      value={userData.country}
                      name="country"
                      placeholder="Your Coutry"
                      className="form-control"
                    />
                    {errors.country && <div className="text-danger">{errors.country}</div>}

                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      onChange={handleInput}
                      value={userData.postalCode}
                      name="postalCode"
                      placeholder="Your Postal Code"
                      className="form-control"
                    />
                    {errors.postalCode && <div className="text-danger">{errors.postalCode}</div>}

                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      onChange={handleInput}
                      value={userData.city}
                      name="city"
                      placeholder="Your City"
                      className="form-control"
                    />
                    {errors.city && <div className="text-danger">{errors.city}</div>}

                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      onChange={handleInput}
                      value={userData.address}
                      name="address"
                      placeholder="Your Address"
                      className="form-control"
                    />
                    {errors.address && <div className="text-danger">{errors.address}</div>}

                  </div>


                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      disabled={isloading}
                      className="btn btn-primary btn-block"
                    >
                      Sign me up
                    </button>
                  </div>
                </form>
                <div className="new-account mt-3">
                  <p className="">
                    Already have an account?{" "}
                    <Link className="text-primary" to="/auth/login">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


export default Register;
