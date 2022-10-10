/** @jsxImportSource @emotion/react */
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AppBar, AppBarProps, Box, Container, css, IconButton, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import BasicModal from './BasicModal';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { FC } from 'react';
import { event } from '../analytics';

type AppToolbarProps = AppBarProps & {
    onChangeTheme: () => void;
};

const titleTypographyStyle = css({
    fontSize: '1.5rem',
    fontWeight: 500
});

//Modified from: https://github.com/kriasoft/relay-starter-kit/blob/main/web/common/AppToolbar.tsx
export function AppToolbar(props: AppToolbarProps): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onChangeTheme, ...other } = props;

    return (
        <AppBar color="default" {...other}>
            <Toolbar>
                <Container maxWidth='sm'>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link href={'/'}>
                            <Typography variant="h1" css={titleTypographyStyle}>
                                Pricey
                            </Typography>
                        </Link>
                        <span style={{ flexGrow: 1 }} />
                        <span style={{ flexBasis: 50 }} />

                        <Box sx={{ display: 'flex' }}>
                            <Link href={'/archive'} passHref onClick={() => eventnt({ action: 'toolbar_goto_archive', params: { event_label: 'open archive', event_category: 'links' } })}>
                                <IconButton><CalendarTodayIcon /></IconButton>
                            </Link>
                            <HelpModal />
                        </Box>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar >
    );
}
const HelpModal: FC = () => {
    return (
        <BasicModal icon={<HelpOutlineIcon />}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Guess the price of these ridiculously expensive items.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Simply enter guesses, and keep trying until you are close enough to get a result.
                Afterwards, you may see what a normal person would pay on Amazon.
            </Typography>
        </BasicModal>
    );
};

