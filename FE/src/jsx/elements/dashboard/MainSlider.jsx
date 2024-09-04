import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SolanaImg from '../../../assets/images/solana-sol-vector-logo-seeklogo/solana-sol-seeklogo.svg'
import bNBImg from '../../../assets/images/bnb-bnb-logo.svg'
import axios from 'axios';
import SwiperLineChart from './SwiperLineChart';
import { SVGICON } from '../../constant/theme';

const MainSlider = () => {
    const [swiperData, setSwiperData] = useState([
        { color: 'bg-dark', amount: '0', chartcolor: 'rgba(148, 150, 176, 1)', svgicon: SVGICON.SwiperEthSvg },
        { color: 'bg-warning', amount: '0', chartcolor: 'rgba(247, 215, 168, 1)', svgicon: SVGICON.SwiperBitSvg },
        { color: 'bg-warning', amount: '0', chartcolor: 'rgba(247, 215, 168, 1)', svgicon: SVGICON.XrpUsdIcon },
    ]);

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                    params: {
                        ids: 'bitcoin,ethereum,tether,solana,binancecoin',
                        vs_currencies: 'usd',
                    },
                });

                const { bitcoin, ethereum, binancecoin, solana } = response.data;

                setSwiperData([
                    { color: 'bg-warning', amount: bitcoin.usd, chartcolor: 'rgba(247, 215, 168, 1)', svgicon: SVGICON.SwiperBitSvg },
                    { color: 'bg-dark', amount: ethereum.usd, chartcolor: 'rgba(148, 150, 176, 1)', svgicon: SVGICON.SwiperEthSvg },
                    { color: 'bg-warning', amount: binancecoin.usd, chartcolor: 'rgba(247, 215, 168, 1)', svgicon: <img style={{ width: "60px" }} src={bNBImg} /> },
                    { color: 'bg-warning', amount: solana.usd, chartcolor: 'rgba(247, 215, 168, 1)', svgicon: <img style={{width:"60px"}} src={SolanaImg}/> },
                ]);
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        };

        fetchCryptoPrices();

        // Optionally, set an interval to update prices every minute
        const interval = setInterval(fetchCryptoPrices, 60000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Swiper
                className="mySwiper-counter position-relative overflow-hidden"
                slidesPerView={4}
                speed={1500}
                spaceBetween={40}
                parallax={true}
                loop={false}
                
                autoplay={{
                    delay: 5000,
                }}
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    991: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                }}
            >
                {swiperData.map((item, i) => (
                    <SwiperSlide key={i}>
                        <div className={`card card-box bg-secondary ${item.color}`}>
                            <div className="card-header border-0 pb-0">
                                <div className="chart-num">
                                    {/* <p>
                                        <i className="fa-solid fa-sort-down me-2" />
                                        4%(30 days)
                                    </p> */}
                                    <h2 className="font-w600 mb-0">${item.amount}</h2>
                                </div>
                                <div className="dlab-swiper-circle">
                                    {item.svgicon}
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div id="widgetChart1" className="chart-primary">
                                    <SwiperLineChart chartcolor={item.chartcolor} />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default MainSlider;
