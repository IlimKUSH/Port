import {useEffect, useState} from "react";
import { Html5Qrcode } from "html5-qrcode";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {getCookies} from "../../../hooks/get-cookies";

const BarcodeScanner = () => {
    const cookies = getCookies();

    const [isEnabled, setEnabled] = useState(false);

    useEffect(() => {
        if (!isEnabled) return
        const config = { fps: 10, qrbox: {width: 410, height: 270} };

        const html5QrCode = new Html5Qrcode("barcodeContainer");

        const barcodeScanerStop = () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop();
            }
        };

        const barcodeCodeSuccess = (decodedText) => {
            console.log(decodedText)
            onSuccess(decodedText)
            setEnabled(false);
        };

        if (isEnabled) {
            html5QrCode.start({ facingMode: "environment" }, config, barcodeCodeSuccess, () => {});
        } else {
            barcodeScanerStop();
        }

        return () => {
            barcodeScanerStop();
        };
    }, [isEnabled]);

    const handleToggle = () => {
        setEnabled(!isEnabled)
    }

    const onSuccess = async (code) => {
        await fetch(process.env.REACT_APP_AXELOR_API + `/ws/product/barcode/${code}`, {
            "Authorization": "Basic YWRtaW46QWRtaW4yMDI0",
            'X-CSRF-Token': cookies['CSRF-TOKEN'],
        })
            .then((res) => res.json())
            .then((data) => window.open(data?.data, "_blank"))
    }

    return (
        <Box pb={10}>
            <Button variant="contained" sx={{color: "#fff"}} onClick={handleToggle}>
                {isEnabled ? "Закрыть сканер" : "Открыть сканер"}
            </Button>

            {isEnabled && <Box
                sx={{
                    height: isEnabled ? "unset" : "296px",
                    background: "#24334B",
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    id="barcodeContainer"
                    sx={{
                        width: '100%',
                        height: '100%',
                        maxWidth: '500px',
                        aspectRatio: '16/9', // Ensure it maintains the aspect ratio
                        borderRadius: '10px',
                        overflow: 'hidden',
                    }}
                />
            </Box>}

        </Box>
    );
};

export default BarcodeScanner;