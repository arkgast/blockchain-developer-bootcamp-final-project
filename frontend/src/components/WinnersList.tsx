import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderIcon from '@mui/icons-material/Folder';

import { useContract } from '../shared/hooks'

const WinnerList = () => {
  const contract = useContract();
  const [winnersList, setWinnersList] = useState([]);

  const retrieveWinners = async () => {
    const winners = await contract?.getWinners();
    setWinnersList(winners);
  }

  useEffect(() => {
    retrieveWinners();
  }, [])

  console.log({ winnersList });

  return (
    <List>
      {winnersList.map((address: string, idx: number) => (
        <ListItem key={`${address}-${idx}`}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={address} />
        </ListItem>
      ))}
    </List>
  )
}

export default WinnerList;
