import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'react-bootstrap';

//Import 
import { SVGICON } from '../../constant/theme';
import MainSlider from '../../elements/dashboard/MainSlider';
import StatisticsBlog from '../../elements/dashboard/StatisticsBlog';
import MarketOverViewBlog from '../../elements/dashboard/MarketOverViewBlog';
import RecentTransaction from '../../elements/dashboard/RecentTransaction';
import { ThemeContext } from '../../../context/ThemeContext';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { toast } from 'react-toastify';
import { getCoinsUserApi, getsignUserApi } from '../../../Api/Service';
import axios from 'axios';

export function MainComponent() {
	const [modal, setModal] = useState(false);
	const [Description, setDescription] = useState("");
	const [isLoading, setisLoading] = useState(true);
	const [UserData, setUserData] = useState(true);
	const [totalBalance, settotalBalance] = useState(null);
	const [totalBalancePending, settotalBalancePending] = useState(null);
	const [fractionBalance, setfractionBalance] = useState(null);
	const [fractionBalancePending, setfractionBalancePending] = useState(null);

	const [singleTransaction, setsingleTransaction] = useState();
	const [UserTransactions, setUserTransactions] = useState([]);
	const [btcBalance, setbtcBalance] = useState(0);

	const [ethBalance, setethBalance] = useState(0);
	const [usdtBalance, setusdtBalance] = useState(0);
	const [Active, setActive] = useState(false);

	const [liveBtc, setliveBtc] = useState(null);
	const compare = ['/dashboard', '/index-2'];
	let AuthUse = useAuthUser();
	let signOut = useSignOut();
	const [isUser, setIsUser] = useState({});
	let Navigate = useNavigate();
	let toggleDrop = () => {
		drop ? setdrop(false) : setdrop(true);
	};
	const [drop, setdrop] = useState(false);
	const getsignUser = async () => {
		try {
			const formData = new FormData();
			formData.append("id", AuthUse().user._id);
			const userCoins = await getsignUserApi(formData);

			if (userCoins.success) {
				setIsUser(userCoins.signleUser);

				return;
			} else {
				toast.dismiss();
				toast.error(userCoins.msg);
			}
		} catch (error) {
			toast.dismiss();
			toast.error(error);
		} finally {
		}
	};
	let authUser = useAuthUser();
	const [Admin, setAdmin] = useState("");



	const getCoins = async (data) => {
		let id = data._id;
		try {
			const userCoins = await getCoinsUserApi(id);
			const response = await axios.get(
				"https://api.coindesk.com/v1/bpi/currentprice.json"
			);

			if (response && userCoins.success) {
				setUserData(userCoins.getCoin);
				// setUserTransactions;

				setUserTransactions(
					userCoins.getCoin.transactions.reverse().slice(0, 5)
				);
				setisLoading(false);
				// tx
				const btc = userCoins.getCoin.transactions.filter((transaction) =>
					transaction.trxName.includes("bitcoin")
				);
				const btccomplete = btc.filter((transaction) =>
					transaction.status.includes("completed")
				);
				let btcCount = 0;
				let btcValueAdded = 0;
				for (let i = 0; i < btccomplete.length; i++) {
					const element = btccomplete[i];
					btcCount = element.amount;
					btcValueAdded += btcCount;
				}
				setbtcBalance(btcValueAdded);
				// tx
				// tx
				const eth = userCoins.getCoin.transactions.filter((transaction) =>
					transaction.trxName.includes("ethereum")
				);
				const ethcomplete = eth.filter((transaction) =>
					transaction.status.includes("completed")
				);
				let ethCount = 0;
				let ethValueAdded = 0;
				for (let i = 0; i < ethcomplete.length; i++) {
					const element = ethcomplete[i];
					ethCount = element.amount;
					ethValueAdded += ethCount;
				}
				setethBalance(ethValueAdded);
				// tx
				// tx
				const usdt = userCoins.getCoin.transactions.filter((transaction) =>
					transaction.trxName.includes("tether")
				);
				const usdtcomplete = usdt.filter((transaction) =>
					transaction.status.includes("completed")
				);
				let usdtCount = 0;
				let usdtValueAdded = 0;
				for (let i = 0; i < usdtcomplete.length; i++) {
					const element = usdtcomplete[i];
					usdtCount = element.amount;
					usdtValueAdded += usdtCount;
				}
				setusdtBalance(usdtValueAdded);
				// tx
				let val = response.data.bpi.USD.rate.replace(/,/g, "");
				setliveBtc(val);
				let lakh = btcValueAdded * val;
				const totalValue = (
					lakh +
					ethValueAdded * 2241.86 +
					usdtValueAdded
				).toFixed(2);

				const [integerPart, fractionalPart] = totalValue.split(".");

				const formattedTotalValue = parseFloat(integerPart).toLocaleString(
					"en-US",
					{
						style: "currency",
						currency: "USD",
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}
				);

				//
				setfractionBalance(fractionalPart);
				settotalBalance(formattedTotalValue);

				// Pending one  // tx
				const btcPending = userCoins.getCoin.transactions.filter(
					(transaction) => transaction.trxName.includes("bitcoin")
				);
				const btccompletePending = btcPending.filter((transaction) =>
					transaction.status.includes("pending")
				);
				let btcCountPending = 0;
				let btcValueAddedPending = 0;
				for (let i = 0; i < btccompletePending.length; i++) {
					const element = btccompletePending[i];
					btcCountPending = element.amount;
					btcValueAddedPending += btcCountPending;
				}
				// tx
				// tx
				const ethPending = userCoins.getCoin.transactions.filter(
					(transaction) => transaction.trxName.includes("ethereum")
				);
				const ethcompletePending = ethPending.filter((transaction) =>
					transaction.status.includes("pending")
				);
				let ethCountPending = 0;
				let ethValueAddedPending = 0;
				for (let i = 0; i < ethcompletePending.length; i++) {
					const element = ethcompletePending[i];
					ethCountPending = element.amount;
					ethValueAddedPending += ethCountPending;
				}
				// tx
				// tx
				const usdtPending = userCoins.getCoin.transactions.filter(
					(transaction) => transaction.trxName.includes("tether")
				);
				const usdtcompletePending = usdtPending.filter((transaction) =>
					transaction.status.includes("pending")
				);
				let usdtCountPending = 0;
				let usdtValueAddedPending = 0;
				for (let i = 0; i < usdtcompletePending.length; i++) {
					const element = usdtcompletePending[i];
					usdtCountPending = element.amount;
					usdtValueAddedPending += usdtCountPending;
				}
				// tx

				let lakhPending = btcValueAddedPending * val;
				const totalValuePending = (
					lakhPending +
					ethValueAddedPending * 2241.86 +
					usdtValueAddedPending
				).toFixed(2);

				const [integerPartPending, fractionalPartPending] =
					totalValuePending.split(".");

				const formattedTotalValuePending = parseFloat(
					integerPartPending
				).toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				});

				//
				setfractionBalancePending(fractionalPartPending);
				settotalBalancePending(formattedTotalValuePending);

				return;
			} else {
				toast.dismiss();
				toast.error(userCoins.msg);
			}
		} catch (error) {
			toast.dismiss();
			toast.error(error);
		} finally {
		}
	};
	useEffect(() => {
		if (authUser().user.role === "user") {
			getsignUser()
			setAdmin(authUser().user);
			getCoins(authUser().user);

			return;
		} else if (authUser().user.role === "admin") {
			setAdmin(authUser().user);
			return;
		}
	}, []);
	return (
		<Row>
			<Col xl={12}>
				<div className="row main-card">
					<MainSlider />
				</div>
				{isUser.submitDoc && isUser.submitDoc.status === "pending" ? (<Row className="my-4">
					<Col xl={12}>
						<div className="card kyc-form-card">
							<div className="card-header">
								<h4 className="card-title">Verify Your Identity for Enhanced Security</h4>
							</div>
							<div className="card-body">
								<p>Welcome to our KYC (Know Your Customer) process! We prioritize the safety and security of our platform and aim to ensure a seamless experience for our users. The KYC process is a crucial step in maintaining a secure environment and complying with regulatory standards.</p>
								<p>In order to activate the wallet, you are required to complete your identification process.</p>
								<Alert variant="warning" dismissible className="solid alert-right-icon">
									<span><i className='mdi mdi-alert'></i></span>{" "}
									Veryify your identity ASAP!
								</Alert>
								<Link to="/flows/kyc"><Button to="/flows/kyc" variant="primary" className="mt-3"  >
									Start KYC
								</Button></Link>
							</div>
						</div>
					</Col>
				</Row>) : ""}

				<Row>
					<div className="col-xl-6">
						<div className="card crypto-chart">
							<div className="card-header pb-0 border-0 flex-wrap">
								<div className="mb-0">
									<h4 className="card-title">Crypto Statistics</h4>
									 
								</div>
								<div className="d-flex mb-2">
									<div className="form-check form-switch toggle-switch me-3">
										<label className="form-check-label" htmlFor="flexSwitchCheckChecked1">Date</label>
										<input className="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked1" defaultChecked />
									</div>
									<div className="form-check form-switch toggle-switch">
										<label className="form-check-label" htmlFor="flexSwitchCheckChecked2">Value</label>
										<input className="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked2" defaultChecked />
									</div>
								</div>
							</div>
							<StatisticsBlog />
						</div>
					</div>
					<div className="col-xl-6">
						<div className="card market-chart">
							<div className="card-header border-0 pb-0 flex-wrap">
								<div className="mb-0">
									<h4 className="card-title">Market Overview</h4> 
								</div>
								<Link to={"#"} className="btn-link text-primary get-report mb-2">
									{SVGICON.GetReportIcon}
									Get Report
								</Link>
							</div>
							<MarketOverViewBlog />
						</div>
					</div>
				</Row>
				<Col lg={12}>
					<RecentTransaction />
				</Col>
			</Col>
		</Row>
	)
}

const Home = () => {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);
	return (
		<>
			<MainComponent />
		</>
	)
}

export default Home;