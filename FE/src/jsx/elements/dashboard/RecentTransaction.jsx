import React, { useState, useEffect, useReducer } from 'react';

import Btc from '../../../assets/images/svg/btc.svg';
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"

import Dash from "../../../assets/images/svg/dash.svg"
import Eth from "../../../assets/images/svg/eth.svg"
import Truncate from 'react-truncate-inside/es';
import axios from 'axios';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { IMAGES, SVGICON } from '../../constant/theme';
import { createUserTransactionApi, getCoinsUserApi, getsignUserApi, getUserCoinApi } from '../../../Api/Service';

const tableData = [
    { type: 'Week', icon: SVGICON.TransferSucces, sender: 'Donalt', reciver: 'Dr. Jackson', image: IMAGES.Avatar1, coin: Btc, color: 'success', status: 'COMPLETED' },
    { type: 'Week', icon: SVGICON.TransferPending, sender: 'Thomas', reciver: 'Kritiyan', image: IMAGES.Avatar2, coin: Dash, color: 'warning', status: 'PENDING' },
    { type: 'Week', icon: SVGICON.TransferCencel, sender: 'Hitesh', reciver: 'Prof. Kalyan', image: IMAGES.Avatar3, coin: Eth, color: 'danger', status: 'CANCEL' },

    { type: 'Month', icon: SVGICON.TransferPending, sender: 'Thomas', reciver: 'Kritiyan', image: IMAGES.Avatar2, coin: Dash, color: 'warning', status: 'PENDING' },
    { type: 'Month', icon: SVGICON.TransferSucces, sender: 'Donalt', reciver: 'Dr. Jackson', image: IMAGES.Avatar1, coin: Btc, color: 'success', status: 'COMPLETED' },
    { type: 'Month', icon: SVGICON.TransferCencel, sender: 'Hitesh', reciver: 'Prof. Kalyan', image: IMAGES.Avatar3, coin: Eth, color: 'danger', status: 'CANCEL' },

    { type: 'Year', icon: SVGICON.TransferSucces, sender: 'Donalt', reciver: 'Dr. Jackson', image: IMAGES.Avatar1, coin: Btc, color: 'success', status: 'COMPLETED' },
    { type: 'Year', icon: SVGICON.TransferCencel, sender: 'Hitesh', reciver: 'Prof. Kalyan', image: IMAGES.Avatar3, coin: Eth, color: 'danger', status: 'CANCEL' },
    { type: 'Year', icon: SVGICON.TransferPending, sender: 'Thomas', reciver: 'Kritiyan', image: IMAGES.Avatar2, coin: Dash, color: 'warning', status: 'PENDING' },
];

const tabMainData = [
    { name: 'Week', type: 'week' },
    { name: 'Month', type: 'month' },
    { name: 'Year', type: 'year' },
];



