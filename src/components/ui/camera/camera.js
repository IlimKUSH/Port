import {useRef, useState} from "react";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import IconButton from "@mui/material/IconButton";


const CameraButton = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleOpenCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
    };

    const handleCapturePhoto = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/png');
        setPhoto(imageData);
        setIsCameraOpen(false);

        // Stop the video stream
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    };

    return (
        <div>
            <IconButton onClick={handleOpenCamera}>
                <CameraAltOutlinedIcon color="primary" fontSize="unset"/>
            </IconButton>

            {isCameraOpen && (
                <div>
                    <video ref={videoRef} autoPlay style={{display: 'block'}}></video>
                    <button onClick={handleCapturePhoto}>Capture Photo</button>
                </div>
            )}

            {photo && (
                <div>
                    <h2>Captured Photo</h2>
                    <img src={photo} alt="Captured"/>
                </div>
            )}

            {/* Hidden canvas element used for capturing the photo */}
            <canvas ref={canvasRef} style={{display: 'none'}} width="640" height="480"></canvas>
        </div>
    );
};

export default CameraButton;