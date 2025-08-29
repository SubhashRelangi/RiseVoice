import React, { useRef, useEffect, useState } from 'react';
import styles from './CameraModal.module.css';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startStream = async () => {
      if (isOpen && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access the camera. Please check permissions.");
          onClose();
        }
      }
    };

    startStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    canvasRef.current.toBlob((blob) => {
      onCapture(blob);
      onClose();
      setCapturedImage(null);
    }, 'image/jpeg');
  };

  const handleClose = () => {
      onClose();
      setCapturedImage(null);
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}>&times;</button>
        {capturedImage ? (
          <div className={styles.previewContainer}>
            <img src={capturedImage} alt="Captured preview" />
            <div className={styles.buttonGroup}>
              <button onClick={handleRetake}>Retake</button>
              <button onClick={handleConfirm}>OK</button>
            </div>
          </div>
        ) : (
          <div className={styles.videoContainer}>
            <video ref={videoRef} autoPlay playsInline />
            <button className={styles.captureButton} onClick={handleCapture}>Capture</button>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CameraModal;