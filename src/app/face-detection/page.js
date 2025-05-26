"use client";
import { useEffect, useRef } from 'react';

export default function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function setupCamera() {
      // 加载opencv.js
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/4.5.5/opencv.js';
      script.async = true;
      script.onload = initOpenCV;
      document.body.appendChild(script);

      // 获取摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }

    function initOpenCV() {
      // opencv.js加载完成后初始化
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // 创建人脸检测循环
      function processVideo() {
        if (!video.videoWidth) return;
        
        // 设置画布尺寸
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 绘制视频帧
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 人脸检测逻辑
        const src = cv.imread(canvas);
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        
        // 加载预训练的人脸检测模型
        const faceCascade = new cv.CascadeClassifier();
        faceCascade.load('haarcascade_frontalface_default.xml');
        
        const faces = new cv.RectVector();
        faceCascade.detectMultiScale(gray, faces);
        
        // 绘制检测框
        for (let i = 0; i < faces.size(); ++i) {
          const face = faces.get(i);
          const point1 = new cv.Point(face.x, face.y);
          const point2 = new cv.Point(face.x + face.width, face.y + face.height);
          cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        }
        
        cv.imshow(canvas, src);
        src.delete(); gray.delete(); faces.delete();
        requestAnimationFrame(processVideo);
      }
      
      video.addEventListener('playing', () => {
        processVideo();
      });
    }

    setupCamera();
    
    return () => {
      // 清理资源
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="face-detection-container">
      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} />
    </div>
  );
}