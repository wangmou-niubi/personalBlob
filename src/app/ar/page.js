'use client';

import { useState, useEffect } from 'react';
import './css/index.scss'

export default function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 获取数据
    fetch('/api/about')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className={'ar-container'}>
        <div className={'ar-canvas-container'}>
        </div>
    </div>
  );
}