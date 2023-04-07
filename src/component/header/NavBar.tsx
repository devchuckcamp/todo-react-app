import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import { NavLink, useNavigate } from "react-router-dom";

const pages = ['Products', 'Pricing', 'Blog'];
//const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function NavBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
  
          <LogoDevIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} className='desktop-logo' />
          
          <LogoDevIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
