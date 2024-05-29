import Stack from "@mui/material/Stack";
import Header from "./header/header";
import Main from "./main/main";

const ClientCard = () => {
    return (
        <Stack direction="column" gap={6}>
            <Header />
            <Main />
        </Stack>
    );
};

export default ClientCard;