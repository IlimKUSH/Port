import {useRef, useState} from 'react';
import Webcam from "react-webcam";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const RecordSection = () => {
    const [open, setOpen] = useState(false);
    const [recording, setRecording] = useState(false);
    const [progress, setProgress] = useState(0);

    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);

    const startRecording = async () => {
        setRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'video/webm',
        });

        let chunks = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            // TODO FACEID
            const formData = new FormData();
            formData.append("file", blob);
            console.log(blob)
            chunks = [];
            stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current.start();
        setTimeout(() => {
            handleStopCapture()
        }, 2000);
    };

    const handleStopCapture = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    }

    const handleOpenModal = () => {
        setOpen(true)
        startRecording()
    }

    const handleCloseModal = () => {
        setOpen(false)
        handleStopCapture()
    }

    return (
        <>
            <Button onClick={handleOpenModal} variant="outlined" color="primary" sx={{ textTransform: "unset"}}  endIcon={<DocumentScannerIcon />}>
                Распознать клиента
            </Button>
            <Modal
                open={open}
                onClose={handleCloseModal}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Box sx={{
                        position: "relative",
                        width: { xs: "320px", md: "400px" },
                        height: { xs: "320px", md: "400px" },
                    }}>
                        <Webcam
                            style={{
                                display: "block",
                                borderRadius: "50%",
                                border: `2px solid "#000"`,
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                            }}
                            videoConstraints={{ facingMode: "user" }}
                            ref={videoRef}
                        />
                        {recording &&
                            <CircularProgress
                                color="success"
                                size="100%"
                                thickness={0.5}
                                variant="determinate"
                                value={progress}
                                sx={{ position: "absolute", top: 0, left: 0 }}
                            />
                        }
                        {!recording && (
                            <Box
                                sx={{
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "absolute",
                                    background: "#000",
                                    opacity: 0.5,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    transition: "opacity 0.5s",
                                    "&:hover": {
                                        opacity: 0,
                                    },
                                }}
                                onClick={startRecording}
                            >
                                <Typography align="center" color="contrast.main" variant="h4">
                                    Распознать клиента
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default RecordSection;