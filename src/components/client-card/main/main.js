import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Avatar from "../../../assets/images/avatar.png"

const Main = () => {
    return (
        <Card variant="outlined" sx={{
            p: 4,
            borderRadius: 2
        }}>
            <Stack gap={4} sx={{
                flexDirection: {
                    md: "row",
                    sm: "column"
                }
            }}>
                <Stack direction="column" alignItems="center" gap={2}>
                    <Box component="img" src={Avatar} sx={{
                        border: "1px solid #80A9F8",
                        borderRadius: 10,
                        maxWidth: {md: "350px", sm: "100%", xs: "200px"},
                        maxHeight: {md: "370px", sm: "300px", xs: "220px"}
                    }} />
                    <Stack direction="row" gap={3}>
                        <IconButton>
                            <CameraAltOutlinedIcon color="primary" fontSize="unset" />
                        </IconButton>
                        <IconButton>
                            <PostAddOutlinedIcon color="primary" fontSize="unset" />
                        </IconButton>
                        <IconButton>
                            <DeleteOutlineIcon color="primary" fontSize="unset" />
                        </IconButton>
                    </Stack>
                </Stack>
                <Card variant="outlined" sx={{flex: 1, p: {md: "20px", xs: 0}, borderRadius: 2, borderWidth: {md: "1px", xs: 0}}}>
                    <Stack direction="column" gap={2}>
                        <TextField label="Фамилия Имя" variant="standard"
                                   InputLabelProps={{
                                       sx: {fontSize: "14px", color: "#ACB1C0"},
                                   }}
                                   defaultValue="Батырбаев Дайыр"
                                   sx={{
                                       ".MuiInputBase-root": {
                                           fontWeight: 600
                                       }
                                   }}
                        />
                        <TextField label="ПИН" variant="standard"
                                   InputLabelProps={{
                                       sx: {fontSize: "14px", color: "#ACB1C0"},
                                   }}
                                   defaultValue="22102197300812"
                                   sx={{
                                       ".MuiInputBase-root": {
                                           fontWeight: 600
                                       }
                                   }}
                        />
                        <TextField label="Номер документа" variant="standard"
                                   InputLabelProps={{
                                       sx: {fontSize: "14px", color: "#ACB1C0"},
                                   }}
                                   defaultValue="ID3726151"
                                   sx={{
                                       ".MuiInputBase-root": {
                                           fontWeight: 600
                                       }
                                   }}
                        />
                        <TextField type="date" variant="standard" label="Срок действия"
                                   InputLabelProps={{
                                       shrink: true,
                                       sx: {fontSize: "14px", color: "#ACB1C0"},
                                   }}
                                   defaultValue='2031-05-14'
                                   sx={{
                                       ".MuiInputBase-root": {
                                           fontWeight: 600
                                       }
                                   }}
                        />
                        <TextField type="date" variant="standard" label="Дата рождения"
                                   InputLabelProps={{
                                       shrink: true,
                                       sx: {fontSize: "14px", color: "#ACB1C0"},
                                   }}
                                   defaultValue={'1973-02-21'}
                                   sx={{
                                       ".MuiInputBase-root": {
                                           fontWeight: 600
                                       }
                                   }}
                        />
                    </Stack>
                </Card>
            </Stack>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                mt: 6
            }}>
                <Button variant="contained" sx={{fontWeight: 700, color: "#fff", width: 320, borderRadius: 10}}>Сохранить</Button>
            </Box>
        </Card>
    );
};

export default Main;