import {useRef, useState} from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {getCookies} from "../../../hooks/get-cookies";
import Tooltip from "@mui/material/Tooltip";
import {CircularProgress} from "@mui/material";
import {toast} from "react-toastify";

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

const PassportCapture = ({setValues}) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleOpenCamera = async () => {
        setIsCameraOpen(true);
        handleOpenModal()
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {
                    facingMode: { ideal: "environment" },
                }, audio: false });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
    };

    const handleCapturePhoto = () => {
        const context = canvasRef.current.getContext('2d');
        const video = videoRef.current;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setPhoto(imageData);

        // const base64 = imageData.split(',')[1];
        // const binaryData = atob(base64)

        const base64ToBinary = (base64) => {
            const base64WithoutPrefix = base64.replace("data:image/jpeg;base64,", "");
            const binaryString = atob(base64WithoutPrefix);
            const binaryLen = binaryString.length;
            const bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        };

        const binaryData = base64ToBinary(imageData);

        handleSendPhoto(binaryData)

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

    const handleSendPhoto = async (binaryData) => {
        setLoading(true)
        const blob = new Blob([binaryData], {type: "image/jpeg"})
        const formData = new FormData()
        formData.append("file", blob, "passport.jpeg")

        await fetch(process.env.REACT_APP_PYTHON_API + "/upload", {
            method: 'POST',
            body: formData
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setValues(data["Extracted Data"])
                    toast("Проверка прошла успешно!", {type: "success"});
                    handleCloseModal()
                } else {
                    toast("Что-то пошло не так", {type: "error"});
                }
            })
            .catch((e) => {
                toast("Произошла ошибка", { type: "error" });
            })
            .finally(() => {
                setLoading(false)
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
                                <Stack direction="column" alignItems="center" gap={1}>
                                    <video ref={videoRef} autoPlay playsInline style={{
                                        display: 'block', border: "1px solid #80A9F8",
                                        width: "100%", height: "auto", borderRadius: 40
                                    }}></video>
                                    {loading ? <CircularProgress /> :
                                        <IconButton onClick={handleCapturePhoto}>
                                            <CameraAltOutlinedIcon color="primary" fontSize="large" />
                                        </IconButton>
                                    }
                                </Stack>
                            ) :
                            <Stack direction="column" alignItems="center" gap={1}>
                                <Box component="img" src={photo}
                                     sx={{
                                         border: "1px solid #80A9F8",
                                         borderRadius: 10,
                                         objectFit: "contain",
                                         width: "100%",
                                     }} />

                                {isCameraOpen ?
                                    <IconButton onClick={handleCapturePhoto}>
                                        <CameraAltOutlinedIcon color="primary" fontSize="large" />
                                    </IconButton> : <IconButton onClick={handleOpenCamera}>
                                        <CloseOutlinedIcon color="primary" fontSize="large" />
                                    </IconButton>
                                }
                            </Stack>
                        }
                    </Stack>
                </Box>
            </Modal>

            <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
        </Box>
    );
};

export default PassportCapture;
