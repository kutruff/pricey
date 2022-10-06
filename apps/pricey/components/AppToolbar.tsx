/** @jsxImportSource @emotion/react */
import { AppBar, AppBarProps, Box, Button, css, IconButton, Toolbar, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Link from 'next/link';

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

                <Link href={'/'}>
                    <Typography variant="h1" css={titleTypographyStyle}>
                        Pricey
                    </Typography>
                </Link>
                <span style={{ flexGrow: 1 }} />
                <span style={{ flexBasis: 50 }} />

                <Box sx={{ display: 'flex' }}>
                    <Link href={'/archive'} passHref>
                        <IconButton
                        // sx={{
                        //     marginLeft: (x) => x.spacing(1),
                        //     backgroundColor: (x) =>
                        //         x.palette.mode === "light"
                        //             ? x.palette.grey[300]
                        //             : x.palette.grey[700],
                        //     width: 40,
                        //     height: 40,
                        // }}
                        // size="large"
                        >
                            <CalendarTodayIcon />
                        </IconButton>
                    </Link>
                </Box>

                {/* Account related controls (icon buttons) */}

                {/* {user && (
                    <Chip
                        sx={{
                            height: 40,
                            borderRadius: 20,
                            fontWeight: 600,
                            backgroundColor: (x) =>
                                x.palette.mode === "light"
                                    ? x.palette.grey[300]
                                    : x.palette.grey[700],
                            ".MuiChip-avatar": { width: 32, height: 32 },
                        }}
                        component="a"
                        avatar={
                            <Avatar
                                alt={user.name || ""}
                                src={user.picture.url || undefined}
                            />
                        }
                        label={getFirstName(user.name || "")}
                        href={`/@${user.username}`}
                        onClick={navigate}
                    />
                )}
                {user && (
                    <IconButton
                        sx={{
                            marginLeft: (x) => x.spacing(1),
                            backgroundColor: (x) =>
                                x.palette.mode === "light"
                                    ? x.palette.grey[300]
                                    : x.palette.grey[700],
                            width: 40,
                            height: 40,
                        }}
                        children={<NotificationsNone />}
                        onClick={openNotificationsMenu}
                        size="large"
                    />
                )}
                {user && (
                    <IconButton
                        ref={menuAnchorRef}
                        sx={{
                            marginLeft: (x) => x.spacing(1),
                            backgroundColor: (x) =>
                                x.palette.mode === "light"
                                    ? x.palette.grey[300]
                                    : x.palette.grey[700],
                            width: 40,
                            height: 40,
                        }}
                        children={<ArrowDropDown />}
                        onClick={openUserMenu}
                        size="large"
                    />
                )}
                {!user && (
                    <Button
                        variant="outlined"
                        href="/auth/google"
                        color="primary"
                        onClick={signIn}
                        children="Log in / Register"
                    />
                )} */}
            </Toolbar>

            {/* Pop-up menus */}

            {/* <NotificationsMenu
                anchorEl={anchorEl.notifications}
                onClose={closeNotificationsMenu}
                PaperProps={{ sx: { marginTop: "8px" } }}
            />
            <UserMenu
                anchorEl={anchorEl.userMenu}
                onClose={closeUserMenu}
                PaperProps={{ sx: { marginTop: "8px" } }}
                onChangeTheme={onChangeTheme}
            /> */}
        </AppBar >
    );
}
