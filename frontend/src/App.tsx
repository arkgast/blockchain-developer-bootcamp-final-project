import React, { useState } from 'react';
import { strict as assert } from 'assert';
import { ethers } from 'ethers';
import Alert from '@mui/material/Alert';
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

const checkIfAccountIsConnected = async (setAccount: Function) => {
  const [currentAccount] = await window.ethereum.request({
    method: "eth_accounts",
  });

  if (!currentAccount) return;
  setAccount(currentAccount.toUpperCase());
};

function App () {
  const contract = useContract();
  const contractOwner = useContractOwner();
  const [prize, getCurrentPrize] = usePrize();
  const [lastWinner, setLastWinner] = useLastWinner();
  const [account, setAccount, connectAccount] = useAccount();
  const [playersList, setPlayersList] = usePlayers();
  const [winnersList, setWinnersList] = useWinners();

  const [buyingTicket, setBuyingTicket] = useState(false);
  const [selectingWinner, setSelectingWinner] = useState(false);
  const [winner, setWinner] = useState("");

  checkIfAccountIsConnected(setAccount)

  const buyTicketAction = async () => {
    const ticketPrice = ethers.utils.parseEther("0.001");
    await contract.buyTicket({ value: ticketPrice });
    setBuyingTicket(true);

    contract.on("NewPlayer", (newPlayerAddress: string) => {
      setBuyingTicket(false);
      setPlayersList([...playersList, newPlayerAddress]);
      getCurrentPrize();
    })
  }

  const selectWinnerAction = async () => {
    assert(account === contractOwner, "Not authorized");
    await contract.selectWinner();
    setSelectingWinner(true);

    contract.on("Winner", (winnerAddress: string) => {
      setSelectingWinner(false);
      setLastWinner(winnerAddress);
      setWinner(winnerAddress);
      setWinnersList([...winnersList, winnerAddress]);
      setPlayersList([]);
      getCurrentPrize();
    });
  }

  return (
    <Container sx={{ textAlign: "center" }}>
      <Grid container spacing={4} columns={12} sx={{ justifyContent: "center" }}>
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          {lastWinner ?
            (<Typography variant="overline">Last winner: {lastWinner}</Typography>)
            : (<Typography variant="overline">There is not winner yet!</Typography>)
          }
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          {account ?
            (<Typography variant="overline">Current address: {account}</Typography>)
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
                disabled={buyingTicket}
                onClick={buyTicketAction}
              >
                Buy Ticket - Ticket price 0.001 eth
              </Button>

              {account === contractOwner && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={selectingWinner}
                  onClick={selectWinnerAction}
                >
                  Select Winner
                </Button>
              )}
            </Stack>
          )}
        </Grid>

        <Grid item xs={8}>
          <Typography
            variant="h4"
            gutterBottom
            color={buyingTicket? "#78909c" : selectingWinner ? "#bcaaa4" : "#00b0ff"}
          >
            Current prize is {prize} eth
          </Typography>
        </Grid>

        {winner && (
          <Grid item xs={8}>
            <Alert
              severity={winner === lastWinner ? "success" : "info"}
              onClose={() => { setWinner("") }}
            >
              {winner === lastWinner ? (
                <>
                  Congratulations, You won!
                </>
              ) : (
                <>
                  Lottery winner is: {winner}
                </>
              )}
            </Alert>
          </Grid>
        )}

        <Grid item xs={6} md={5}>
          <List list={playersList} title="Current Players" loading={buyingTicket} />
        </Grid>

        <Grid item xs={6} md={5}>
          <List list={winnersList} title="Previous Winners" loading={selectingWinner} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App;
