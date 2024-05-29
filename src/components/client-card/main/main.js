import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { yupResolver } from "@hookform/resolvers/yup";

import AvatarSection from "../../ui/avatar-section/avatar";
import {Controller, useForm} from "react-hook-form";
import {user} from "../../../validator-schemas/user";

const Main = () => {
    const {
        control,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(user)
    });

    const onSubmit = async (data) => {
        await fetch("https://narynport.brisklyminds.com/ndp/ws/v2/rest/com.axelor.apps.base.db.Partner", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic YWRtaW46QWRtaW4yMDI0",
                // "X-Csrf-Token": "a57f36ec28de4ced94465cf66f6a9b61",
                "CSRF-TOKEN": "97b5a78996564c0d88e06ab0b184b0d3",
                // "JSESSIONID": "7403DD5B11959FE1FAEFFE80C37F8192"
            },
            body: JSON.stringify({
                ...data
            })
        })
    }

    return (
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
                <AvatarSection />
                <Card variant="outlined" sx={{flex: 1, p: {md: "20px", xs: 0}, borderRadius: 2, borderWidth: {md: "1px", xs: 0}}}>
                    <Stack direction="column" gap={2}>
                        <Controller name="name" control={control} render={({field}) => (
                            <TextField {...field} label="Фамилия Имя" variant="standard"
                               InputLabelProps={{
                                   sx: {fontSize: "14px", color: "#ACB1C0"},
                               }}
                               sx={{
                                   ".MuiInputBase-root": {
                                       fontWeight: 600
                                   }
                               }}
                            />
                        )} />

                        <Controller name="passportPersonalNumber" control={control} render={({field}) => (
                            <TextField {...field} label="ПИН" variant="standard"
                               InputLabelProps={{
                                   sx: {fontSize: "14px", color: "#ACB1C0"},
                               }}
                               sx={{
                                   ".MuiInputBase-root": {
                                       fontWeight: 600
                                   }
                               }}
                            />
                        )} />

                        <Controller name="passportPersonalSeries" control={control} render={({field}) => (
                            <TextField {...field} label="Номер документа" variant="standard"
                               InputLabelProps={{
                                   sx: {fontSize: "14px", color: "#ACB1C0"},
                               }}
                               sx={{
                                   ".MuiInputBase-root": {
                                       fontWeight: 600
                                   }
                               }}
                            />
                        )} />

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
                            />
                        )} />

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
                            />
                        )} />
                    </Stack>
                </Card>
            </Stack>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                mt: 6
            }}>
                <Button type="submit" variant="contained" sx={{fontWeight: 700, color: "#fff", width: 320, borderRadius: 10}}>Сохранить</Button>
            </Box>
        </Card>
    );
};

export default Main;