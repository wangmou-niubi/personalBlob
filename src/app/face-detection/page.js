"use client";
import { useEffect, useRef } from 'react';

export default function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let animationFrameId = null;
  let faceCascade = null;

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
            faceCascade = new cv.CascadeClassifier();
            // 使用正确的路径加载模型文件
            const modelPath = `haarcascade_frontalface_default.xml`;
            faceCascade.load(modelPath);
            resolve();
          };
        };
        document.body.appendChild(script);
      });
    }

    function processVideo() {
      if (!videoRef.current || !canvasRef.current || !faceCascade) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const src = cv.imread(canvas);
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        const faces = new cv.RectVector();
        faceCascade.detectMultiScale(gray, faces);

        // 添加特效 - 红色矩形
        for (let i = 0; i < faces.size(); ++i) {
          const face = faces.get(i);
          const point1 = new cv.Point(face.x, face.y);
          const point2 = new cv.Point(face.x + face.width, face.y + face.height);

          // 绘制红色矩形
          cv.rectangle(src, point1, point2, [255, 0, 0, 255], 3);

          // 添加特效 - 在矩形上方添加文字
          const textPoint = new cv.Point(face.x, face.y - 10);
          cv.putText(src, 'Face', textPoint, cv.FONT_HERSHEY_SIMPLEX, 0.8, [255, 0, 0, 255], 2);
        }

        cv.imshow(canvas, src);

        src.delete();
        gray.delete();
        faces.delete();
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
      if (faceCascade) {
        faceCascade.delete();
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
