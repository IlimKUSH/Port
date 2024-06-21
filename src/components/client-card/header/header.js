import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import FaceidCapture from "../../ui/faceid-capture/faceid-capture";

const Header = ({setFaceId, handleResetForm}) => {
    return (
        <Stack>
            {/*<Typography variant="h6" color="primary.main">*/}
            {/*    Карточка клиента*/}
            {/*</Typography>*/}
            <Stack direction="row" gap={4}>
                <FaceidCapture setFaceId={setFaceId} />
            </Stack>

        </Stack>
    );
};

export default Header;