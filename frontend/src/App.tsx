import React from 'react';
import { strict as assert } from 'assert';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import WinnersList from './components/WinnersList';
import PlayersList from './components/PlayersList'
import { useContract, useContractOwner, useAccount } from './shared/hooks'

function App() {
  const contract = useContract();
  const contractOwner = useContractOwner();
  const [account, connectAccount] = useAccount();

  const buyTicketAction = async () => {
    const tx = await contract?.buyTicket();
    console.log(tx);
  }

  const selectWinnerAction = async () => {
    assert(account === contractOwner, "Not authorized");
    const tx = await contract?.selectWinner();

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

      <WinnersList />

      <PlayersList />
    </Container>
  )
}

export default App;
