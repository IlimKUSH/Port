import Container from '@mui/material/Container';
import ClientCard from "./components/client-card/client-card";

export default function App() {
  return (
      <Container maxWidth="md" sx={{padding: "10px"}}>
        <ClientCard />
      </Container>
  );
}