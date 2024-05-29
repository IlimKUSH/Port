import 'react-html5-camera-photo/build/css/index.css';
import {useRef, useState} from "react";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import Avatar from "../../../assets/images/avatar3.png"

const AvatarSection = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleOpenCamera = async () => {
        setIsCameraOpen(!isCameraOpen);
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

    const handleDeletePhoto = () => {
        setPhoto(null);
        setIsCameraOpen(false);
    };

    return (
        <Box>
            <Stack direction="column" alignItems="center" gap={2}>
                {isCameraOpen ? (
                    <Stack direction="column" alignItems="center" maxWidth={350}>
                        <Box component="video" ref={videoRef} autoPlay style={{display: 'block',border: "1px solid #80A9F8", width: "100%", maxHeight: "370px", borderRadius: 40}}></Box>
                        <IconButton onClick={handleCapturePhoto}>
                            <CameraAltOutlinedIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Stack>
                ) : <Box component="img" src={photo ?? Avatar} sx={{
                        border: "1px solid #80A9F8",
                        borderRadius: 10,
                        maxWidth: {md: "350px", xs: "100%"},
                        maxHeight: {md: "370px", xs: "300px"}
                    }} />
                }
                <Stack direction="row" gap={3}>
                    <IconButton onClick={handleOpenCamera}>
                        {isCameraOpen ? <CloseOutlinedIcon color="primary" fontSize="unset" /> : <CameraAltOutlinedIcon color="primary" fontSize="unset" />}
                    </IconButton>
                    <IconButton>
                        <PostAddOutlinedIcon color="primary" fontSize="unset" />
                    </IconButton>
                    <IconButton onClick={handleDeletePhoto}>
                        <DeleteOutlineIcon color="primary" fontSize="unset" />
                    </IconButton>
                </Stack>
            </Stack>

            {/* Hidden canvas element used for capturing the photo */}
            <canvas ref={canvasRef} style={{display: 'none'}} width="640" height="480"></canvas>
        </Box>
    );
};

export default AvatarSection;