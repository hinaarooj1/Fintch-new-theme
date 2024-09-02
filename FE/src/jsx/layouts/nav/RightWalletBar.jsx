import React, { useContext, useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import Truncate from "react-truncate-inside";
import Select from 'react-select';
import btcLogo from "../../../assets/images/img/btc-logo.svg";
import ethLogo from "../../../assets/images/img/ethereum-logo.svg";
import usdtLogo from "../../../assets/images/img/usdt-logo.svg";
import redArrow from "../../../assets/images/img/re-arriw.svg";
import DropdownBlog from '../../elements/DropdownBlog';
import { SVGICON } from '../../constant/theme';
import './style.css'
import dash from "../../../assets/images/svg/dash.svg"
import btc from "../../../assets/images/svg/btc.svg"
import eth from "../../../assets/images/svg/eth.svg"
import { ThemeContext } from '../../../context/ThemeContext';
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { logoutApi, getsignUserApi, getCoinsUserApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import axios from "axios";
const OrderTableData = [
    { price: '82.3', amount: '0.15', total: '134.12' },
    { price: '83.6', amount: '0.18', total: '237.31' },
    { price: '83.2', amount: '0.25', total: '252.58' },
    { price: '83.9', amount: '0.35', total: '126.26' },
    { price: '84.4', amount: '0.75', total: '46.92' },
    { price: '84.8', amount: '0.21', total: '123.27' },
    { price: '85.3', amount: '0.55', total: '212.56' },
    { price: '85.7', amount: '0.18', total: '129.26' },
];

const options1 = [
    { value: '1', label: 'Open this select menu' },
    { value: '2', label: 'Bank Card' },
    { value: '3', label: 'Online' },
    { value: '4', label: 'Cash On Time' },
]

const RightWalletBar = () => {
    const { setHeadWallet } = useContext(ThemeContext);
    const [depositModal, setDepositModal] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [selectImage, setSelectImage] = useState([dash, 'Albania']);
    const [selectImage2, setSelectImage2] = useState([eth, 'Ripple']);
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
            setAdmin(authUser().user);
            getCoins(authUser().user);

            return;
        } else if (authUser().user.role === "admin") {
            setAdmin(authUser().user);
            return;
        }
    }, []);

    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyClick = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.btcTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess(false);
        }, 2000);
    };
    const [copySuccess2, setCopySuccess2] = useState(false);

    const handleCopyClick2 = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.ethTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess2(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess2(false);
        }, 2000);
    };

    console.log(Admin._id);
    return (
        <div>
            {UserTransactions ?
                <div className="wallet-overlay" >
                    <div className="wallet-bar dlab-scroll" id="wallet-bar">
                        <div className="closed-icon" onClick={() => setHeadWallet(true)}>
                            <i className="fa-solid fa-xmark" />
                        </div>
                        <div className="wallet-card">
                            <div className="wallet-wrapper">
                                <div className="mb-3">
                                    <h5 className="fs-14 font-w400 mb-0">My Portfolio</h5>
                                    <h4 className="fs-24 font-w600">{totalBalance === null ? "..." : totalBalance === 0 ? 0 : `${totalBalance}`}</h4>
                                </div>
                                <div className="text-end mb-2">
                                    <span>
                                        {SVGICON.WalletCardChart}
                                    </span>
                                    <span className="fs-14 d-block">+2.25%</span>
                                </div>
                            </div>
                            <div className="change-btn-1">
                               
                                <Link to={"/assets"} className="btn btn-sm"
                                    onClick={() => setPaymentModal(true)}
                                >
                                    {SVGICON.WithdrawSvgIcon}
                                    withdrawal
                                </Link>
                            </div>
                        </div>
                        <div className="order-history">
                            <div className="card price-list-1 mb-0">
                                <div className="card-header border-0 pb-2 px-3">
                                    <div>
                                        <h4 className="text-primary card-title mb-2">Transactions</h4>
                                    </div>
                                    {/* <DropdownBlog /> */} <Link

                                        to={`/Transactions/${Admin._id}`}
                                        className="  sasa rounded-lg px-4 py-2 font-sans text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                                    >
                                        View All{" "}
                                    </Link>
                                </div>
                                <div className="card-body p-3 py-0">

                                    <div className="table-responsive">
                                        <table className="table text-center bg-primary-hover tr-rounded order-tbl mt-2 ">
                                            <thead>
                                                <tr>
                                                    <th className="text-start">Coin</th>
                                                    <th className="text-center">Type</th>
                                                    <th className="text-end">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {UserTransactions && UserTransactions.length > 0 ? (
                                                    <>
                                                        {
                                                            UserTransactions.filter(
                                                                (transaction) => !transaction.isHidden
                                                            ).map((Transaction, index) => (
                                                                <tr key={index} className='widn'>
                                                                    <td className="text-start">   {Transaction.trxName === "bitcoin" ? (
                                                                        <img src={btcLogo} alt="" />
                                                                    ) : Transaction.trxName === "ethereum" ? (
                                                                        <img src={ethLogo} alt="" />
                                                                    ) : Transaction.trxName === "tether" ? (
                                                                        <img src={usdtLogo} alt="" />
                                                                    ) : (
                                                                        ""
                                                                    )}</td>
                                                                    <td>     {Transaction.type === "withdraw" ? "Withdraw" : "Deposit"}</td>
                                                                    <td className="text-end">    {`$ ${Transaction.trxName === "bitcoin"
                                                                        ? (
                                                                            Transaction.amount * liveBtc
                                                                        ).toLocaleString(undefined, {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        })
                                                                        : Transaction.trxName === "ethereum"
                                                                            ? (
                                                                                Transaction.amount * 2241.86
                                                                            ).toLocaleString(undefined, {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            })
                                                                            : Transaction.trxName === "tether"
                                                                                ? Transaction.amount.toLocaleString(
                                                                                    undefined,
                                                                                    {
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2,
                                                                                    }
                                                                                )
                                                                                : (0).toLocaleString(undefined, {
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 2,
                                                                                })
                                                                        }`}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </>
                                                ) : <h5 className='text-center d-flex items-center' style={{textAlign:"center"}}>No Transaction Found</h5>}


                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            {UserData && UserData.btcTokenAddress ?
                                <div className="card price-list style-2 border-top border-style">
                                    <div className="card-header border-0 pb-2 px-3">
                                        <div>
                                            <h4 className="text-pink mb-0 card-title">My Wallets</h4>
                                        </div>
                                        {/* <DropdownBlog color="btn-pink" /> */}
                                        {/* <DropdownBlog /> */} <Link
                                            to={`/assets`}
                                            className="  sasa rounded-lg px-4 py-2 font-sans text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline"
                                        >
                                            Wallets
                                        </Link>
                                    </div>

                                    <div className="card-body p-3 py-0">
                                        <div className="table-responsive">
                                            <table className="table text-center bg-pink-hover tr-rounded order-tbl mt-2">
                                              
                                                <tbody>
                                                        <tr  >
                                                       

                                                      
                                                        <td className="text-start widn"> <img src={btcLogo} alt="" /></td>
                                                        <td>  <p style={{margin:"0"}} className="txt sml">
                                                            <Truncate
                                                                offset={6}
                                                                text={UserData.btcTokenAddress}
                                                                width="180"
                                                            />
                                                        </p></td>
                                                        <td className="text-end" onClick={handleCopyClick}>  {copySuccess ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                x="0px"
                                                                y="0px"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 30 30"
                                                            >
                                                                <path
                                                                    fill="white"
                                                                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <g
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                >
                                                                    <rect
                                                                        width={13}
                                                                        height={13}
                                                                        x={9}
                                                                        y={9}
                                                                        rx={2}
                                                                        ry={2}
                                                                    />
                                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                                </g>
                                                            </svg>
                                                        )}</td>
                                                        </tr>
                                                        <tr  >
                                                       

                                                      
                                                        <td className="text-start widn"> <img src={ethLogo} alt="" /></td>
                                                        <td>  <p style={{margin:"0"}} className="txt sml">
                                                            <Truncate
                                                                offset={6}
                                                                text={UserData.ethTokenAddress}
                                                                width="180"
                                                            />
                                                        </p></td>
                                                        <td className="text-end" onClick={handleCopyClick2}>  {copySuccess2 ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                x="0px"
                                                                y="0px"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 30 30"
                                                            >
                                                                <path
                                                                    fill="white"
                                                                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <g
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                >
                                                                    <rect
                                                                        width={13}
                                                                        height={13}
                                                                        x={9}
                                                                        y={9}
                                                                        rx={2}
                                                                        ry={2}
                                                                    />
                                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                                </g>
                                                            </svg>
                                                        )}</td>
                                                        </tr>
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                                : ""}
                        </div>
                    </div>
                </div > : ""}
            <div className="wallet-bar-close" onClick={() => setHeadWallet(true)}></div>
          
            
        </div>
    );
};

export default RightWalletBar;