import React, { useEffect, useState } from "react";
import SideBar from "../../layout/UserSidebar/SideBar";
import Log from "../../assets/img/log.jpg";
import {
    createUserTransactionApi,
    createUserTransactionMethodApi,
    getCoinsUserApi,
    getsignUserApi,
} from "../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { useNavigate, Link, NavLink } from "react-router-dom";
import UserHeader from "./UserHeader";
import axios from "axios";
const Assets = () => {
    const [Active, setActive] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [btcBalance, setbtcBalance] = useState(0);
    const [isDisable, setisDisable] = useState(false);

    const [UserData, setUserData] = useState(true);
    const [fractionBalance, setfractionBalance] = useState("00");
    const [ethBalance, setethBalance] = useState(0);
    const [usdtBalance, setusdtBalance] = useState(0);
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };

    const [liveBtc, setliveBtc] = useState(null);

    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [isUser, setIsUser] = useState({});
    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
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
    //
    const getCoins = async (data) => {
        let id = data._id;
        try {
            const response = await axios.get(
                "https://api.coindesk.com/v1/bpi/currentprice.json"
            );
            const userCoins = await getCoinsUserApi(id);

            if (response && userCoins.success) {
                setUserData(userCoins.getCoin);
                // setUserTransactions;
                let val = response.data.bpi.USD.rate.replace(/,/g, "");
                console.log("val: ", val);
                setliveBtc(val);
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

                const totalValue = (
                    btcValueAdded * liveBtc +
                    ethValueAdded * 2241.86 +
                    usdtValueAdded
                ).toFixed(2);

                //
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
    //
    const [selectedPayment, setSelectedPayment] = useState(null); // State to store the selected payment method

    // Function to handle selection change in the dropdown menu
    const handlePaymentSelection = (event) => {
        const selectedValue = event.target.value;
        console.log("selectedValue: ", selectedValue);
        if (selectedValue === "Select a Payment Method") {
            setSelectedPayment(null); // Set selected payment to null if the first option is selected
        } else {
            setSelectedPayment(selectedValue); // Otherwise, update the selected payment state with the value of the selected option
        }
    };

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
    const [copySuccess3, setCopySuccess3] = useState(false);

    const handleCopyClick3 = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.usdtTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess3(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess3(false);
        }, 2000);
    };

    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "user") {
            getCoins(authUser().user);
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    // withdraw
    const [modal3, setModal3] = useState(false);
    const [depositName, setdepositName] = useState("");

    const [transactionDetail, settransactionDetail] = useState({
        amountMinus: "",
        txId: "",
    });
    const [transactionDetailId, settransactionDetailId] = useState({
        amountMinus: "",
        txId: "",
    });
    let handleTransactionId = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        settransactionDetailId({ ...transactionDetailId, [name]: value });
    };
    let handleTransaction = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        // Assuming depositBalance is a state variable representing the available balance for the selected deposit type
        let depositBalance;
        if (depositName === "bitcoin") {
            depositBalance = btcBalance.toFixed(8);
        } else if (depositName === "ethereum") {
            depositBalance = ethBalance.toFixed(8);
        } else if (depositName === "tether") {
            depositBalance = usdtBalance.toFixed(8);
        }

        // Allow only up to 9 digits
        const sanitizedValue = value.replace(/[^0-9.]/g, "").slice(0, 9);

        // Parse values to float for comparison
        const enteredValue = parseFloat(sanitizedValue);
        const maxBalance = parseFloat(depositBalance);

        // Check if enteredValue is less than or equal to depositBalance
        if (!isNaN(enteredValue) && enteredValue <= maxBalance) {
            settransactionDetail({ ...transactionDetail, [name]: sanitizedValue });
        } else if (sanitizedValue === "") {
            // If the input is cleared, set the value to an empty string
            settransactionDetail({ ...transactionDetail, [name]: "" });
        } else {
            // If enteredValue is greater than depositBalance or not a valid number, set the value to depositBalance
            settransactionDetail({ ...transactionDetail, [name]: depositBalance });
        }
    };
    let tetherDepositMinus = () => {
        setdepositName("tether");
        setModal3(true);
    };

    let btcDepositMinus = () => {
        setdepositName("bitcoin");
        setModal3(true);
    };
    let ethDepositMinus = () => {
        setdepositName("ethereum");

        setModal3(true);
    };
    let closeDeposit = () => {
        setdepositName("");
        settransactionDetail({
            amountMinus: 0,
        });
        settransactionDetailId({
            txId: "",
        });
        setModal3(false);
    };

    const postUserTransaction = async (e) => {
        console.log("Value of e:", e);

        try {
            let id = authUser().user._id;
            setisDisable(true);

            if (
                parseFloat(transactionDetail.amountMinus) <= 0 ||
                transactionDetail.amountMinus.trim() === "00" ||
                transactionDetail.amountMinus.trim() === "0.000"
            ) {
                toast.dismiss();
                toast.error(
                    "Transaction amount must be a positive value and cannot be equal to zero"
                );
                return;
            }
            let body;
            if (e == "crypto") {
                body = {
                    trxName: depositName,
                    amount: -transactionDetail.amountMinus,
                    txId: transactionDetailId.txId,
                    e: e,
                };
                if (!body.trxName || !body.amount || !body.txId) {
                    console.log("body.amount: ", body.amount);
                    console.log("body.trxName: ", body.trxName);
                    toast.dismiss();
                    toast.error("Fill all the required fields");
                    return;
                }
            } else if (e == "bank") {
                body = {
                    trxName: depositName,
                    amount: -transactionDetail.amountMinus,
                    selectedPayment: selectedPayment,
                    e: e,
                };
                if (!body.trxName || !body.amount) {
                    toast.dismiss();
                    toast.error("Fill all the required fields");
                    return;
                }
                if (selectedPayment === null) {
                    toast.dismiss();
                    toast.error("Please select a Payment Method");
                    return;
                }
            }

            const newTransaction = await createUserTransactionApi(id, body);

            if (newTransaction.success) {
                setSelectedPayment(null);
                toast.dismiss();
                toast.success(newTransaction.msg);

                closeDeposit();
            } else {
                toast.dismiss();
                toast.error(newTransaction.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
        }
    };

    const [activeBank, setactiveBank] = useState(false);
    let activeCrypto = () => {
        setactiveBank(false);
    };
    let activeBankOne = () => {
        setactiveBank(true);
    };

    return (
        <div className="dark user-bg">
            <div>
                <div className="pb-20">
                    <SideBar state={Active} toggle={toggleBar} />{" "}
                    <button
                        onClick={toggleBar}
                        type="button"
                        className="flex for-mbl h-10 w-10 items-center justify-center mb- -ms-3 abspain"
                    >
                        <div className="relative h-5 w-5">
                            <span className="bg-primary-500 absolute block h-0.5 w-full transition-all duration-300 top-0.5 top-0.5" />
                            <span className="bg-primary-500 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300" />
                            <span className="bg-primary-500 absolute block h-0.5 w-full transition-all duration-300 bottom-0 bottom-0" />
                        </div>
                    </button>
                    <div className=" relative min-h-screen w-full fall overflow-x-hidden pe-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_250px)] lg:ms-[250px]">
                        <div className="mx-auto w-full max-w-7xl">
                            {isLoading ? (
                                <div className="mx-auto loading-pg w-full text-center max-w-xs">
                                    <div className="mx-auto max-w-xs">
                                        <svg
                                            data-v-cd102a71
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            aria-hidden="true"
                                            role="img"
                                            className="icon h-12 w-12 text-primary-500"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                                                opacity=".25"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                                            >
                                                <animateTransform
                                                    attributeName="transform"
                                                    dur="0.75s"
                                                    repeatCount="indefinite"
                                                    type="rotate"
                                                    values="0 12 12;360 12 12"
                                                />
                                            </path>
                                        </svg>
                                    </div>
                                    <div className="mx-auto max-w-sm">
                                        <h4 className="font-heading text-xl font-medium leading-normal leading-normal text-muted-800 mb-1 mt-4 dark:text-white">
                                            Loading Assets
                                        </h4>
                                        <p className="text-muted-400 font-sans text-sm">
                                            Please wait while we load your assets.
                                        </p>
                                    </div>
                                </div>
                            ) : UserData === null || !UserData ? (
                                <div className="mx-auto loading-pg w-full text-center max-w-xs">
                                    <div className="mx-auto max-w-sm ">
                                        <h4 className="font-heading text-xl font-medium leading-normal leading-normal text-muted-800 mb-1 mt-4 dark:text-white">
                                            No Assets found!
                                        </h4>
                                    </div>
                                </div>
                            ) : (
                                <div className=" ptbg relative w-full    transition-all duration-300 ">
                                    <div className="flex items-center justify-between p-4">
                                        <div>
                                            <p
                                                className="font-heading text-white  text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                                tag="h2"
                                            >
                                                Manage Assets
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <div className="line-bgb topb relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg [&:not(:first-child)]:border-t-0">
                                            <div className="flex  flex-col justify-between sm:flex-row sm:items-center">
                                                <div className="relative mb-4 flex w-1001 justify-between items-center   gap-2 px-6 sm:mb-0 sm:px-2 h-10 painwrap">
                                                    <span className="text-muted-400 nonanow justify-between  w-100 absolute hidden font-sans text-xs font-medium uppercase sm:-top-10 sm:start-2 sm:block">
                                                        currency
                                                    </span>
                                                    <div className="flex gap-2 items-center">
                                                        <div
                                                            className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                                            icon="cryptocurrency:btc"
                                                        >
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon h-5 w-5"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 32 32"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    fillRule="evenodd"
                                                                    d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m7.189-17.98c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84l-1.728-.43l-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009l-2.384-.595l-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045l-1.13 4.532c-.086.212-.303.531-.793.41c.018.025-1.256-.313-1.256-.313l-.858 1.978l2.25.561c.418.105.828.215 1.231.318l-.715 2.872l1.727.43l.708-2.84c.472.127.93.245 1.378.357l-.706 2.828l1.728.43l.715-2.866c2.948.558 5.164.333 6.097-2.333c.752-2.146-.037-3.385-1.588-4.192c1.13-.26 1.98-1.003 2.207-2.538m-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11m.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                                                <span>Bitcoin</span>
                                                            </h4>
                                                            <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                                                <span>BTC</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-auto nowBlock">
                                                        <span className="text-muted-400 nonanow absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0">
                                                            balance
                                                        </span>
                                                        <span className="text-muted-500 dark:text-muted-400 font-sans text-sm">
                                                            {`${btcBalance.toFixed(8)} (${(
                                                                btcBalance * liveBtc
                                                            ).toFixed(2)} USD)`}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={btcDepositMinus}
                                                        type="button"
                                                        className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                                    >
                                                        <svg
                                                            data-v-cd102a71
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            aria-hidden="true"
                                                            role="img"
                                                            className="icon h-5 w-5"
                                                            width="1em"
                                                            height="1em"
                                                            viewBox="0 0 256 256"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M200.49 200.49a12 12 0 0 1-17 0L76 93v75a12 12 0 0 1-24 0V64a12 12 0 0 1 12-12h104a12 12 0 0 1 0 24H93l107.49 107.51a12 12 0 0 1 0 16.98"
                                                            />
                                                        </svg>
                                                        <span>Withdraw</span>
                                                    </button>
                                                    <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 address-line nowBlock">
                                                        <span className="text-muted-400 nona absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0">
                                                            Address
                                                        </span>
                                                        <p
                                                            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md pmt"
                                                            disabled="false"
                                                        >
                                                            <span className="chote">
                                                                {UserData.btcTokenAddress}
                                                            </span>
                                                            <div
                                                                className="price-sec cursor-pointer"
                                                                onClick={handleCopyClick}
                                                            >
                                                                {" "}
                                                                {copySuccess ? (
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
                                                                            fill="currentColor"
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
                                                                )}
                                                            </div>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*  */}
                                        <div className="line-bgb relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg [&:not(:first-child)]:border-t-0">
                                            <div className="flex  flex-col justify-between sm:flex-row sm:items-center">
                                                <div className="relative mb-4 flex w-1001 justify-between items-center   gap-2 px-6 sm:mb-0 sm:px-2 h-10 painwrap">
                                                    <div className="flex gap-2 items-center">
                                                        <div
                                                            className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                                            icon="cryptocurrency:eth"
                                                        >
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon h-5 w-5"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 32 32"
                                                            >
                                                                <g fill="currentColor" fillRule="evenodd">
                                                                    <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m7.994-15.781L16.498 4L9 16.22l7.498 4.353zM24 17.616l-7.502 4.351L9 17.617l7.498 10.378z"></path>
                                                                    <g fillRule="nonzero">
                                                                        <path
                                                                            fillOpacity=".298"
                                                                            d="M16.498 4v8.87l7.497 3.35zm0 17.968v6.027L24 17.616z"
                                                                        ></path>
                                                                        <path
                                                                            fillOpacity=".801"
                                                                            d="m16.498 20.573l7.497-4.353l-7.497-3.348z"
                                                                        />
                                                                        <path
                                                                            fillOpacity=".298"
                                                                            d="m9 16.22l7.498 4.353v-7.701z"
                                                                        />
                                                                    </g>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                                                <span>Ethereum</span>
                                                            </h4>
                                                            <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                                                <span>ETH</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-auto nowBlock">
                                                        <span className="text-muted-500 dark:text-muted-400 font-sans text-sm">
                                                            {`${ethBalance.toFixed(8)} (${(
                                                                ethBalance * 2241.86
                                                            ).toFixed(2)} USD)`}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={ethDepositMinus}
                                                        type="button"
                                                        className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                                    >
                                                        <svg
                                                            data-v-cd102a71
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            aria-hidden="true"
                                                            role="img"
                                                            className="icon h-5 w-5"
                                                            width="1em"
                                                            height="1em"
                                                            viewBox="0 0 256 256"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M200.49 200.49a12 12 0 0 1-17 0L76 93v75a12 12 0 0 1-24 0V64a12 12 0 0 1 12-12h104a12 12 0 0 1 0 24H93l107.49 107.51a12 12 0 0 1 0 16.98"
                                                            />
                                                        </svg>
                                                        <span>Withdraw</span>
                                                    </button>
                                                    <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 address-line nowBlock">
                                                        <p
                                                            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md pmt"
                                                            disabled="false"
                                                        >
                                                            <span className="chote">
                                                                {UserData.ethTokenAddress}
                                                            </span>
                                                            <div
                                                                className="price-sec cursor-pointer"
                                                                onClick={handleCopyClick2}
                                                            >
                                                                {" "}
                                                                {copySuccess2 ? (
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
                                                                            fill="currentColor"
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
                                                                )}
                                                            </div>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*  */}
                                        <div className="line-bgb bob relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg [&:not(:first-child)]:border-t-0">
                                            <div className="flex  flex-col justify-between sm:flex-row sm:items-center">
                                                <div className="relative mb-4 flex w-1001 justify-between items-center   gap-2 px-6 sm:mb-0 sm:px-2 h-10 painwrap">
                                                    <div className="flex gap-2 items-center">
                                                        <div
                                                            className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                                            icon="cryptocurrency:eth"
                                                        >
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon h-5 w-5"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 32 32"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    fillRule="evenodd"
                                                                    d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m1.922-18.207v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118c0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116c0-1.043-3.301-1.914-7.694-2.117m0 3.59v-.002c-.11.008-.677.042-1.942.042c-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658c0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061c1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658c0 .81-2.895 1.485-6.775 1.657"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                                                <span>Tether</span>
                                                            </h4>
                                                            <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                                                <span>USDT</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-auto nowBlock">
                                                        <span className="text-muted-500 dark:text-muted-400 font-sans text-sm">
                                                            {`${usdtBalance.toFixed(
                                                                8
                                                            )} (${usdtBalance.toFixed(2)} USD)`}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={tetherDepositMinus}
                                                        className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                                    >
                                                        <svg
                                                            data-v-cd102a71
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            aria-hidden="true"
                                                            role="img"
                                                            className="icon h-5 w-5"
                                                            width="1em"
                                                            height="1em"
                                                            viewBox="0 0 256 256"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M200.49 200.49a12 12 0 0 1-17 0L76 93v75a12 12 0 0 1-24 0V64a12 12 0 0 1 12-12h104a12 12 0 0 1 0 24H93l107.49 107.51a12 12 0 0 1 0 16.98"
                                                            />
                                                        </svg>
                                                        <span>Withdraw</span>
                                                    </button>
                                                    <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 address-line nowBlock">
                                                        <p
                                                            className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md pmt"
                                                            disabled="false"
                                                        >
                                                            <span className="chote">
                                                                {UserData.usdtTokenAddress}
                                                            </span>
                                                            <div
                                                                className="price-sec cursor-pointer"
                                                                onClick={handleCopyClick3}
                                                            >
                                                                {" "}
                                                                {copySuccess3 ? (
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
                                                                            fill="currentColor"
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
                                                                )}
                                                            </div>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/**/}
                        </div>
                    </div>
                </div>
            </div>
            {modal3 && (
                <div>
                    <div
                        className="relative z-[9999]"
                        id="headlessui-dialog-33"
                        role="dialog"
                        aria-modal="true"
                        data-headlessui-state="open"
                    >
                        <div className="bg-lesf  fixed inset-0" />
                        <div className="fixed inset-0 overflow-x-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <div
                                    id="headlessui-dialog-panel-36"
                                    data-headlessui-state="open"
                                    className="line-bg w-full   text-left align-middle shadow-xl transition-all rounded-lg max-w-2xl"
                                >
                                    <div className="flex w-full items-center justify-between  ">
                                        <h3 className=" text-muted-400 font-heading  text-lg font-medium leading-6  ">
                                            {" "}
                                            Create new Withdrawal
                                        </h3>
                                        <button
                                            onClick={closeDeposit}
                                            type="button"
                                            className="flex h-9 w-9 items-center justify-center transition-colors duration-300 disabled:opacity-30 hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-50 rounded-full"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                className="h-4 w-4 fill-current"
                                            >
                                                <path
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M18 6 6 18M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="swapas">
                                        <h1
                                            className={activeBank ? "" : "activeas"}
                                            onClick={activeCrypto}
                                        >
                                            Crypto Withdraw
                                        </h1>
                                        <h1
                                            className={activeBank ? "activeas" : ""}
                                            onClick={activeBankOne}
                                        >
                                            Bank Withdraw
                                        </h1>
                                    </div>
                                    <div className="py-2">
                                        <form
                                            action
                                            method="POST"
                                            className="mx-auto w-full max-w-3xl"
                                        >
                                            <div className=" border-t p-4">
                                                <h4 className="font-heading text-muted-400 text-sm font-medium leading-6">
                                                    {" "}
                                                    Selected Currency:{" "}
                                                    <span
                                                        className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                                        size="xs"
                                                        style={{ textTransform: "capitalize" }}
                                                    >
                                                        {depositName}
                                                    </span>
                                                </h4>
                                                <div className="grid grid-cols-12 gap-4 mt-2">
                                                    <div className="col-span-12">
                                                        <div className="relative">
                                                            <label
                                                                className="nui-label w-full pb-1 text-[0.825rem]"
                                                                htmlFor="ninja-input-42"
                                                            >
                                                                Amount
                                                            </label>
                                                            <div className="group/nui-input relative">
                                                                <input
                                                                    id="ninja-input-42"
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
                                                                    onChange={handleTransaction}
                                                                    value={transactionDetail.amountMinus}
                                                                    name="amountMinus"
                                                                    className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded "
                                                                    placeholder="Ex: 0.00000000"
                                                                />
                                                                {depositName === "bitcoin" ? (
                                                                    <p
                                                                        onClick={() =>
                                                                            settransactionDetail({
                                                                                amountMinus: btcBalance.toFixed(8),
                                                                            })
                                                                        }
                                                                        className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                                                    >
                                                                        Available: {btcBalance.toFixed(8)} BTC
                                                                    </p>
                                                                ) : depositName === "ethereum" ? (
                                                                    <p
                                                                        onClick={() =>
                                                                            settransactionDetail({
                                                                                amountMinus: ethBalance.toFixed(8),
                                                                            })
                                                                        }
                                                                        className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                                                    >
                                                                        Available: {ethBalance.toFixed(8)} ETH
                                                                    </p>
                                                                ) : depositName === "tether" ? (
                                                                    <p
                                                                        onClick={() =>
                                                                            settransactionDetail({
                                                                                amountMinus: usdtBalance.toFixed(8),
                                                                            })
                                                                        }
                                                                        className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                                                    >
                                                                        Available: {usdtBalance.toFixed(8)} USDT
                                                                    </p>
                                                                ) : (
                                                                    ""
                                                                )}

                                                                {/**/}
                                                                {/**/}
                                                                <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10 !text-danger-500">
                                                                    <svg
                                                                        data-v-cd102a71
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                        aria-hidden="true"
                                                                        role="img"
                                                                        className="icon h-[1.15rem] w-[1.15rem]"
                                                                        width="1em"
                                                                        height="1em"
                                                                        viewBox="0 0 32 32"
                                                                    >
                                                                        <path
                                                                            fill="gray"
                                                                            d="M26 28h-4v-2h4V6h-4V4h4a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2m-6-17h-2l-2 3.897L14 11h-2l2.905 5L12 21h2l2-3.799L18 21h2l-2.902-5zM10 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h4v2H6v20h4z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-12">
                                                        <div className="flex w-full flex-col gap-4 sm:flex-row">
                                                            <div className="relative grow"></div>
                                                        </div>
                                                        <div
                                                            className="vc-popover-content-wrapper is-interactive"
                                                            style={{}}
                                                        >
                                                            {/**/}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="  border-t p-4 mt-2">
                                                {activeBank ? (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-muted-400 font-heading text-base font-medium leading-normal leading-normal">
                                                                    {" "}
                                                                    Payment Method{" "}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div class="custom-selectas">
                                                            <select
                                                                id="select-options"
                                                                onChange={handlePaymentSelection}
                                                            >
                                                                <option>Select a Payment Method</option>
                                                                {isUser.payments.map((item, index) => {
                                                                    return (
                                                                        <option key={index}>
                                                                            {item.type === "bank" ? (
                                                                                item.bank.accountName
                                                                            ) : (
                                                                                <>
                                                                                    <div
                                                                                        style={{
                                                                                            textTransform: "uppercase",
                                                                                        }}
                                                                                        className="uppercase"
                                                                                    >
                                                                                        {item.card.cardCategory.toUpperCase()}
                                                                                    </div>{" "}
                                                                                    *{item.card.cardNumber.slice(-4)}
                                                                                </>
                                                                            )}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-muted-400 font-heading text-base font-medium leading-normal leading-normal">
                                                                    {" "}
                                                                    Transaction details{" "}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div className="mt-5 grid grid-cols-12 gap-4">
                                                            <div className="col-span-12 grid grid-cols-12">
                                                                <div className="col-span-12 flex flex-col justify-center sm:col-span-3">
                                                                    <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                                                        Receiving Address
                                                                    </label>
                                                                </div>
                                                                <div className="col-span-12 sm:col-span-9">
                                                                    <div className="relative">
                                                                        {/**/}
                                                                        <div className="group/nui-input relative">
                                                                            <input
                                                                                id="ninja-input-46"
                                                                                type="text"
                                                                                onChange={handleTransactionId}
                                                                                value={transactionDetailId.txId}
                                                                                name="txId"
                                                                                className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                                                                placeholder="Ex: 0x1234567890"
                                                                            />
                                                                            {/**/}
                                                                            {/**/}
                                                                            <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                                                                <svg
                                                                                    data-v-cd102a71
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                                    aria-hidden="true"
                                                                                    role="img"
                                                                                    className="icon h-[1.15rem] w-[1.15rem]"
                                                                                    width="1em"
                                                                                    height="1em"
                                                                                    viewBox="0 0 256 256"
                                                                                >
                                                                                    <path
                                                                                        fill="currentColor"
                                                                                        d="M224 88h-48.6l8.47-46.57a8 8 0 0 0-15.74-2.86l-9 49.43H111.4l8.47-46.57a8 8 0 0 0-15.74-2.86L95.14 88H48a8 8 0 0 0 0 16h44.23l-8.73 48H32a8 8 0 0 0 0 16h48.6l-8.47 46.57a8 8 0 0 0 6.44 9.3A7.79 7.79 0 0 0 80 224a8 8 0 0 0 7.86-6.57l9-49.43h47.74l-8.47 46.57a8 8 0 0 0 6.44 9.3a7.79 7.79 0 0 0 1.43.13a8 8 0 0 0 7.86-6.57l9-49.43H208a8 8 0 0 0 0-16h-44.23l8.73-48H224a8 8 0 0 0 0-16m-76.5 64H99.77l8.73-48h47.73Z"
                                                                                    />
                                                                                </svg>
                                                                            </div>
                                                                            {/* <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                    Address is required
                                  </span> */}
                                                                            {/**/}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/**/}
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex space-apas mt-5">
                                                    <h1 className="text-muted-400 font-heading text-base font-medium leading-normal leading-normal">
                                                        Total Amount
                                                    </h1>
                                                    <p className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                                        {depositName === "bitcoin" ? (
                                                            <span>
                                                                BTC {transactionDetail.amountMinus} ($
                                                                {`${(
                                                                    transactionDetail.amountMinus * liveBtc
                                                                ).toFixed(2)}`}
                                                                )
                                                            </span>
                                                        ) : depositName === "ethereum" ? (
                                                            <span>
                                                                ETH {transactionDetail.amountMinus} ($
                                                                {`${(
                                                                    transactionDetail.amountMinus * 2241.86
                                                                ).toFixed(2)}`}
                                                                )
                                                            </span>
                                                        ) : depositName === "tether" ? (
                                                            <span>
                                                                USDT {transactionDetail.amountMinus} ($
                                                                {`${(transactionDetail.amountMinus * 1).toFixed(
                                                                    2
                                                                )}`}
                                                                )
                                                            </span>
                                                        ) : (
                                                            <span></span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>{/**/}</div>
                                        </form>
                                    </div>
                                    <div className="flex w-full items-center gap-x-2 justify-end">
                                        <div className="pt-4 md:pt-6">
                                            <div className="flex gap-x-2">
                                                <button
                                                    onClick={closeDeposit}
                                                    disabled={isDisable}
                                                    data-v-71bb21a6
                                                    type="button"
                                                    className="is-button rounded is-button-default"
                                                >
                                                    Cancel
                                                </button>
                                                {activeBank ? (
                                                    <button
                                                        onClick={() => postUserTransaction("bank")}
                                                        data-v-71bb21a6
                                                        disabled={isDisable}
                                                        type="button"
                                                        className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                                                    >
                                                        {isDisable ? (
                                                            <div>
                                                                <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                            </div>
                                                        ) : (
                                                            "Create"
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => postUserTransaction("crypto")}
                                                        data-v-71bb21a6
                                                        disabled={isDisable}
                                                        type="button"
                                                        className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                                                    >
                                                        {isDisable ? (
                                                            <div>
                                                                <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                            </div>
                                                        ) : (
                                                            "Create"
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assets;