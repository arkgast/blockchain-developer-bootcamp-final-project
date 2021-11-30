import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderIcon from '@mui/icons-material/Folder';

import { useContract } from '../shared/hooks'

const PlayersList = () => {
  const contract = useContract();
  const [playersList, setPlayersList] = useState([]);

  const retrievePlayers = async () => {
    const players = await contract?.getPlayers();
    setPlayersList(players);
  }

  useEffect(() => {
    retrievePlayers();
  }, [])

  console.log(playersList);

  return (
    <List>
      {playersList.map((address: string, idx: number) => (
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

export default PlayersList;
