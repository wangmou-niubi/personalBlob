"use client"

import './css/index.scss'
import ToolList from '@/app/blob/component/toolList/toolList.js'
import { useEffect, useRef } from 'react';
import {initFluid2d} from "./handler/index.js"


function Blob(props) {
    const containerRef = useRef(null);

    useEffect(() => {
      initFluid2d(containerRef.current)
        // 清理函数
        return () => {
            // containerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div id={'blob-container'} >
            <div ref={containerRef} className={'f2d-container'}></div>
            {/*<div className={'bg-img'}></div>*/}
            <div className={'blob-layout'}>
                <div className={'blob-scroller'}></div>
                <div className={'blob-header'}>
                    <div className={'blob-signature'}>
                        <img src={'/img/signature.png'}></img>
                    </div>
                    <div className={'blob-menu'}>
                    </div>
                </div>
                <div className='art-content'>
                    <span className={'typing'}>不想是痴了心的盼，空留我凌乱。</span>
                </div>
                <div className={'blob-content'}>
                    <div className={'left-content'}></div>
                    <div className={'middle-content'}>
                        <div className={'blob-each-content'}></div>
                    </div>
                    <div className={'right-content'}></div>
                </div>
            </div>
            <ToolList></ToolList>
        </div>
    );
}

export default Blob;
