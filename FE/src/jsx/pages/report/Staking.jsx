import React, { useState, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import NearProtocol from '../../../assets/images/new/6.png';
import TonCoin from '../../../assets/images/new/3.png';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, getCoinsUserApi, getLinksApi, getsignUserApi, getUserCoinApi, getStakingSettingsApi } from '../../../Api/Service'
import axios from 'axios';
import { Button, Card, Col, Form, DropdownDivider, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';

const Staking = () => {
    // State for each coin's active duration
    const [activeDurations, setActiveDurations] = useState({
        bitcoin: 30,
        ethereum: 30,
        tether: 30,
        bnb: 30,
        xrp: 30,
        doge: 30,
        ton: 30,
        link: 30,
        dot: 30,
        near: 30,
        usdc: 30,
        trx: 30,
        sol: 30,
        eur: 30
    });

    const [isLoading, setisLoading] = useState(true);
    const [isDisable, setisDisable] = useState(false);
    const [liveBtc, setliveBtc] = useState(null);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [UserData, setUserData] = useState(true);
    const [isGetting, setisGetting] = useState(true);
    const [fractionBalance, setfractionBalance] = useState("00");
    const [stakingSettings, setStakingSettings] = useState({
        disabledCoins: [],
        customRates: {}
    });

    // Balances for all coins
    const [balances, setBalances] = useState({
        bitcoin: 0,
        ethereum: 0,
        tether: 0,
        bnb: 0,
        xrp: 0,
        doge: 0,
        ton: 0,
        link: 0,
        dot: 0,
        near: 0,
        usdc: 0,
        trx: 0,
        sol: 0,
        eur: 0
    });

    // Coin metadata including names, symbols, and icons
    const coinData = {
        bitcoin: { name: "bitcoin", symbol: "btc", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png" },
        ethereum: { name: "ethereum", symbol: "eth", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png" },
        tether: { name: "tether", symbol: "usdt", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdt.png" },
        bnb: { name: "BNB", symbol: "bnb", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/bnb.png" },
        xrp: { name: "XRP", symbol: "xrp", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/xrp.png" },
        doge: { name: "Dogecoin", symbol: "doge", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/doge.png" },
        ton: { name: "Toncoin", symbol: "ton", icon: TonCoin },
        link: { name: "Chainlink", symbol: "link", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/link.png" },
        dot: { name: "Polkadot", symbol: "dot", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/dot.png" },
        near: { name: "Near Protocol", symbol: "near", icon: NearProtocol },
        usdc: { name: "USD Coin", symbol: "usdc", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdc.png" },
        trx: { name: "Tron", symbol: "trx", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/trx.png" },
        sol: { name: "Solana", symbol: "sol", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/sol.png" },
        eur: { name: "Euro", symbol: "eur", icon: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eur.png" }
    };

    // Minimum values for staking
    const minValues = {
        bitcoin: 0.0117769844,
        ethereum: 0.1969969781,
        tether: 500.3001801081,
        bnb: 0.5,
        xrp: 100,
        doge: 1000,
        ton: 10,
        link: 20,
        dot: 15,
        near: 25,
        usdc: 500,
        trx: 1000,
        sol: 1,
        eur: 500
    };

    // Default rates if no custom rates are set
    const defaultRates = {
        thirtyDays: 11,
        sixtyDays: 45,
        ninetyDays: 123
    };

    const activeDuration = (coin, duration) => {
        setActiveDurations(prev => ({
            ...prev,
            [coin]: duration
        }));
    };

    // Function to get rate for a specific coin and duration
    const getRateForCoin = (coinKey, duration) => {
        const coinRates = stakingSettings.customRates[coinKey];

        if (coinRates) {
            switch (duration) {
                case 30: return coinRates.thirtyDays || defaultRates.thirtyDays;
                case 60: return coinRates.sixtyDays || defaultRates.sixtyDays;
                case 90: return coinRates.ninetyDays || defaultRates.ninetyDays;
                default: return 0;
            }
        }

        // Return default rates if no custom rates are set
        switch (duration) {
            case 30: return defaultRates.thirtyDays;
            case 60: return defaultRates.sixtyDays;
            case 90: return defaultRates.ninetyDays;
            default: return 0;
        }
    };

    const getCoins = async (data) => {
        let id = data._id;
        try {
            const userCoins = await getCoinsUserApi(id);

            if (userCoins.success) {
                setUserData(userCoins.getCoin);

                let btcPrice = 96075.25;
                if (userCoins && userCoins.btcPrice && userCoins.btcPrice.quote && userCoins.btcPrice.quote.USD) {
                    btcPrice = userCoins.btcPrice.quote.USD.price;
                }
                setliveBtc(btcPrice);
                setisLoading(false);

                // Calculate balances for all coins
                const newBalances = { ...balances };

                Object.keys(coinData).forEach(coinKey => {
                    const transactionNameMap = {
                        trx: 'tron',
                        usdc: 'usd'
                    };

                    const searchTerm = transactionNameMap[coinKey] || coinKey.toLowerCase();
                    const coinTransactions = userCoins.getCoin.transactions.filter(transaction =>
                        transaction.trxName.toLowerCase().includes(searchTerm)
                    );

                    const completedTransactions = coinTransactions.filter(transaction =>
                        transaction.status.includes('completed')
                    );

                    let totalBalance = 0;
                    for (let i = 0; i < completedTransactions.length; i++) {
                        totalBalance += completedTransactions[i].amount;
                    }
                    newBalances[coinKey] = totalBalance;
                });

                setBalances(newBalances);

                // Calculate total portfolio value
                const coinPrices = {
                    bitcoin: btcPrice,
                    ethereum: 2640,
                    tether: 1,
                    bnb: 350,
                    xrp: 0.5,
                    doge: 0.1,
                    ton: 2.5,
                    link: 15,
                    dot: 7,
                    near: 4,
                    usdc: 1,
                    trx: 0.1,
                    sol: 100,
                    eur: 1.1
                };

                const totalValue = Object.keys(newBalances).reduce((total, coinKey) => {
                    return total + (newBalances[coinKey] * coinPrices[coinKey]);
                }, 0).toFixed(2);

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

                setfractionBalance(fractionalPart);
                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        }
    };

    // Fetch staking settings
    const fetchStakingSettings = async () => {
        try {
            const settings = await getStakingSettingsApi(authUser().user._id);
            if (settings.success) {
                setisGetting(false)
                console.log('settings.stakingSettings: ', settings.stakingSettings);
                setStakingSettings(settings.stakingSettings);
            }
        } catch (error) {
            console.error("Error fetching staking settings:", error);
        }
    };

    const [Active, setActive] = useState(false);
    const [stakingModal, setstakingModal] = useState(false);

    let toggleBar = () => {
        setActive(!Active);
    };

    const [currentCrypto, setCurrentCrypto] = useState(null);
    let toggleStaking = (cryptoType) => {
        // Check if coin is disabled
        if (stakingSettings.disabledCoins.includes(cryptoType)) {
            toast.error("Staking for this coin is currently disabled");
            return;
        }

        if (stakingModal === true) {
            setstakingModal(false);
            setCurrentCrypto(null);
            setAmount("");
        } else {
            setstakingModal(true);
            setCurrentCrypto(cryptoType);
        }
    };

    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [isUser, setIsUser] = useState({});
    const [secLoading, setsecLoading] = useState(true);

    const fetchLinks = async () => {
        try {
            const data = await getLinksApi();
            if (data?.links[6]?.enabled) {
                setsecLoading(false);
            } else {
                Navigate(-1);
            }
        } catch (error) {
            console.error("Error fetching links:", error);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

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
        }
    };

    useEffect(() => {
        getCoins(authUser().user);
        getsignUser();
        fetchStakingSettings();
        if (authUser().user.role === "user") {
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);

    const handleAmountChange = (e, cryptoName) => {
        const value = e.target.value;

        if (value === "") {
            setAmount("");
            return;
        }

        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            if (numericValue > balances[cryptoName]) {
                setAmount(balances[cryptoName].toString());
            } else {
                setAmount(value);
            }
        }
    };

    const [amount, setAmount] = useState("");
    const [estInterest, setEstInterest] = useState(0);
    const [parseAmount, setParseAmount] = useState(0);
    const [parseIntAmount, setParseIntAmount] = useState(0);

    useEffect(() => {
        calculateEstInterest();
    }, [amount, activeDurations[currentCrypto], stakingSettings.customRates]);

    const calculateEstInterest = () => {
        if (!currentCrypto) return;

        const rate = getRateForCoin(currentCrypto, activeDurations[currentCrypto]);
        const validAmount = parseFloat(amount) || 0;
        const interest = (validAmount * rate) / 100;
        setEstInterest(interest);
        setParseAmount(parseFloat(validAmount));
        setParseIntAmount(parseFloat(interest));
    };

    const confirmTransaction = async (depositName) => {
        let e = "crypto";
        if (amount.trim() === "") {
            toast.error("Amount cannot be empty");
            return false;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            toast.error("Invalid amount");
            return false;
        }

        if (parsedAmount === 0) {
            toast.error("Amount cannot be zero");
            return false;
        }

        if (parsedAmount < 0) {
            toast.error("Amount cannot be negative");
            return false;
        }

        // Check if coin is disabled
        if (stakingSettings.disabledCoins.includes(depositName)) {
            toast.error("Staking for this coin is currently disabled");
            return false;
        }

        try {
            setisDisable(true);
            const coinName = coinData[depositName]?.name || depositName;

            let body = {
                trxName: coinName,
                amount: -parsedAmount,
                txId: "staking amount",
                e: e,
                status: "completed",
            };

            if (!body.trxName || !body.amount || !body.txId) {
                toast.dismiss();
                toast.error("Fill all the required fields");
                return;
            }

            let id = authUser().user._id;
            const newTransaction = await createUserTransactionApi(id, body);

            if (newTransaction.success) {
                toast.dismiss();
                toast.success("Staking completed successfully");
                setstakingModal(false);
                setCurrentCrypto(null);
                setAmount("");
                getCoins(authUser().user);
            } else {
                toast.dismiss();
                toast.error(newTransaction.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
            getTransactions();
        }
    };

    const getTransactions = async () => {
        try {
            const allTransactions = await getUserCoinApi(authUser().user._id);
            if (allTransactions.success) {
                setUserTransactions(allTransactions.getCoin.transactions.reverse());
                return;
            } else {
                toast.dismiss();
                toast.error(allTransactions.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisLoading(false);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);

    // Render function for each coin card
    const renderCoinCard = (coinKey) => {
        const coin = coinData[coinKey];
        const isDisabled = stakingSettings.disabledCoins.includes(coinKey);

        return (
            <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-4 css-i9p3im" key={coinKey}>
                <div className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-l43idd no-border new-bg-dark ${isDisabled ? 'opacity-50' : ''}`}>
                    <div className="MuiCardContent-root css-1dzn5ey">
                        <div className="MuiStack-root css-jelo4q">
                            <div className="MuiAvatar-root MuiAvatar-circular css-1m3w9oh">
                                <img
                                    src={coin.icon}
                                    className="MuiAvatar-img css-1hy9t21"
                                    alt={coin.name}
                                />
                            </div>
                            <h6 className="MuiTypography-root MuiTypography-h6 css-ow70wi text-white">
                                Staking {coin.name}
                                {isDisabled && <span className="text-danger ml-2">{" "}(Unavailable)</span>}
                            </h6>
                        </div>
                        <p className="MuiTypography-root MuiTypography-body2 css-1jorj1k text-white">
                            DURATION
                        </p>
                        <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 css-krtfz2">
                            {[30, 60, 90].map((duration) => {
                                const rate = getRateForCoin(coinKey, duration);
                                return (
                                    <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 css-kdq3hv" key={duration}>
                                        <div
                                            onClick={() => !isDisabled && activeDuration(coinKey, duration)}
                                            className={`MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root ${activeDurations[coinKey] === duration ? "css-qy35p" : "css-18xyzlx"} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <span className="MuiTypography-root MuiTypography-caption css-50upxb text-white">
                                                {duration} Days
                                            </span>
                                            <br />
                                            <small className="text-success">{isGetting ? "..." : `${rate}%`}</small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="MuiStack-root css-9npne8">
                            <span className="MuiTypography-root MuiTypography-caption css-1canfvu text-white">
                                Tap Stake to see your reward
                            </span>
                        </div>
                        <div className="MuiStack-root css-j0iiqq">
                            <span className="MuiTypography-root MuiTypography-caption css-1canfvu text-white">
                                Min Value
                            </span>
                            <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                {minValues[coinKey]} {coin.symbol.toUpperCase()}
                            </span>
                        </div>

                        <button
                            onClick={() => !isDisabled && toggleStaking(coinKey)}
                            className={`MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e ${isDisabled ? 'MuiButton-containedSecondary' : 'MuiButton-containedPrimary'}`}
                            tabIndex={0}
                            style={{opacity:isGetting?"0.5":"1"}}
                            type="button"
                            disabled={isDisabled || isGetting}
                        >
                            {isDisabled ? 'Unavailable' : 'Stake'}
                            <span className="MuiTouchRipple-root css-w0pj6f" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card no-bg" >
                        <Card.Header className='no-border'>
                            <Card.Title className='text-white'>Assets</Card.Title>
                            {authUser().user.role === 'admin' && (
                                <Button variant="outline-light" size="sm" onClick={() => Navigate('/admin/staking-settings')}>
                                    Manage Staking Settings
                                </Button>
                            )}
                        </Card.Header>
                        <div className="card-body">
                            <div className="MuiStack-root css-jddaxh">
                                <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-4 css-1tz8m30">
                                    {Object.keys(coinData).map(coinKey => renderCoinCard(coinKey))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-x-12">
                    {secLoading ? "" :
                        <div className="card new-bg-dark">
                            <Card.Header>
                                <Card.Title className='text-white'>Staking Rewards</Card.Title>
                            </Card.Header>
                            <div className="card-body">
                                {isLoading ? (
                                    <div className="text-center my-5">
                                        <Spinner animation="border" variant="primary" />
                                        <h4 className="mt-3"> Loading...</h4>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-grid gap-4">
                                            {UserTransactions &&
                                                UserTransactions.filter(Transaction => !Transaction.isHidden && Transaction.txId === "staking amount")
                                                    .map((Transaction, index) => {
                                                        const coinPrice =
                                                            Transaction.trxName.toLowerCase() === "bitcoin" ? liveBtc :
                                                                Transaction.trxName.toLowerCase() === "ethereum" ? 2640.86 :
                                                                    Transaction.trxName.toLowerCase() === "tether" ? 1 :
                                                                        Transaction.trxName.toLowerCase() === "bnb" ? 210.25 :
                                                                            Transaction.trxName.toLowerCase() === "xrp" ? 0.5086 :
                                                                                Transaction.trxName.toLowerCase() === "dogecoin" ? 0.1163 :
                                                                                    Transaction.trxName.toLowerCase() === "euro" ? 1.08 :
                                                                                        Transaction.trxName.toLowerCase() === "solana" ? 245.01 :
                                                                                            Transaction.trxName.toLowerCase() === "toncoin" ? 5.76 :
                                                                                                Transaction.trxName.toLowerCase() === "chainlink" ? 12.52 :
                                                                                                    Transaction.trxName.toLowerCase() === "polkadot" ? 4.76 :
                                                                                                        Transaction.trxName.toLowerCase() === "near protocol" ? 5.59 :
                                                                                                            Transaction.trxName.toLowerCase() === "usd coin" ? 0.99 :
                                                                                                                Transaction.trxName.toLowerCase() === "tron" ? 0.1531 :
                                                                                                                    0;

                                                        return (
                                                            <Card
                                                                key={index}
                                                                className="transaction-card no-bg border-0 shadow-sm rounded-3 transition-all duration-300"
                                                            >
                                                                <Card.Body className="p-3">
                                                                    <Row className="align-items-center">
                                                                        <Col>
                                                                            <Card.Title as="h6" className="mb-1 text-white">
                                                                                {Transaction.trxName}{' '}
                                                                                <small className="transaction-status">({Transaction.status})</small>
                                                                            </Card.Title>
                                                                            <Card.Text className="mb-1 transaction-amount">
                                                                                {Math.abs(Transaction.amount).toFixed(8)}{' '}
                                                                                <small>
                                                                                    {`($${(Math.abs(Transaction.amount) * coinPrice).toFixed(2)})`}
                                                                                </small>
                                                                            </Card.Text>
                                                                            <Card.Text className="transaction-date d-md-none">
                                                                                At: {new Date(Transaction.createdAt).toLocaleString()}
                                                                            </Card.Text>
                                                                        </Col>
                                                                        <Col xs="auto" className="d-flex align-items-center">
                                                                            <Card.Text className="me-3 mb-0 transaction-date d-none d-md-block">
                                                                                At: {new Date(Transaction.createdAt).toLocaleString()}
                                                                            </Card.Text>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        );
                                                    })}
                                        </div>
                                        {UserTransactions.length === 0 && (
                                            <div>
                                                <div className="flex min-h-[400px] items-center justify-center">
                                                    <div className="mx-auto w-full text-center max-w-xs">
                                                        <div className="mx-auto max-w-xs new">
                                                        </div>
                                                        <div className="mx-auto max-w-sm">
                                                            <h4 className="font-heading text-xl font-medium leading-normal leading-normal text-muted-800 mb-1 mt-4 dark:text-white">
                                                                No staking found
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>}
                </div>
            </div>
            {stakingModal && currentCrypto && (
                <div
                    role="presentation"
                    className="MuiDialog-root MuiModal-root css-126xj0f"
                >
                    <div
                        aria-hidden="true"
                        className="MuiBackdrop-root MuiModal-backdrop css-1p6v7w1"
                        style={{
                            opacity: 1,
                            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        }}
                    />
                    <div tabIndex={0} data-testid="sentinelStart" />
                    <div
                        className="MuiDialog-container MuiDialog-scrollPaper css-ekeie0"
                        role="presentation"
                        tabIndex={-1}
                        style={{
                            opacity: 1,
                            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        }}
                    >
                        <div
                            className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation24 MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiDialog-paperFullWidth css-maa7c0"
                            role="dialog"
                            aria-labelledby=":r2:"
                        >
                            <h2
                                className="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-19d9fw5"
                                id=":r2:"
                            >
                                Stake {coinData[currentCrypto]?.name}
                                <button
                                    className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-inqsmp"
                                    tabIndex={0}
                                    onClick={toggleStaking}
                                    type="button"
                                >
                                    <svg
                                        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                                        focusable="false"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        data-testid="CloseIcon"
                                    >
                                        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                    <span className="MuiTouchRipple-root css-w0pj6f" />
                                </button>
                            </h2>
                            <div className="MuiDialogContent-root css-z83ub">
                                <form>
                                    <div className="MuiStack-root css-36lwkk">
                                        <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1lnu8xy">
                                            <label
                                                className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-58zb7v"
                                                data-shrink="false"
                                                htmlFor=":r3:"
                                                id=":r3:-label"
                                            ></label>
                                            <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1a4ax0g">
                                                <input
                                                    aria-invalid="false"
                                                    aria-describedby=":r3:-helper-text"
                                                    id=":r3:"
                                                    name="amount"
                                                    placeholder="Locked Amount"
                                                    type="text"
                                                    className="MuiInputBase-input MuiOutlinedInput-input css-f0guyy"
                                                    value={amount}
                                                    onChange={(e) => handleAmountChange(e, currentCrypto)}
                                                />
                                                <fieldset
                                                    aria-hidden="true"
                                                    className="MuiOutlinedInput-notchedOutline css-100o8dq"
                                                >
                                                    <legend className="css-yjsfm1">
                                                        <span>Locked Amount</span>
                                                    </legend>
                                                </fieldset>
                                            </div>
                                            <p
                                                className="MuiFormHelperText-root MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-126giv0"
                                                id=":r3:-helper-text"
                                            >
                                                Total Balance{" "}
                                                {`${balances[currentCrypto].toFixed(8)} (${(
                                                    balances[currentCrypto] * (currentCrypto === 'bitcoin' ? liveBtc :
                                                        currentCrypto === 'ethereum' ? 2640 :
                                                            currentCrypto === 'tether' ? 1 :
                                                                currentCrypto === 'bnb' ? 350 :
                                                                    currentCrypto === 'xrp' ? 0.5 :
                                                                        currentCrypto === 'doge' ? 0.1 :
                                                                            currentCrypto === 'ton' ? 2.5 :
                                                                                currentCrypto === 'link' ? 15 :
                                                                                    currentCrypto === 'dot' ? 7 :
                                                                                        currentCrypto === 'near' ? 4 :
                                                                                            currentCrypto === 'usdc' ? 1 :
                                                                                                currentCrypto === 'trx' ? 0.1 :
                                                                                                    currentCrypto === 'sol' ? 100 :
                                                                                                        currentCrypto === 'eur' ? 1.1 : 1
                                                    )).toFixed(2)} USD)`}{" "}
                                                {coinData[currentCrypto]?.symbol.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="MuiStack-root css-9npne8">
                                            <span className="MuiTypography-root MuiTypography-caption css-1canfvu text-white">
                                                Rate
                                            </span>
                                            <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                {getRateForCoin(currentCrypto, activeDurations[currentCrypto])}%
                                            </span>
                                        </div>
                                        <div className="MuiStack-root css-j0iiqq">
                                            <span className="MuiTypography-root MuiTypography-caption css-1canfvu text-white">
                                                Min Value
                                            </span>
                                            <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                {minValues[currentCrypto]} {coinData[currentCrypto]?.symbol.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="MuiStack-root css-j0iiqq">
                                            <span className="MuiTypography-root MuiTypography-caption css-1canfvu text-white">
                                                Est. Interest
                                            </span>
                                            <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                {estInterest.toFixed(8)} {coinData[currentCrypto]?.symbol.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="MuiStack-root css-j0iiqq">
                                            <span className="MuiTypography-root MuiTypography-caption css-1canfvu text-white">
                                                Total Amount
                                            </span>
                                            <span className="MuiTypography-root MuiTypography-caption css-dbb9ax">
                                                {(parseAmount + parseIntAmount).toFixed(8)} {coinData[currentCrypto]?.symbol.toUpperCase()}
                                            </span>
                                        </div>
                                        <button
                                            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1j9kn1e"
                                            tabIndex={0}
                                            onClick={() => confirmTransaction(currentCrypto)}
                                            type="button"
                                        >
                                            {isDisable ? (
                                                <div>
                                                    <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                </div>
                                            ) : (
                                                <>
                                                    Stake
                                                    <span className="MuiTouchRipple-root css-w0pj6f" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div tabIndex={0} data-testid="sentinelEnd" />
                </div>
            )}
        </>
    );
};

export default Staking;