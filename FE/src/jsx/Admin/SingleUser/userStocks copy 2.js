import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { Table, Form, Spinner } from 'react-bootstrap';
import {
    createUserStocksApi,
    getCoinsApi,
    signleUsersApi,
    deleteUserStocksApi,
} from "../../../Api/Service";
import axios from "axios";
import './userStocks.css'
const UserTransactions = () => {
    const [isLoading, setisLoading] = useState(true);
    const [UserTransactions, setUserTransactions] = useState([]);
    const [isDisable, setisDisable] = useState(false);
    const [isDisableDelete, setisDisableDelete] = useState(false);
    const [Active, setActive] = useState(false);
    const [liveStockValues, setLiveStockValues] = useState({});
    let toggleBar = () => {
        setActive(!Active);
    };
    const [stocks, setStocks] = useState({
        stockName: '',
        stockSymbol: '',
        stockAmount: 1,
        stockValue: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStocks((prevStocks) => ({
            ...prevStocks,
            [name]: value
        }));
    };

    let { id } = useParams();
    let authUser = useAuthUser();
    let Navigate = useNavigate();

    const getCoins = async () => {
        try {
            const response = await axios.get(
                "https://api.coindesk.com/v1/bpi/currentprice.json"
            );
            const userCoins = await getCoinsApi(id);

            if (response && userCoins.success) {
                const stocks = userCoins.getCoin.stocks;
                if (Array.isArray(stocks)) {
                    setUserTransactions(stocks.reverse()); // Set the stocks if available
                } else {
                    setUserTransactions(null); // Set to null if no stocks are available
                }
                setisLoading(false);
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
        if (authUser().user.role === "user") {
            Navigate("/dashboard");
            return;
        }
        getCoins();
    }, []);

    useEffect(() => {
        // Fetch live stock values when UserTransactions is updated
        if (UserTransactions.length > 0) {
            const symbols = UserTransactions.map(tx => tx.stockSymbol);
            fetchStockValues(symbols);
        }
    }, [UserTransactions]);

    const fetchStockValues = async (symbols) => {
        try {
            const stockValuePromises = symbols.map(symbol =>
                axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`)
            );
            const responses = await Promise.all(stockValuePromises);

            const values = {};
            responses.forEach((response, index) => {
                const symbol = symbols[index];
                const timeSeries = response.data['Time Series (5min)'];
                if (timeSeries) {
                    const latestTime = Object.keys(timeSeries)[0];
                    const latestData = timeSeries[latestTime]['1. open'];
                    values[symbol] = latestData;
                } else {
                    values[symbol] = 'N/A';
                }
            });
            setLiveStockValues(values);
        } catch (error) {
            console.error('Error fetching stock values:', error);
        }
    };

    const createUserStocks = async (e) => {
        e.preventDefault();
        try {
            setisDisable(true);
            if (stocks.stockName === "" || stocks.stockAmount === "" || stockValue === null) {
                toast.dismiss();
                toast.error("All the fields are required!");
                return;
            }
            let body = {
                stockName: stocks.stockName,
                stockSymbol: selectedStock,
                stockValue: stockValue,
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
                setStocksNew([]);
                setSelectedStock("");
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

    const [stocksNew, setStocksNew] = useState([]);
    const [selectedStock, setSelectedStock] = useState('');
    const [stockValue, setStockValue] = useState('');
    const [apiLoading, setapiLoading] = useState(false);
    const apiKey = 'MFA0WE7MJP0XU453';

    const stockData = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
        { symbol: 'TSLA', name: 'Tesla Inc.' },
        { symbol: 'FB', name: 'Meta Platforms Inc.' },
        { symbol: 'NFLX', name: 'Netflix Inc.' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation' },
        { symbol: 'BABA', name: 'Alibaba Group Holding Ltd.' },
        { symbol: 'DIS', name: 'Walt Disney Company' },
        { symbol: 'INTC', name: 'Intel Corporation' },
        { symbol: 'CSCO', name: 'Cisco Systems Inc.' },
        { symbol: 'ORCL', name: 'Oracle Corporation' },
        { symbol: 'IBM', name: 'International Business Machines Corporation' },
        { symbol: 'BA', name: 'Boeing Co.' },
        { symbol: 'UBER', name: 'Uber Technologies Inc.' },
        { symbol: 'LYFT', name: 'Lyft Inc.' },
        { symbol: 'ZM', name: 'Zoom Video Communications Inc.' },
        { symbol: 'TWTR', name: 'Twitter Inc.' },
        { symbol: 'SNAP', name: 'Snap Inc.' },
        { symbol: 'V', name: 'Visa Inc.' },
        { symbol: 'MA', name: 'Mastercard Inc.' },
        { symbol: 'PYPL', name: 'PayPal Holdings Inc.' },
        { symbol: 'SHOP', name: 'Shopify Inc.' },
        { symbol: 'SQ', name: 'Square Inc.' },
        { symbol: 'T', name: 'AT&T Inc.' },
        { symbol: 'VZ', name: 'Verizon Communications Inc.' },
        { symbol: 'TMUS', name: 'T-Mobile US Inc.' },
        { symbol: 'KO', name: 'The Coca-Cola Company' },
        { symbol: 'PEP', name: 'PepsiCo Inc.' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
        { symbol: 'BAC', name: 'Bank of America Corporation' },
        { symbol: 'C', name: 'Citigroup Inc.' },
        { symbol: 'GS', name: 'Goldman Sachs Group Inc.' },
        { symbol: 'MS', name: 'Morgan Stanley' },
        { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
        { symbol: 'CVX', name: 'Chevron Corporation' },
        { symbol: 'BP', name: 'BP p.l.c.' },
        { symbol: 'WMT', name: 'Walmart Inc.' },
        { symbol: 'COST', name: 'Costco Wholesale Corporation' },
        { symbol: 'HD', name: 'The Home Depot Inc.' },
        { symbol: 'LOW', name: 'Lowe\'s Companies Inc.' },
        { symbol: 'NKE', name: 'Nike Inc.' },
        { symbol: 'ADBE', name: 'Adobe Inc.' },
        { symbol: 'CRM', name: 'Salesforce Inc.' },
        { symbol: 'SBUX', name: 'Starbucks Corporation' },
        { symbol: 'MCD', name: 'McDonald\'s Corporation' },
        { symbol: 'PG', name: 'Procter & Gamble Co.' },
        { symbol: 'JNJ', name: 'Johnson & Johnson' },
        { symbol: 'MRNA', name: 'Moderna Inc.' },
        { symbol: 'PFE', name: 'Pfizer Inc.' },
        { symbol: 'AZN', name: 'AstraZeneca PLC' },
        { symbol: 'LLY', name: 'Eli Lilly and Company' },
        { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
        { symbol: 'UNH', name: 'UnitedHealth Group Incorporated' },
        { symbol: 'RDS-A', name: 'Royal Dutch Shell plc' },
        { symbol: 'GE', name: 'General Electric Company' },
        { symbol: 'GM', name: 'General Motors Company' },
        { symbol: 'F', name: 'Ford Motor Company' },
        { symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing Company Limited' },
        { symbol: 'SPCE', name: 'Virgin Galactic Holdings Inc.' },
        { symbol: 'PLTR', name: 'Palantir Technologies Inc.' },
        { symbol: 'DKNG', name: 'DraftKings Inc.' },
        { symbol: 'BB', name: 'BlackBerry Limited' },
        { symbol: 'NKLA', name: 'Nikola Corporation' },
    ];

    useEffect(() => {
        const sortedStocks = stockData.sort((a, b) => a.name.localeCompare(b.name));
        setStocksNew(sortedStocks);
    }, []);

    useEffect(() => {
        if (stocks.stockAmount && stockValue) {
            const calculatedValue = parseFloat(stocks.stockAmount) * parseFloat(stockValue);
            setStocks((prevStocks) => ({
                ...prevStocks,
                stockValue: calculatedValue.toFixed(2)
            }));
        } else if (stocks.stockAmount === '' || parseFloat(stocks.stockAmount) === 0) {
            setStocks((prevStocks) => ({
                ...prevStocks,
                stockValue: ''
            }));
        }
    }, [stocks.stockAmount, stockValue]);

    const handleStockChange = (event) => {
        const selectedSymbol = event.target.value;
        setSelectedStock(selectedSymbol);
        getStockValue(selectedSymbol);

        const stock = stockData.find(stock => stock.symbol === selectedSymbol);
        if (stock) {
            setStocks(prevStocks => ({
                ...prevStocks,
                stockName: stock.name
            }));
        }
    };
    return (
        <>



            <div className="admin">
                <div>
                    <div className="bg-muted-100 dark:bg-muted-900 pb-20">
                        <SideBar state={Active} toggle={toggleBar} />
                        <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
                            <div className="mx-auto w-full max-w-7xl">


                                <seokit />
                                <div className="min-h-screen overflow-hidden">
                                    <div className="grid gap-8 sm:grid-cols-12">
                                        <UserSideBar userid={id} />
                                        <div className="col-span-12 sm:col-span-8">

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
                                                                            <td>${transaction.stockValue || 'N/A'}</td>
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
                                </div >
                                {/**/}
                            </div>
                        </div>

                    </div>
                </div>
                {/* Modal 1 */}


                {/* Modal 1 */}
            </div>
        </>
    );
};

export default UserTransactions;