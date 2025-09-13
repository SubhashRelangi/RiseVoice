import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './CameraModal.module.css';
import { FiX } from 'react-icons/fi'; // Import the close icon

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(true);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const initializeCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsLoadingCamera(true);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please check permissions.");
        onClose();
      } finally {
        setIsLoadingCamera(false);
      }
    }
  }, [onClose, videoRef]);

  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null); // Clear stream on unmount or modal close
      }
    };
  }, [isOpen, initializeCamera]);

  if (!isOpen) return null;

  const handleCapture = () => {
    console.log("Capture Image button clicked");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
  };

  const handleStartRecording = () => {
    console.log("Start Recording button clicked");
    if (stream) {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        onCapture(blob);
        onClose();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      console.log("Stream not available to start recording.");
    }
  };

  const handleStopRecording = () => {
    console.log("Stop Recording button clicked");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.log("MediaRecorder not available to stop recording.");
    }
  };

  const handleRetake = () => {
    console.log("Retake button clicked");
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null; // Explicitly clear the video source
    }
    initializeCamera();
  };

  const handleConfirm = () => {
    console.log("OK button clicked");
    canvasRef.current.toBlob((blob) => {
      onCapture(blob);
      onClose();
      setCapturedImage(null);
    }, 'image/jpeg');
  };

  const handleClose = () => {
    console.log("Close button clicked");
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
      onClose();
      setCapturedImage(null);
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}><FiX /></button>
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
            <video ref={videoRef} autoPlay playsInline muted />
            {!isLoadingCamera && stream && (
              <div className={styles.buttonGroup}>
                <button className={styles.captureButton} onClick={handleCapture} disabled={!stream}>Capture Image</button>
                {!isRecording ? (
                  <button className={styles.captureButton} onClick={handleStartRecording} disabled={!stream}>Start Recording</button>
                ) : (
                  <button className={styles.captureButton} onClick={handleStopRecording}>Stop Recording</button>
                )}
              </div>
            )}
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CameraModal;