const RecentTransaction = () => {

    const [transactionData, setTransactionData] = useState(tableData.slice(0, 3));
    const [activeTab, setActiveTab] = useState('Week');

    function UpdateArray(name) {
        let updateDate = tableData.filter((ele) => {
            return ele.type === name
        })
        setTransactionData(updateDate);
        setActiveTab(name);
    }

    const [modal, setModal] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [singleTransaction, setsingleTransaction] = useState();
    const [userDetail, setuserDetail] = useState({});
    const [liveBtc, setliveBtc] = useState(null);


    let authUser = useAuthUser();
    let Navigate = useNavigate();
    const [Active, setActive] = useState(false);

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
    const getTransactions = async () => {
        try {
            const response = await axios.get(
                "https://api.coindesk.com/v1/bpi/currentprice.json"
            );
            const allTransactions = await getUserCoinApi(authUser().user._id);
            if (response && allTransactions.success) {
                setUserTransactions(allTransactions.getCoin.transactions.reverse());
                let val = response.data.bpi.USD.rate.replace(/,/g, "");

                setliveBtc(val);
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
    let toggleModal = async (data) => {
        setModal(true);

        setsingleTransaction(data);
    };
    let toggleModalClose = () => {
        setModal(false);
    };

    //

    //

    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        } else if (authUser().user.role === "user") {
            setuserDetail(authUser().user);

            getTransactions();

        }

        // getSignleUser();
    }, []);
    // Copy
    const [timer, setTimer] = useState(null);
    const [copyStatus, setCopyStatus] = useState(false);

    const handleCopyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopyStatus(true);

                // Reset the copy status after 2 seconds
                setTimeout(() => {
                    setCopyStatus(false);
                }, 2000);
            })
            .catch(() => {
                setCopyStatus(false);

                // Reset the copy status after 2 seconds
                setTimeout(() => {
                    setCopyStatus(false);
                }, 2000);
            });
    };

    return (
        <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
                <div className="mb-2">
                    <h4 className="card-title">Recent Transactions</h4>
                </div>

            </div>
            <div className="card-body p-0">
                <div className="tab-content" id="myTabContent1">
                    <div className="tab-pane fade show active" id="Week" role="tabpanel" aria-labelledby="Week-tab">
                        <div className="table-responsive">
                            <table className="table table-responsive-md">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Transaction ID</th>
                                        <th>Date</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Coin</th>
                                        <th>Amount</th>
                                        <th className="text-end">Status</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {UserTransactions && UserTransactions.length > 0 ?
                                        UserTransactions.filter(
                                            (transaction) => !transaction.isHidden
                                        ).slice(0, 5).map((Transaction, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {Transaction.type === 'deposit' ? (
                                                        <div className="icon-container bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M11 20V7.825l-5.6 5.6L4 12l8-8 8 8-1.4 1.425-5.6-5.6V20z" />
                                                            </svg>
                                                        </div>
                                                    ) : Transaction.type === 'withdraw' ? (
                                                        <div className="icon-container bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M11 4v12.175l-5.6-5.6L4 12l8 8 8-8-1.4-1.425-5.6 5.6V4z" />
                                                            </svg>
                                                        </div>
                                                    ) : null}
                                                </td>
                                                <td>{Transaction._id}</td>
                                                <td>{new Date(Transaction.createdAt).toISOString().split('T')[0]}</td>
                                                <td>  <Truncate text={Transaction.fromAddress} offset={6} width="100" /></td>
                                                <td>  <Truncate text={Transaction.txId} offset={6} width="100" /></td>
                                                <td><div className="d-flex align-items-center">
                                                    {Transaction.trxName === 'bitcoin'
                                                        ? <><img src={Btc} alt="" className="me-2 img-btc" />Bitcoin</>
                                                        : Transaction.trxName === 'ethereum'
                                                            ? <><img src={Eth} alt="" className="me-2 img-btc" />Ethereum</>
                                                            : Transaction.trxName === 'tether'
                                                                ? <><img src={UsdtLogo} alt="" className="me-2 img-btc" />USDT</>
                                                                : ""
                                                    }


                                                </div></td>
                                                {Transaction.type === 'deposit' ? (
                                                    <td className="text-success font-w600">{`+$${
                                                        Transaction.trxName === 'bitcoin'
                                                            ? (Transaction.amount * liveBtc).toFixed(2)
                                                            : Transaction.trxName === 'ethereum'
                                                                ? (Transaction.amount * 2241.86).toFixed(2)
                                                                : Transaction.trxName === 'tether'
                                                                    ? Transaction.amount.toFixed(2)
                                                                    : (0).toFixed(2)
                                                    }`}</td>
                                                ) : Transaction.type === 'withdraw' ? (
                                                        <td className="text-danger font-w600"> {`-$${Transaction.trxName === 'bitcoin'
                                                            ? Math.abs((Transaction.amount * liveBtc)).toFixed(2)
                                                            : Transaction.trxName === 'ethereum'
                                                                ? Math.abs((Transaction.amount * 2241.86)).toFixed(2)
                                                                : Transaction.trxName === 'tether'
                                                                    ? Math.abs(Transaction.amount).toFixed(2)
                                                                    : (0).toFixed(2)
                                                            }`}</td>
                                                ) : null}
                                                {Transaction.status === "completed" ? <td className="text-end">
                                                    <div className={`badge badge-sm badge-success`}>
                                                        {Transaction.status}</div></td> : Transaction.status === "pending" ? <td className="text-end">
                                                            <div className={`badge badge-sm badge-warning`}>
                                                                {Transaction.status}</div></td> : Transaction.status === "failed" ? <td className="text-end">
                                                                    <div className={`badge badge-sm badge-danger`}>
                                                                        {Transaction.status}</div></td> : ""}

                                            </tr>
                                        )) : ""}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RecentTransaction;