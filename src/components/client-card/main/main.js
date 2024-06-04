import {useEffect, useState} from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import {yupResolver} from "@hookform/resolvers/yup";

import AvatarSection from "../../ui/avatar-section/avatar";
import {Controller, useForm} from "react-hook-form";
import {user} from "../../../validator-schemas/user";
import {getCookies} from "../../../hooks/get-cookies";
import Header from "../header/header";
import BarcodeScanner from "../../ui/barcode-scanner/barcode-scanner";
import Typography from "@mui/material/Typography";
import {toast} from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const Main = () => {
    const cookies = getCookies();

    const [faceIdPictureId, setFaceIdPictureId] = useState(null)
    const [faceIdPartnerId, setFaceIdPartnerId] = useState(null)
    const [partnerId, setPartnerId] = useState(null)
    const [pictureId, setPictureId] = useState(null);
    const [values, setValues] = useState(null)
    const [faceId, setFaceId] = useState(null)
    const [resetForm, setResetForm] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        formState: {
            errors
        },
        control,
        handleSubmit,
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(user),
    });

    useEffect(() => {
        setValue("name", values?.name)
        setValue("passportPersonalNumber", values?.passportPersonalNumber)
        setValue("passportPersonalSeries", values?.passportPersonalSeries)
        setValue("passportValidity", values?.passportValidity)
        setValue("dateOfBirth", values?.dateOfBirth)
    }, [values]);

    useEffect(() => {
        if (!faceId) return;

        console.log("useEffect", faceId)
        fetch(process.env.REACT_APP_AXELOR_API + `/ws/rest/com.axelor.apps.base.db.Partner/${faceId}/fetch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic YWRtaW46QWRtaW4yMDI0",
                'X-CSRF-Token': cookies['CSRF-TOKEN'],
            },
            body: JSON.stringify({
                fields: [
                    "passportPersonalNumber",
                    "name",
                    "passportPersonalSeries",
                    "passportValidity",
                    "dateOfBirth",
                    "picture"
                ]
            })
        })
            .then((res) => res.json())
            .then((data) => {
                data?.data?.map((item) => {
                    setValue("name", item?.name)
                    setValue("passportPersonalNumber", item?.passportPersonalNumber)
                    setValue("passportPersonalSeries", item?.passportPersonalSeries)
                    setValue("passportValidity", item?.passportValidity)
                    setValue("dateOfBirth", item?.dateOfBirth)
                    setFaceIdPictureId(item.picture.id)
                    setFaceIdPartnerId(item.id)
                })
            })
    }, [faceId])

    const onSubmit = async (data) => {
        setLoading(true)

        const payload = {
            data: {
                faceIdUpdate: true,
                ...data,
            }
        };

        if (pictureId !== null) {
            payload.data.picture = { id: pictureId };
        }

        if (partnerId !== null || faceIdPartnerId !== null) {
            payload.data.id = partnerId ?? faceIdPartnerId;
        }

        await fetch(process.env.REACT_APP_AXELOR_API + "/ws/v2/rest/com.axelor.apps.base.db.Partner", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic YWRtaW46QWRtaW4yMDI0",
                'X-CSRF-Token': cookies['CSRF-TOKEN'],
            },
            body: JSON.stringify(payload)
        })
            .then((res) => (res.json()))
            .then((data) => {
                if (data) {
                    setPartnerId(data.data.id)
                    toast("Успешно!", {type: "success"});
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

    const handleResetForm = () => {
        reset()
        setFaceId(null)
        setResetForm(true)
        setPartnerId(null)
        setFaceIdPartnerId(null)
    }

    return (
        <>
            <Header setFaceId={setFaceId} handleResetForm={handleResetForm} />

            <Card component="form" onSubmit={handleSubmit(onSubmit)} variant="outlined" sx={{
                p: 4,
                borderRadius: 2
            }}>
                <Stack gap={4} sx={{
                    flexDirection: {
                        md: "row",
                        sm: "column"
                    }
                }}>
                    <AvatarSection resetForm={resetForm} setResetForm={setResetForm} pictureId={faceIdPictureId} faceId={faceId}
                                   setValues={(values) => setValues(values)} setPictureId={(id) => setPictureId(id)} />
                    <Card variant="outlined"
                          sx={{flex: 1, p: {md: "20px", xs: 0}, borderRadius: 2, borderWidth: {md: "1px", xs: 0}}}>
                        <Stack direction="column" gap={2}>
                            <Controller name="name" control={control} render={({field}) => (
                                <TextField {...field} label="Фамилия Имя" variant="standard"
                                           InputLabelProps={{
                                               shrink: true,
                                               sx: {fontSize: "14px", color: "#ACB1C0"},
                                           }}
                                           sx={{
                                               ".MuiInputBase-root": {
                                                   fontWeight: 600
                                               }
                                           }}
                                           error={!!errors.name?.message ?? false}
                                           helperText={!!errors.name?.message && <Typography variant="caption">{errors.name.message}</Typography>}
                                           value={field.value != null ? field.value : ""}
                                />
                            )}/>

                            <Controller name="passportPersonalNumber" control={control} render={({field}) => (
                                <TextField {...field} label="ПИН" variant="standard"
                                           InputLabelProps={{
                                               shrink: true,
                                               sx: {fontSize: "14px", color: "#ACB1C0"},
                                           }}
                                           sx={{
                                               ".MuiInputBase-root": {
                                                   fontWeight: 600
                                               }
                                           }}
                                           error={!!errors.passportPersonalNumber?.message ?? false}
                                           helperText={!!errors.passportPersonalNumber?.message && <Typography variant="caption">{errors.passportPersonalNumber.message}</Typography>}
                                           value={field.value != null ? field.value : ""}
                                />
                            )}/>

                            <Controller name="passportPersonalSeries" control={control} render={({field}) => (
                                <TextField {...field} label="Номер документа" variant="standard"
                                           InputLabelProps={{
                                               shrink: true,
                                               sx: {fontSize: "14px", color: "#ACB1C0"},
                                           }}
                                           sx={{
                                               ".MuiInputBase-root": {
                                                   fontWeight: 600
                                               }
                                           }}
                                           error={!!errors.passportPersonalSeries?.message ?? false}
                                           helperText={!!errors.passportPersonalSeries?.message && <Typography variant="caption">{errors.passportPersonalSeries.message}</Typography>}
                                           value={field.value != null ? field.value : ""}
                                />
                            )}/>

                            <Controller name="passportValidity" control={control} render={({field}) => (
                                <TextField {...field} type="date" variant="standard" label="Срок действия"
                                           InputLabelProps={{
                                               shrink: true,
                                               sx: {fontSize: "14px", color: "#ACB1C0"},
                                           }}
                                           sx={{
                                               ".MuiInputBase-root": {
                                                   fontWeight: 600
                                               }
                                           }}
                                           error={!!errors.passportValidity?.message ?? false}
                                           helperText={!!errors.passportValidity?.message && <Typography variant="caption">{errors.passportValidity.message}</Typography>}
                                           value={field.value != null ? field.value : ""}
                                />
                            )}/>

                            <Controller name="dateOfBirth" control={control} render={({field}) => (
                                <TextField {...field} type="date" variant="standard" label="Дата рождения"
                                           InputLabelProps={{
                                               shrink: true,
                                               sx: {fontSize: "14px", color: "#ACB1C0"},
                                           }}
                                           sx={{
                                               ".MuiInputBase-root": {
                                                   fontWeight: 600
                                               }
                                           }}
                                           error={!!errors.dateOfBirth?.message ?? false}
                                           helperText={!!errors.dateOfBirth?.message && <Typography variant="caption">{errors.dateOfBirth.message}</Typography>}
                                           value={field.value != null ? field.value : ""}
                                />
                            )}/>
                        </Stack>
                    </Card>
                </Stack>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 6
                }}>
                    {loading ? <CircularProgress /> : <Button type="submit" variant="contained"
                                                              sx={{fontWeight: 700, color: "#fff", width: 320, borderRadius: 10}}>Сохранить</Button>}
                </Box>
            </Card>

            {/*<BarcodeScanner />*/}

        </>
    );
};

export default Main;