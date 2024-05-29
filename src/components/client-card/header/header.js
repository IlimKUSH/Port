import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import RecordSection from "../../ui/record-section/record-section";

const Header = () => {
    return (
        <Stack justifyContent="space-between" alignItems="center" width="100%"
               sx={{flexDirection: {md: "row", sm: "row", xs: "column"}, gap: 2}}>
            <Typography variant="h6" color="primary.main">
                Карточка клиента
            </Typography>
            <Stack direction="row" gap={4}>
                <RecordSection />
                <Button variant="contained" sx={{ color: "#fff", textTransform: "unset"}} endIcon={<AddIcon color="contrast" />}>
                    Добавить клиента
                </Button>
            </Stack>

        </Stack>
    );
};

export default Header;