import {useRef, useState} from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import Avatar from "../../../assets/images/avatar.png"
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 1,
    p: 2,
}

const PassportCapture = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [photo, setPhoto] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleOpenCamera = async () => {
        setIsCameraOpen(!isCameraOpen);
        handleOpenModal()
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
        console.log(imageData)
        handleSendPhoto(imageData)
        setPhoto(imageData);
        setIsCameraOpen(false);

        // Stop the video stream
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    };

    const handleOpenModal = () => {
        setOpen(true)
    }

    const handleCloseModal = () => {
        setOpen(false)
    }

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
            <Tooltip title="Проверка по паспорту">
                <IconButton onClick={handleOpenCamera}>
                    <PostAddOutlinedIcon color="primary" fontSize="unset" />
                </IconButton>
            </Tooltip>

            <Modal
                open={open}
                onClose={handleCloseModal}
            >
                <Box sx={modalStyles}>
                    <Stack direction="column" gap={2} sx={{
                        width: { xs: "320px", md: "400px" },
                    }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">
                                Проверка по паспорту
                            </Typography>
                            <IconButton onClick={handleCloseModal}>
                                <CloseOutlinedIcon />
                            </IconButton>
                        </Stack>
                        {isCameraOpen ? (
                            <Stack direction="column" alignItems="center">
                                <Box component="video" ref={videoRef} autoPlay style={{display: 'block',border: "1px solid #80A9F8", width: "100%", maxHeight: "370px", borderRadius: 40}}></Box>
                                <IconButton onClick={handleCapturePhoto}>
                                    <CameraAltOutlinedIcon color="primary" fontSize="large" />
                                </IconButton>
                            </Stack>
                        ) : <Box component="img" src={photo}
                                 sx={{
                                     border: "1px solid #80A9F8",
                                     borderRadius: 10,
                                     maxWidth: "100%",
                                     maxHeight: {md: "370px", xs: "300px"}
                                 }} />
                        }
                    </Stack>
                </Box>
            </Modal>

            {/* Hidden canvas element used for capturing the photo */}
            <canvas ref={canvasRef} style={{display: 'none'}} width="640" height="480"></canvas>
        </Box>
    );
};

export default PassportCapture;