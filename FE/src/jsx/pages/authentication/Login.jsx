import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import { toast } from "react-toastify";
import { loginApi } from "../../../Api/Service";
import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { useAuth } from "../../../store/auth";

 
import { IMAGES } from '../../constant/theme';


function Login(props) { 
	// 
	const [isloading, setisloading] = useState(false);
	const signIn = useSignIn();
	const isAuthenticated = useIsAuthenticated();
	const authUser = useAuthUser();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [type1, settype1] = useState("password");

	const handleTogglePassword = () => {
		type1 === "password"
			? settype1("text")
			: type1 === "text"
				? settype1("password")
				: settype1("password");
	};

	const { storeTokenInLs } = useAuth();
	const onLogin = async (e)=> {
		e.preventDefault();
		let error = false;
		const errorObj = { ...errorsObj };
		if (email === '') {
			errorObj.email = 'Email is Required';
			error = true;
		}
		if (password === '') {
			errorObj.password = 'Password is Required';
			error = true;
		}
		setErrors(errorObj);
		if (error) {
			return;
		}
		setisloading(true);
		try {
			let data = { email, password };

			const updateHeader = await loginApi(data);
			let newData = updateHeader;
			if (updateHeader.success === true && updateHeader.link ===false) {
				
				
				newData = {
					success: updateHeader.success,
					token: updateHeader.token,
					user: {
						_id: updateHeader.user._id,
						address: updateHeader.user.address,
						city: updateHeader.user.city,
						country: updateHeader.user.country,
						email: updateHeader.user.email,
						kyc: updateHeader.user.kyc,
						firstName: updateHeader.user.firstName,
						lastName: updateHeader.user.lastName,
						note: updateHeader.user.note,
						phone: updateHeader.user.phone,
						postalCode: updateHeader.user.postalCode,
						role: updateHeader.user.role,
						status: updateHeader.user.status,

						verified: updateHeader.user.verified,
					},
				};
			}
			if (
				updateHeader.success && updateHeader.link === false &&
				signIn({
					token: updateHeader.token.token,
					expiresIn: 4317,
					tokenType: "Bearer",
					authState: newData,
					sameSite: false,
				})
			) {
				storeTokenInLs(updateHeader.token);
				toast.dismiss();
				toast.success(updateHeader.msg);
				if (updateHeader.user.role === "user") {
					window.location.href = "/dashboard";

					return;
				} else if (
					updateHeader.user.role === "admin" ||
					updateHeader.user.role === "subadmin"
				) {
					window.location.href = "/admin/dashboard";
					return
				}
			} else if (updateHeader.success === true && updateHeader.link === true) {
				toast.dismiss();
				toast.info(updateHeader.msg);
				console.log(updateHeader);
				setPassword("");
				return
			}else{
				toast.dismiss();
				toast.error(updateHeader.msg);
				console.log(updateHeader);
			}
		} catch (error) {
			console.log('error: ', error);
			toast.dismiss();
			toast.error(error?.data?.msg || "Something went wrong");
		} finally {
			setisloading(false);
		}

	}
	 
	useEffect(() => {

		if (isAuthenticated() && authUser().user.role === "user") {
			navigate("/dashboard");

			return;
		}
		if (isAuthenticated() && authUser().user.role === "admin") {
			navigate("/admin/dashboard");
		} else if (isAuthenticated() && authUser().user.role === "subadmin") {
			navigate("/admin/dashboard");
		}
	}, []);
	// 
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
 
   
 
  	return (
		
		<>
			<div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
				<div className="login-aside text-center  d-flex flex-column flex-row-auto">
					<div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
						<Link to='/' className="text-center mb-lg-4 mb-2 pt-5 logo">
								<img src="data:image/png;base64,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"
                  alt="" />
						</Link>

							<h3 className="mb-2 text-white">Welcome back!</h3>
							<p className="mb-4"> Login with social media or your credentials</p>
					</div>
					<div className="aside-image position-relative" style={{backgroundImage:`url(${IMAGES.BgPic2})`}}>
						<img className="img1 move-1" src={IMAGES.BgPic3} alt="" />
						<img className="img2 move-2" src={IMAGES.BgPic4} alt="" />
						<img className="img3 move-3" src={IMAGES.BgPic5} alt="" />						
					</div>
				</div>
				<div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
					<div className="d-flex justify-content-center h-100 align-items-center">
						<div className="authincation-content style-2">
							<div className="row no-gutters">
								<div className="col-xl-12 tab-content">
									<div id="sign-up" className="auth-form tab-pane fade show active  form-validation">
										<form onSubmit={onLogin}>
											<div className="text-center mb-4">
												<h3 className="text-center mb-2 text-dark">Sign In</h3>
												<span>Your Social Campaigns</span>
											</div>
											<div className="row mb-4">
												<div className="col-xl-6 col-12">
														<button disabled={true}  className="btn btn-outline-dark btn-sm btn-block">
														<svg className="me-1" width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M27.9851 14.2618C27.9851 13.1146 27.8899 12.2775 27.6837 11.4094H14.2788V16.5871H22.1472C21.9886 17.8738 21.132 19.8116 19.2283 21.1137L19.2016 21.287L23.44 24.4956L23.7336 24.5242C26.4304 22.0904 27.9851 18.5093 27.9851 14.2618Z" fill="#4285F4"/>
															<path d="M14.279 27.904C18.1338 27.904 21.37 26.6637 23.7338 24.5245L19.2285 21.114C18.0228 21.9356 16.4047 22.5092 14.279 22.5092C10.5034 22.5092 7.29894 20.0754 6.15663 16.7114L5.9892 16.7253L1.58205 20.0583L1.52441 20.2149C3.87224 24.7725 8.69486 27.904 14.279 27.904Z" fill="#34A853"/>
															<path d="M6.15656 16.7113C5.85516 15.8432 5.68072 14.913 5.68072 13.9519C5.68072 12.9907 5.85516 12.0606 6.14071 11.1925L6.13272 11.0076L1.67035 7.62109L1.52435 7.68896C0.556704 9.58024 0.00146484 11.7041 0.00146484 13.9519C0.00146484 16.1997 0.556704 18.3234 1.52435 20.2147L6.15656 16.7113Z" fill="#FBBC05"/>
															<path d="M14.279 5.3947C16.9599 5.3947 18.7683 6.52635 19.7995 7.47204L23.8289 3.6275C21.3542 1.37969 18.1338 0 14.279 0C8.69485 0 3.87223 3.1314 1.52441 7.68899L6.14077 11.1925C7.29893 7.82856 10.5034 5.3947 14.279 5.3947Z" fill="#EB4335"/>
														</svg>
														Sign in with Google
													</button>
												</div>
												<div className="col-xl-6 col-12">
													<button disabled={true} className="btn btn-outline-dark btn-sm btn-block mt-xl-0 mt-3">
														<svg className="me-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 456.008 560.035"><path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"/></svg>
														Sign in with Apple
													</button>
												</div>
											</div>
											<div className="sepertor">
												<span className="d-block mb-4 fs-13">Or with email</span>
											</div>
											{props.errorMessage && (
												<div className='text-danger p-1 my-2'>
													{props.errorMessage}
												</div>
											)}
											{props.successMessage && (
												<div className='text-danger p-1 my-2'>
													{props.successMessage}
												</div>
											)}
											<div className="mb-3">
												<label htmlFor="exampleFormControlInput1" className="form-label required">Email address</label>
												<input type="email" className="form-control"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													placeholder="Type Your Email Address"
												/>									
												{errors.email && <div className="text-danger fs-12">{errors.email}</div>}												
											</div>
												<div className="mb-3 position-relative relative">
												<label className="form-label required">Password</label>												
												<input 
														type={type1}
													className="form-control"
													value={password}
													placeholder="Type Your Password"
													onChange={(e) =>
														setPassword(e.target.value)
													}
												/>
													<span onClick={handleTogglePassword} className="show-pass   eye">
														{type1 === "password" ? (
															<i className="fa fa-eye-slash" />
														) : (
															<i className="fa fa-eye" />
														)}
												 											
												</span>
												{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
											</div>
											<div className="form-row d-flex justify-content-between mt-4 mb-2">
												<div className="mb-3">
													<div className="form-check custom-checkbox mb-0">
														<input type="checkbox" className="form-check-input" id="customCheckBox1" required="" />
														<label className="form-check-label" htmlFor="customCheckBox1">Remember my preference</label>
													</div>
												</div>												
											</div>
											<button disabled={isloading} className="btn btn-block btn-primary">Sign In</button>											
										</form>
										<div className="new-account mt-3 text-center">
												<p className="font-w500">Create an account? <Link className="text-primary" to="/auth/signup" >Sign Up</Link></p>
										</div>
									</div>
									<div className="d-flex align-items-center justify-content-center">
										{/* <Link to={"#"} className="text-primary">Terms</Link>
										<Link to={"#"} className="text-primary mx-5">Plans</Link>
										<Link to={"#"} className="text-primary">Contact Us</Link> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
  	);
};
 
export default Login;
