import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import MoneyIcon from '@mui/icons-material/Money';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const CustomList = (props: any) => {
  return (
    <Item elevation={1}>
      <Box>
        <Box>
          <Typography variant="h2">
            {props.title}{" "}
            {props.loading && (
              <Fade in={props.loading} 
                style={{ transitionDelay: props.loading ? '20ms' : '0ms' }}
                unmountOnExit
              >
                <CircularProgress color="secondary"/>
              </Fade>
            )}
          </Typography>
        </Box>
        <List>
          {!props.list.length && (
            <ListItem sx={{ backgroundColor: '#ccc' }}>
              <Typography>There are no {props.title.toLowerCase()} yet!</Typography>
            </ListItem>
          )}

          {props.list.map((address: string, idx: number) => (
            <ListItem key={`${address}-${idx}`}>
              <ListItemIcon>
                <MoneyIcon />
              </ListItemIcon>
              <ListItemText primary={address} sx={{ overflow: "hidden" }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Item>
  )
}

export default CustomList;
