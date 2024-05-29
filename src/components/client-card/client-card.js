import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ClientCard = () => {
    return (
        <Box>
            <Typography textTransform="uppercase" textAlign="center">
                Карточка клиента
            </Typography>
            <Button>Сохранить</Button>
        </Box>
    );
};

export default ClientCard;