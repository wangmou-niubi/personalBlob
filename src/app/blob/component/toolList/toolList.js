"use client"

import { useEffect, useState } from 'react'; // 添加React Hooks
import './css/index.scss'

const ToolList = () => {
  const [showScroll, setShowScroll] = useState(false); // 控制按钮显示

  // 滚动事件处理器
  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 200){
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 200){
      setShowScroll(false)
    }
  };

  // 平滑滚动到顶部
  const scrollToTop = () => {
    console.log(11231231);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 使用原生平滑滚动
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [showScroll]); // 添加滚动监听

  return (
    <div className={'action-button-list'}>
      <div 
        className={`each-tool ${showScroll ? 'visible' : ''}`}
        style={{opacity: showScroll ? 1 : 0, transition: 'opacity 0.3s'}}
      >
        <div 
          className="back-to-top" 
          onClick={scrollToTop}
          title="返回顶部"
        >
          T
        </div>
      </div>
    </div>
  );
};

export default ToolList;