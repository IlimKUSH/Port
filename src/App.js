import * as React from 'react';
import Container from '@mui/material/Container';
import ClientCard from "./components/client-card/client-card";


export default function App() {
  return (
      <Container maxWidth="sm">
        <ClientCard />
      </Container>
  );
}