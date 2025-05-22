"use client"
import {useEffect, useState, useRef} from 'react';
import './css/index.scss'
import img from '@/assets/img/头像.jpg'
import {initAll} from "@/handler/main.js";
import Link from 'next/link';

const Home = (props) => {
    let [pages, setPages] = useState('')
    let domRef = useRef(null)

    useEffect(() => {
        const multiple = 20;
        const element = document.getElementById("transform-t");
        function transformElement(x, y) {
            let box = element.getElementsByClassName('introduction-container')[0].getBoundingClientRect();
            let calcX = -(y - box.y - (box.height / 2)) / multiple;
            let calcY = (x - box.x - (box.width / 2)) / multiple;
            // let calcZ = Math.abs(calcY)> Math.abs(calcX)?calcY:calcX
            element.getElementsByClassName('introduction-container')[0].style.transform = "rotateX(" + calcX + "deg) "
                + "rotateY(" + calcY + "deg)";
            let angle = Math.floor(getMouseAngle((y - box.y - (box.height / 2)), (x - box.x - (box.width / 2))));
            element.style.setProperty("--angle", `${-angle}deg`);
            element.getElementsByClassName('introduction-container')[0].style.boxShadow = ` 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #E91E63, 0 0 70px #E91E63, 0 0 80px #E91E63, 0 0 100px #E91E63, 0 0 150px #E91E63;`
        }
        function getMouseAngle(x, y) {
            const radians = Math.atan2(y, x);
            let angle = radians * (180 / Math.PI);

            if (angle < 0) {
                angle += 360;
            }

            return angle;
        }
        element.addEventListener('mousemove', (e) => {
            transformElement(e.clientX, e.clientY);
        });
        element.addEventListener('mouseleave', () => {
            resetTransformElement(element)
        });
        function resetTransformElement(element) {
            element.getElementsByClassName('introduction-container')[0].style.transform  = "rotateX("+ 0 +"deg) "
                + "rotateY("+ 0 +"deg)";
        }
        initAll(domRef)
    }, [pages])
    return (
        <div id={'main-container'} style={{position: "absolute", height: "100vh"}}>
            <div className={'scroller'}></div>
            <div id={"canvas-container"} ref={domRef}></div>
            <div id={"page-container"}>
                <div className={'flex-layout'}>
                    <div className="eachContent">
                        <div className={'blur-filter'} id={'transform-t'}>
                            <div className={'introduction-container cursor-pointer'}>
                                <div className={'translate-title1 translate-font'}>
                                    <img style={{borderRadius: '50%'}} src={img} alt="头像"/>
                                </div>
                                <div className={'translate-title translate-font'} style={{'--translatevar':'150px'}}>
                                    一个前端牛马
                                </div>
                                <div className={'translate-title translate-font'} style={{'--translatevar':'50px'}}>
                                    竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生！
                                </div>

                                <div className={'translate-title translate-font'} style={{'--translatevar':'100px'}}>
                                    <Link ></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="eachContent">
                        <div className={'error-page blur-filter'}>
                        <span className={'title'}>
                        哎呀出错了~~
                            </span>
                        </div>
                    </div>
                    <div className="eachContent">
                        <div className={'inset-container'}>
                            <div>
                                <span className={'shadow-font'}>你好</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <svg>
                <defs>
                    <filter id="fe1">
                        <feTurbulence id="animation" type="fractalNoise" baseFrequency="999.9999999 0.00001"
                                      numOctaves="1"
                                      result="warp">
                            <animate attributeName="baseFrequency"
                                     values="999.9999 0.00001;0.001 0.00001;0.00001 999.9999;"
                                     dur="2s"
                                     repeatCount="indefinite"/>
                        </feTurbulence>
                        <feOffset dx="-90" dy="-90" result="warpOffset"></feOffset>
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic"
                                           in2="warpOffset"></feDisplacementMap>
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default Home;