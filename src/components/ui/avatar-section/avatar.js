import {useRef, useState} from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import PassportCapture from "../passport-capture/passport-capure";

import Avatar from "../../../assets/images/avatar.png"

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
        handleSendPhoto(imageData)
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

    const handleSendPhoto = async (base64) => {
        await fetch("https://narynport.brisklyminds.com/ndp/ws/files/upload", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic YWRtaW46QWRtaW4yMDI0",
            },
            body: base64
        })
    }

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
                    <Tooltip title={isCameraOpen ? "Выключить камеру" : "Включить камеру"}>
                        <IconButton onClick={handleOpenCamera}>
                            {isCameraOpen ? <CloseOutlinedIcon color="primary" fontSize="unset" /> : <CameraAltOutlinedIcon color="primary" fontSize="unset" />}
                        </IconButton>
                    </Tooltip>
                    {/*<Tooltip title="Проверка по паспорту">*/}
                    {/*    <IconButton>*/}
                    {/*        <PostAddOutlinedIcon color="primary" fontSize="unset" />*/}
                    {/*    </IconButton>*/}
                    {/*</Tooltip>*/}
                    <PassportCapture />
                    <Tooltip title="Удалить фото">
                        <IconButton onClick={handleDeletePhoto}>
                            <DeleteOutlineIcon color="primary" fontSize="unset" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            {/* Hidden canvas element used for capturing the photo */}
            <canvas ref={canvasRef} style={{display: 'none'}} width="640" height="480"></canvas>
        </Box>
    );
};

export default AvatarSection;