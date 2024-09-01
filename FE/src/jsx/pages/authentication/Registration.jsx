import React, { useState,useEffect } from "react";
import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { loginApi, registerApi } from "../../../Api/Service";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

 
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
                  <Link to="/"><img src="data:image/png;base64,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" alt="" /></Link>
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
                    <input  className="form-control" placeholder="password"
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
                    <input  className="form-control" placeholder="password"
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
