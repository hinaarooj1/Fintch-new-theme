import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import ibmLogo from '../../../assets/images/bnb-bnb-logo.svg'
import { Table, Form, Button } from 'react-bootstrap';
import {
    createUserStocksApi,
    deleteTransactionApi,
    getCoinsApi,
    getEachUserApi,
    signleUsersApi,
    deleteUserStocksApi,
} from "../../../Api/Service";
import axios from "axios";
import './userStocks.css'
import Truncate from "react-truncate-inside/es";
const UserTransactions = () => {
    const [modal, setModal] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [isDisable, setisDisable] = useState(false);
    const [isDisableDelete, setisDisableDelete] = useState(false);
    const [userDetail, setuserDetail] = useState();
    const [activeType, setactiveType] = useState(false);
    const [Active, setActive] = useState(false);
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };
    const [stocks, setStocks] = useState({
        stockName: '',
        stockSymbol: '',
        stockAmount: '',
        stockValue: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStocks((prevStocks) => ({
            ...prevStocks,
            [name]: value
        }));
    };

    const [liveBtc, setliveBtc] = useState(null);
    const [activeStatus, setactiveStatus] = useState(false);

    const [Status, setStatus] = useState("");
    const [Type, setType] = useState("");
    let { id } = useParams();

    let authUser = useAuthUser();
    let Navigate = useNavigate();



    const getSignleUser = async () => {
        try {
            const signleUser = await signleUsersApi(id);

            if (signleUser.success) {
                setuserDetail(signleUser.signleUser);
            } else {
                toast.dismiss();
                toast.error(signleUser.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    const getCoins = async () => {
        try {
            const response = await axios.get(
                "https://api.coindesk.com/v1/bpi/currentprice.json"
            );
            const userCoins = await getCoinsApi(id);

            if (response && userCoins.success) {
                const stocks = userCoins.getCoin.stocks;

                // Check if stocks is defined and is an array
                if (Array.isArray(stocks)) {
                    if (stocks.length > 0) {
                        setUserTransactions(stocks.reverse()); // Set the stocks if available
                    } else {
                        setUserTransactions(null); // Set to null if no stocks are available
                    }
                } else {
                    setUserTransactions(null); // Set to null if stocks is not defined or not an array
                }

                setisLoading(false);

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
    useEffect(() => {
        if (authUser().user.role === "user") {
            Navigate("/dashboard");
            return;
        }
        getCoins();

        getSignleUser();
    }, []);
    // Copy

    const createUserStocks = async (e) => {
        e.preventDefault();
        try {
            setisDisable(true);

            if (stocks.stockName === "" || stocks.stockSymbol === "" || stocks.stockValue === "" || stocks.stockAmount === "") {
                toast.dismiss();
                toast.error("All the fields are required!");
                return;
            }

            let body = {
                stockName: stocks.stockName,
                stockSymbol: stocks.stockSymbol,
                stockValue: stocks.stockValue,
                stockAmount: stocks.stockAmount,
            };

            if (
                !body.stockName ||
                !body.stockSymbol ||
                !body.stockAmount ||
                !body.stockValue
            ) {
                toast.dismiss();
                toast.error("Fill all the required fields");
                return;
            }
            const newStocks = await createUserStocksApi(id, body);

            if (newStocks.success) {
                toast.dismiss();
                toast.success(newStocks.msg);
                setStocks({
                    stockName: '',
                    stockSymbol: '',
                    stockAmount: '',
                    stockValue: ''
                });
                getCoins();
            } else {
                toast.dismiss();
                toast.error(newStocks.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
        }
    };
    const deleteUserStock = async (coindId) => {


        try {
            setisDisableDelete(true);


            const deleteStock = await deleteUserStocksApi(coindId, id);

            if (deleteStock.success) {
                toast.dismiss();
                toast.success(deleteStock.msg);

                getCoins();
            } else {
                toast.dismiss();
                toast.error(deleteStock.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisableDelete(false);

        }
    };

    // Copy
    return (
        <div className="admin">
            <div>
                <div className="bg-muted-100 dark:bg-muted-900 pb-20">
                    <SideBar state={Active} toggle={toggleBar} />
                    <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
                        <div className="mx-auto w-full max-w-7xl">
                            <div className="relative z-50 mb-5 flex h-16 items-center gap-2">
                                <button
                                    type="button"
                                    className="flex h-10 w-10 items-center justify-center -ms-3"
                                >
                                    <div className="relative h-5 w-5 scale-90">
                                        <span className="bg-primary-500 absolute block h-0.5 w-full transition-all duration-300 top-1 max-w-[75%] -rotate-45 top-0.5" />
                                        <span className="bg-primary-500 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 translate-x-4 opacity-0" />
                                        <span className="bg-primary-500 absolute block h-0.5 w-full transition-all duration-300 bottom-1 max-w-[75%] rotate-45 bottom-0" />
                                    </div>
                                </button>
                                <h1 className="font-heading text-2xl font-light leading-normal leading-normal text-muted-800 hidden dark:text-white md:block">
                                    User Management
                                </h1>
                                <div className="ms-auto" />

                                <div className="group inline-flex items-center justify-center text-right">
                                    <div
                                        data-headlessui-state
                                        className="relative h-9 w-9 text-left"
                                    >
                                        <button
                                            className="group-hover:ring-primary-500 dark:ring-offset-muted-900 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
                                            id="headlessui-menu-button-25"
                                            aria-haspopup="menu"
                                            aria-expanded="false"
                                            type="button"
                                        >
                                            <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full">
                                                <img
                                                    src={Log}
                                                    className="max-w-full rounded-full object-cover shadow-sm dark:border-transparent"
                                                    alt=""
                                                />
                                            </div>
                                        </button>
                                        {/**/}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="nuxt-loading-indicator"
                                style={{
                                    position: "fixed",
                                    top: "0px",
                                    right: "0px",
                                    left: "0px",
                                    pointerEvents: "none",
                                    width: "auto",
                                    height: "3px",
                                    opacity: 0,
                                    background: "var(--color-primary-500)",
                                    transform: "scaleX(0)",
                                    transformOrigin: "left center",
                                    transition:
                                        "transform 0.1s ease 0s, height 0.4s ease 0s, opacity 0.4s ease 0s",
                                    zIndex: 999999,
                                }}
                            />
                            <seokit />
                            <div className="min-h-screen overflow-hidden">
                                <div className="grid gap-8 sm:grid-cols-12">
                                    <UserSideBar userid={id} />
                                    <div className="col-span-12 sm:col-span-8">
                                        <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white duration-300 rounded-md">
                                            <div className="flex items-center justify-between p-4">
                                                <div>
                                                    <p
                                                        className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                                        tag="h2"
                                                    >
                                                        {" "}
                                                        Add New Stock
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-6 asm">
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Stock Name</th>
                                                            <th>Stock Symbol</th>
                                                            <th>Quantity</th>
                                                            <th>Total Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Enter stock name"
                                                                    name="stockName"
                                                                    value={stocks.stockName}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Enter stock symbol"
                                                                    name="stockSymbol"
                                                                    value={stocks.stockSymbol}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="Enter amount"
                                                                    name="stockAmount"
                                                                    value={stocks.stockAmount}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    // readOnly={true}
                                                                    placeholder="Total Value"
                                                                    name="stockValue"
                                                                    value={stocks.stockValue}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <div style={{ textAlign: "center", padding: "5px 10px" }}>

                                                    <button onClick={createUserStocks} type="button" className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"> <span>
                                                        {isDisable ? (
                                                            <div>
                                                                <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                            </div>
                                                        ) : (
                                                            "Add Stock"
                                                        )}
                                                    </span></button>
                                                </div>
                                            </div>

                                        </div>
                                        <br />
                                        <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white duration-300 rounded-md">
                                            <div className="flex items-center justify-between p-4">
                                                <div>
                                                    <p
                                                        className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                                        tag="h2"
                                                    >
                                                        {" "}
                                                        All Stocks
                                                    </p>
                                                </div>
                                            </div>
                                            {isLoading && (
                                                <div className="  p-5">Loading Stocks...</div>
                                            )}
                                            {!isLoading && (
                                                <div className="pt-6 asm">
                                                    <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                                <th>Stock Name</th>
                                                                <th>Stock Symbol</th>
                                                                <th>Quantity</th>
                                                                <th>Total Value</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        {UserTransactions && Array.isArray(UserTransactions) && UserTransactions.length > 0 ? (
                                                            UserTransactions.map((transaction, index) => (
                                                                <tbody>
                                                                    <tr key={index}>
                                                                        <td>{transaction.stockName || 'N/A'}</td>
                                                                        <td className="text-center">{transaction.stockSymbol || 'N/A'}</td>
                                                                        <td>{transaction.stockAmount || 'N/A'}</td>
                                                                        <td>{transaction.stockValue || 'N/A'}</td>
                                                                        <td>
                                                                            <button
                                                                                onClick={() => deleteUserStock(transaction._id)} disabled={isDisableDelete} style={{ backgroundColor: "red" }} type="button" className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"> <span>
                                                                                    {isDisableDelete ? (
                                                                                        <div>
                                                                                            <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        "Delete"
                                                                                    )}
                                                                                </span></button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5" className="text-center">No stocks available</td>
                                                            </tr>

                                                        )}
                                                    </Table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/**/}
                        </div>
                    </div>

                </div>
            </div>
            {/* Modal 1 */}


            {/* Modal 1 */}
        </div>
    );
};

export default UserTransactions;
