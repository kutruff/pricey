/* eslint-disable @next/next/no-img-element */
import { Button, Card, CardContent, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MaterialUiLink from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { event, report_conversion } from '../analytics';
import { Game, getNextUpdateTime } from '../app';
import CountdownClock from './Clock';

const parseGuess = (value: string) => {
    const price = Number.parseFloat(value);
    return Number.isFinite(price) && price > 0 ? price : undefined;
};
const marginOfErrorToWin = 15;

export interface State {
    guesses: number[],
    storageVersion: number
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});


//You can rev this to force the cached version to be ignored until it is written again.
const storageVersion = 0;

export interface GameComponentProps {
    game: Game,
    previousGame: Game | null,
    isTodaysGame: boolean
}

const onVisitSensibleProduct = (game: Game) => {
    report_conversion();
    event({ action: 'visit_sensible_product', params: { event_label: game.id, event_category: 'links' } });
};

const GameComponent: FC<GameComponentProps> = ({ game, previousGame, isTodaysGame }) => {
    const [state, setState] = useState<State>({ guesses: [], storageVersion });
    const [currentGuess, setCurrentGuess] = useState('');
    const [hasError, setHasError] = useState(false);
    const [hasShared, setHasShared] = useState(false);
    const [hasInited, setHasInited] = useState(false);

    useEffect(() => {
        try {
            const key = `${game.id}-state`;
            const stored = localStorage.getItem(key);
            if (stored) {
                const loadedState = JSON.parse(stored) as State;
                if (loadedState.storageVersion === storageVersion) {
                    setState(loadedState);
                }
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch { }
        setHasInited(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (hasInited) {
            const key = `${game.id}-state`;
            localStorage.setItem(key, JSON.stringify(state));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasInited, state]);


    const handleChange = (event: any) => {
        const value = event.target.value;

        setCurrentGuess(value);
        setHasError(value && !parseGuess(value));
    };

    const onShareClick = () => {
        navigator.clipboard.writeText(getShareText(isTodaysGame ? undefined : game.id, game.expensiveProduct.price, state.guesses));
        setHasShared(true);
        event({ action: 'share', params: { event_label: game.id, event_category: 'game_results_copied' } });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const value = parseGuess(currentGuess);
        if (value) {
            setCurrentGuess('');
            setState({ ...state, guesses: [...state.guesses, value] });
            event({ action: 'price_guess', params: { event_label: game.id, event_category: 'gameplay' } });
        }
    };

    let hasWon = false;
    let guessDifference = 0;
    if (state.guesses.length > 0) {
        guessDifference = state.guesses[state.guesses.length - 1] - game.expensiveProduct.price;
        const absDifference = Math.abs(guessDifference);
        const errorAmount = absDifference / game.expensiveProduct.price;
        hasWon = errorAmount * 100 < marginOfErrorToWin;
    }

    if (!game) {
        return <div>404</div>;
    }

    return (
        <Grid container
            spacing={1}
            direction="column"
            justifyContent="center"
            columns={1}>
            {hasWon && !isTodaysGame &&
                <Grid item>
                    <Paper sx={{ p: 1 }}>
                        <Grid container justifyContent='center'>
                            <Link href={'/'} passHref >
                                <Button variant='contained' onClick={() => event({ action: 'visit_todays_game', params: { event_label: game.id, event_category: 'links' } })}>See today&apos;s game</Button>
                            </Link>
                        </Grid>
                    </Paper>
                </Grid>
            }
            <Grid item>
                <Card >
                    <Grid sx={{ mt: 1 }} container justifyContent="center">
                        <Grid item>
                            <Box component="img" sx={{ borderRadius: '10px', height: 200 }} alt="expensive product image" src={game.expensiveProduct.imageUrl} />
                        </Grid>
                    </Grid>
                    <CardContent sx={{ mt: 0, '&:last-child': { pb: 1 } }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {game.expensiveProduct.seller}
                        </Typography>
                        <Typography sx={{}} color="text.secondary">
                            {game.expensiveProduct.name}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {!hasWon ? (
                <Grid item>
                    <Paper sx={{ p: 1 }}>
                        <Typography align="center" variant='body1'>
                            {state.guesses.length === 0 ?
                                `Guess the ridiculous price within ${marginOfErrorToWin}%!`
                                : guessDifference > 0 ? 'Price is lower. 👇' : 'Price is higher. ☝️'
                            }
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', gap: 1 }}>
                                <Box sx={{ flex: 1 }} >
                                    <FormControl fullWidth error={hasError} size='small' variant='outlined' >
                                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                        <OutlinedInput
                                            type='number'
                                            id="outlined-adornment-amount"
                                            value={currentGuess}
                                            onChange={handleChange}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            label='Amount'
                                        />
                                    </FormControl>
                                </Box>
                                <Box sx={{ flexShrink: 1 }} >
                                    <Button variant='contained' onClick={handleSubmit} >Guess</Button>
                                </Box>
                            </Box>
                        </form>
                        <Typography align='center' color='text.secondary' variant='body1'>Guesses made: {state.guesses.length}</Typography>
                        <List>
                            {state.guesses.map((x, index) =>
                                <ListItem disablePadding key={index}>
                                    <Typography color='secondary'>{x < game.expensiveProduct.price ? <>⬆️</> : <>⬇️</>} {currencyFormatter.format(x)}</Typography>
                                </ListItem>)}
                        </List>
                    </Paper>
                </Grid>
            ) : (
                <>
                    <Grid item>
                        <Paper sx={{ pb: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography align='center' variant='h5'>{guessDifference === 0 ? 'Wow! Perfect Guess!' : 'Close enough!'}</Typography>
                            <Typography align='center' variant='body2'>Actual price: ${game.expensiveProduct.price}</Typography>
                            <GuessRange actualPrice={game.expensiveProduct.price} guesses={state.guesses} />
                            <Box sx={{ display: 'flex' }} justifyContent="center">
                                <GameResults actualPrice={game.expensiveProduct.price} guesses={state.guesses} />
                            </Box>
                            <Box sx={{ display: 'flex' }} justifyContent="center">
                                <Button fullWidth={false} variant='contained' onClick={onShareClick}>{hasShared ? 'copied' : 'share'}</Button>
                            </Box>

                        </Paper>
                    </Grid>
                    <Grid item >
                        <Paper sx={{ display: 'flex', p: 1, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 1 }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <MaterialUiLink href={getAffiliateLink(game.normalProduct.storePageUrl)} onClick={() => onVisitSensibleProduct(game)}>
                                    <Button fullWidth variant="contained" color="secondary" >See Sensible Amazon Item</Button>
                                </MaterialUiLink>
                            </Box>
                            <Box sx={{ flexShrink: 1 }}>
                                <Typography >vs.</Typography>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <MaterialUiLink href={game.expensiveProduct.storePageUrl} onClick={() => event({ action: 'visit_expensive_product', params: { event_label: game.id, event_category: 'links' } })}>
                                    <Button fullWidth variant="contained" color="secondary" >{`See ${game.expensiveProduct.seller}`}</Button>
                                </MaterialUiLink>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper sx={{ p: 1 }}>
                            <Typography align="center" variant="h6">What normal people get.</Typography>
                            <NormalProduct game={game} />
                        </Paper>
                    </Grid>
                    {isTodaysGame && (
                        <Grid item>
                            <Paper sx={{ p: 1 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant='h6' align="center">New Game Added Everyday</Typography>
                                    <Box >
                                        <CountdownClock deadline={getNextUpdateTime()} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    )}
                    <Grid item>
                        <Paper sx={{ p: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                                {previousGame && (
                                    <Link href={`/${previousGame.id}`} passHref >
                                        <Button variant='contained' onClick={() => event({ action: 'visit_previous_game', params: { event_label: game.id, event_category: 'links' } })}>Play previous day</Button>
                                    </Link>)
                                }
                                {!isTodaysGame && (
                                    <Link href={'/'} passHref >
                                        <Button variant='contained' onClick={() => event({ action: 'visit_todays_game', params: { event_label: game.id, event_category: 'links' } })}>Play today&apos;s game</Button>
                                    </Link>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </>
            )
            }
        </Grid >
    );
};

export default GameComponent;

function getAffiliateLink(link: string) {
    const url = new URL(link);
    url.searchParams.set('tag', process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG as string);
    return url.toString();
}

interface GameResultsProps {
    actualPrice: number,
    guesses: number[],
}

export const GameResults: FC<GameResultsProps> = ({ actualPrice, guesses }) => {
    return <>{getGuessSquares(actualPrice, guesses).join(' ')}</>;
};

function getShareText(id: string | undefined, actualPrice: number, guesses: number[]) {
    const results = getGuessSquares(actualPrice, guesses).join(' ');

    const shareText = id ? `Pricey: ${results} https://pricey.wtf/${id}` : `Pricey: ${results} https://pricey.wtf`;
    return shareText;
}

function getGuessSquares(actualPrice: number, guesses: number[]) {
    const results: string[] = [];
    for (let i = 0; i < guesses.length - 1; i++) {
        results.push('🟥');
    }
    const lastGuess = guesses[guesses.length - 1];
    results.push(lastGuess === actualPrice ? '🎯' : '🟩');
    return results;
}

export const GuessRange: FC<GameResultsProps> = ({ guesses }) => {
    const minGuess = guesses.reduce((acc, current) => Math.min(acc, current), Number.MAX_VALUE);
    const maxGuess = guesses.reduce((acc, current) => Math.max(acc, current), Number.MIN_VALUE);

    return (
        <Typography align='center' color="text.secondary" variant='caption'>
            {guesses.length === 1 ? (
                `One guess! You must be rich! Guess: ${currencyFormatter.format(minGuess)}`
            ) : (
                `guess range: ${currencyFormatter.format(minGuess)} - ${currencyFormatter.format(maxGuess)}`
            )}
        </Typography>
    );
};

export interface NormalProductProps {
    game: Game,
}

export const NormalProduct: FC<NormalProductProps> = ({ game }) => {
    return (
        <Card sx={{ mt: 1 }} elevation={2}>
            <MaterialUiLink href={getAffiliateLink(game.normalProduct.storePageUrl)} onClick={() => onVisitSensibleProduct(game)}>
                <Grid sx={{ mt: 1 }} container justifyContent="center">
                    <Grid item>
                        <Box component="img" sx={{ borderRadius: '10px', maxHeight: 200 }} alt="expensive product image" src={game.normalProduct.imageUrl} />
                    </Grid>
                </Grid>
                <CardContent sx={{ mt: 0, '&:last-child': { pb: 0 } }}>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {game.normalProduct.name}
                    </Typography>
                </CardContent>
            </MaterialUiLink>
        </Card >
    );
};

