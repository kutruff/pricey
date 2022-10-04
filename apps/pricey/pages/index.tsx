/** @jsxImportSource @emotion/react */
import { Container, Box, CssBaseline, Toolbar } from '@mui/material'
import type { NextPage } from 'next'
import { css } from '@emotion/react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { flexVertical, flexGrowAndFlexChildrenVertical } from '../styling'
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styling/theme';
import { AppToolbar } from '../components/AppToolbar';

const pageContainerStyle = css({
  height: '100vh',
}, flexVertical);


const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Planner</title>
        <meta name="description" content="Theme park planner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box css={pageContainerStyle}>
          <AppToolbar onChangeTheme={() => {
            //TODO: implement      
          }} />
          <Toolbar />
          <Box css={flexGrowAndFlexChildrenVertical} sx={{ overflowY: 'auto' }}>
            <Container css={flexGrowAndFlexChildrenVertical} >
              Hello
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Home
