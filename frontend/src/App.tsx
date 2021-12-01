import React from 'react';
import { strict as assert } from 'assert';
import { ethers } from 'ethers';
import Button from '@mui/material/Button';
import Container from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import List from './components/List'
import {
  useAccount,
  useContract,
  useContractOwner,
  useLastWinner,
  usePrize,
  usePlayers,
  useWinners
} from './shared/hooks'


function App() {
  const contract = useContract();
  const contractOwner = useContractOwner();
  const [prize, getCurrentPrize] = usePrize();
  const [lastWinner, setLastWinner] = useLastWinner();
  const [account, connectAccount] = useAccount();
  const [playersList, setPlayersList] = usePlayers();
  const [winnersList, setWinnersList] = useWinners();

  const buyTicketAction = async () => {
    const ticketPrice = ethers.utils.parseEther("0.001");
    await contract?.buyTicket({ value: ticketPrice });

    contract?.on("NewPlayer", (newPlayerAddress: string) => {
      setPlayersList([...playersList, newPlayerAddress]);
      getCurrentPrize();
    })
  }

  const selectWinnerAction = async () => {
    assert(account === contractOwner, "Not authorized");
    await contract?.selectWinner();

    contract?.on("Winner", (winnerAddress: string) => {
      setLastWinner(winnerAddress);
      setWinnersList([...winnersList, winnerAddress]);
      getCurrentPrize();
    });
  }

  return (
    <Container sx={{ textAlign: "center" }}>
      <Grid container spacing={4} columns={12} sx={{ justifyContent: "center" }}>
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          {lastWinner ?
            (<Typography variant="overline">{lastWinner}</Typography>)
            : (<Typography variant="overline">There is not winner yet!</Typography>)
          }
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          {account ?
            (<Typography variant="overline">{account}</Typography>)
            : (<Typography variant="overline">No address to display</Typography>)
          }
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography variant="h1" gutterBottom>Winlo - Lottery</Typography>

          {!account &&  (
            <Button
              color="secondary"
              variant="outlined"
              size="large"
              onClick={() => connectAccount()}
            >
              Connect Metamask
            </Button>
          )}

          {account && (
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                color="success"
                variant="contained"
                size="large"
                onClick={buyTicketAction}
              >
                Buy Ticket - Ticket price 0.001 eth
              </Button>

              {account === contractOwner && (
                <Button variant="contained" color="secondary" onClick={selectWinnerAction}>
                  Select Winner
                </Button>
              )}
            </Stack>
          )}
        </Grid>

        <Grid item xs={8}>
          <Typography variant="h4" gutterBottom>Current prize is {prize} eth</Typography>
        </Grid>

        <Grid item xs={6} md={5}>
          <List list={playersList} title="Players" />
        </Grid>

        <Grid item xs={6} md={5}>
          <List list={winnersList} title="Winners" />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App;
