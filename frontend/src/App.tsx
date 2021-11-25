import React from 'react';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useContract, useAccount } from './shared/hooks'

function App() {
  const contract = useContract();

  const [account, connectAccount] = useAccount();

  const buyTicketAction = async () => {
    const tx = await contract?.buyTicket();
    console.log(tx);
  }

  const selectWinnerAction = async () => {
    const tx = await contract?.selectWinner();
    console.log(tx);

    contract?.on("Winner", (data) => {
      console.log(data);
    });
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <h1>Winlo</h1>
      {!account &&  (
        <Button variant="outlined" color="secondary" onClick={() => connectAccount()}>
          Connect Metamask
        </Button>
      )}
      {account && (
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button variant="contained" color="success" onClick={buyTicketAction}>
            Buy Ticket
          </Button>
          <Button variant="contained" color="secondary" onClick={selectWinnerAction}>
            Select Winner
          </Button>
        </Stack>
      )}
    </Container>
  )
}

export default App;
