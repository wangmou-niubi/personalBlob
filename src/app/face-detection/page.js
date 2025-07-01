"use client";
import { useEffect, useRef } from 'react';

export default function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let animationFrameId = null;

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('摄像头访问失败:', err);
      }
    }

    async function initOpenCV() {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `opencv.js`;
        script.async = true;
        script.onload = () => {
          cv.onRuntimeInitialized = () => {
            resolve();
          };
        };
        document.body.appendChild(script);
      });
    }

    function processVideo() {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const src = cv.imread(canvas);
        const gray = new cv.Mat();
        // 将图像转换为灰度图
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        // 将灰度图转换回彩色格式以便显示
        // 注意：这里我们将灰度值复制到所有通道，保持图像为灰色
        const dst = new cv.Mat();
        cv.cvtColor(gray, dst, cv.COLOR_GRAY2RGBA);
        // 显示灰度图
        cv.imshow(canvas, dst);
        // 释放内存
        src.delete();
        gray.delete();
        dst.delete();
      }

      animationFrameId = requestAnimationFrame(processVideo);
    }

    async function init() {
      await setupCamera();
      await initOpenCV();
      processVideo();
    }

    init();

    // 清理函数
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="face-detection-container">
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          backgroundColor: '#000'
        }}
      />
    </div>
  );
}
