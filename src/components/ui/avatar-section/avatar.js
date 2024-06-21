import {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import PassportCapture from "../passport-capture/passport-capture";

import Avatar from "../../../assets/images/avatar.png"
import {getCookies} from "../../../hooks/get-cookies";

const AvatarSection = ({resetForm, setResetForm, pictureId, faceId, setPictureId, setValues}) => {
    const cookies = getCookies();

    const [faceIdPhoto, setFaceIdPhoto] = useState(null)
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
        const video = videoRef.current;

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        const imageData = canvasRef.current.toDataURL('image/png');
        setPhoto(imageData);

        const base64ToBinary = (base64) => {
            const base64WithoutPrefix = base64.replace("data:image/png;base64,", "");
            const binaryString = atob(base64WithoutPrefix);
            const binaryLen = binaryString.length;
            const bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        };
        const binaryData = base64ToBinary(imageData);
        handleSendPhoto(binaryData);

        setIsCameraOpen(false);

        // Stop the video stream
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    };

    const handleDeletePhoto = () => {
        setPhoto(null);
        console.log(3)
        setFaceIdPhoto(null);
        setIsCameraOpen(false);
    };

    const handleSendPhoto = async (binary) => {
        await fetch(process.env.REACT_APP_AXELOR_API + "/ws/files/upload", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                "Authorization": "Basic YWRtaW46QWRtaW4yMDI0",
                'X-CSRF-Token': cookies['CSRF-TOKEN'],
                "X-File-Name": "Avatar.png",
                "X-File-Offset": "0",
                "X-File-Size": binary.byteLength.toString(),
                "X-File-Type": "image/png"
            },
            body: binary.buffer
        })
            .then((res) => res.json())
            .then((data) => {
                setPictureId(data.id)
            })
    }

    useEffect(() => {
        if (!pictureId || !faceId) return;
        fetch(process.env.REACT_APP_AXELOR_API + `/ws/rest/com.axelor.meta.db.MetaFile/${pictureId ?? faceId}/content/download`, {
            method: "GET",
            headers: {
                "Authorization": "Basic YWRtaW46QWRtaW4yMDI0",
                'X-CSRF-Token': cookies['CSRF-TOKEN'],
            }
        })
            .then((res) => res.blob())
            .then((data) => {
                console.log(data);
                setFaceIdPhoto(URL.createObjectURL(data))
            })
    }, [pictureId, faceId]);

    useEffect(() => {
        if (resetForm) {
            handleDeletePhoto()
            setResetForm(false)
        }
    }, [resetForm, setResetForm])

    return (
        <Box>
            <Stack direction="column" alignItems="center" gap={2}>
                {isCameraOpen ? (
                    <Stack direction="column" alignItems="center" maxWidth={350}>
                        <video ref={videoRef} autoPlay playsInline style={{display: 'block',
                            border: "1px solid #80A9F8", width: "100%", height: "auto", borderRadius: 40}}></video>
                        <IconButton onClick={handleCapturePhoto}>
                            <CameraAltOutlinedIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Stack>
                ) : <Box component="img" src={photo ?? faceIdPhoto ?? Avatar} sx={{
                        border: "1px solid #80A9F8",
                        borderRadius: 10,
                        objectFit: "contain",
                        maxWidth: {md: "300px", xs: "100%"},
                    }} />
                }
            </Stack>

            <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
        </Box>
    );
};

export default AvatarSection;