import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

const Layout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        健身記錄
                    </Typography>
                    <Link to="/main" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                        主頁
                    </Link>
                    <Link to="/exercise" style={{ color: 'white', textDecoration: 'none' }}>
                        運動
                    </Link>
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout; 