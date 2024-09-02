import React, { useEffect, useState } from "react";
import { SVGICON } from '../../constant/theme';
import { useLocation } from 'react-router-dom';
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { logoutApi, getsignUserApi, getCoinsUserApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import axios from "axios";
// let path = window.location.pathname;
// path = path.split("/");
// path = path[path.length - 1];

const SidebarExtraContent = () => {
	const location = useLocation();
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
	const { pathname } = location;
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
			setAdmin(authUser().user);
			getCoins(authUser().user);

			return;
		} else if (authUser().user.role === "admin") {
			setAdmin(authUser().user);
			return;
		}
	}, []);

	return (
		<>
			<div className={`feature-box ${compare.includes(pathname) ? '' : 'style-3'}`}>
				<div className="wallet-box">
					{SVGICON.SideWalletSvgIcon}
					<div className="ms-3">
						<h4 className="text-white mb-0 d-block">{totalBalance === null ? "..." : totalBalance === 0 ? 0 : `${totalBalance}`} </h4>
						<small>Available Funds</small>
					</div>
				</div>
				<div className="wallet-box">
					{SVGICON.SideWalletSvgIcon}
					<div className="ms-3">
						<h4 className="text-white mb-0 d-block">{totalBalancePending === null ? "..." : totalBalance === 0 ? 0 : `${totalBalancePending}`} </h4>
						<small> Total Pending</small>
					</div>
				</div>

			</div>
		</>
	);
};

export default SidebarExtraContent;