/* eslint-disable @next/next/no-img-element */
import { Troubleshoot } from '@mui/icons-material';
import { Button, Card, CardContent, FormControl, Slide } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Game, Product } from '../app';


const parseGuess = (value: string) => {
    const price = Number.parseFloat(value);
    return Number.isFinite(price) && price > 0 ? price : undefined;
};
const marginOfErrorToWin = 15;

export interface State {
    guesses: number[],
    storageVersion: number
}

//You can rev this to force the cached version to be ignored until it is written again.
const storageVersion = 0;

const GameComponent: FC<{ game: Game }> = ({ game }) => {
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

    const formatter = useMemo(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    }), []);

    const handleChange = (event: any) => {
        const value = event.target.value;

        setCurrentGuess(value);
        setHasError(value && !parseGuess(value));
    };

    const onShareClick = () => {
        navigator.clipboard.writeText(getShareText(state.guesses));
        setHasShared(true);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const value = parseGuess(currentGuess);
        if (value) {
            setCurrentGuess('');
            setState({ ...state, guesses: [...state.guesses, value] });
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

    const containerRef = useRef(null);

    return (
        <Grid container
            spacing={1}
            direction="column"
            justifyContent="center"
            columns={1}>
            <Grid item>
                <Card sx={{ mt: 1 }}>
                    <Grid sx={{ mt: 1 }} container justifyContent="center">
                        <Grid item>
                            <Box component="img" sx={{ borderRadius: '10px', maxHeight: 200 }} alt="expensive product image" src={game.expensiveProduct.imageUrl} />
                        </Grid>
                    </Grid>
                    <CardContent sx={{ mt: 0, '&:last-child': { pb: 0 } }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {game.expensiveProduct.seller}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {game.expensiveProduct.name}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {!hasWon ? (
                <Grid item>
                    <Paper>
                        <Typography align="center" variant='body1'>
                            {state.guesses.length === 0 ?
                                `Guess the ridiculous price within ${marginOfErrorToWin}%!`
                                : guessDifference > 0 ? 'Price is lower.' : 'Price is higher.'
                            }
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', gap: 1 }}>
                                <Box sx={{ flex: 1 }} >
                                    <FormControl fullWidth error={hasError} size='small'>
                                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            value={currentGuess}
                                            onChange={handleChange}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            label="Amount"
                                        />
                                    </FormControl>
                                </Box>
                                <Box sx={{ flexShrink: 1 }} >
                                    <Button variant='contained' onClick={handleSubmit} >Guess</Button>
                                </Box>
                            </Box>
                        </form>
                        <List>
                            {state.guesses.map((x, index) =>
                                <ListItem disablePadding key={index}>
                                    <Typography variant='caption' color='secondary'>{x < game.expensiveProduct.price ? <>⬆️</> : <>⬇️</>} {formatter.format(x)}</Typography>
                                </ListItem>)}
                        </List>
                    </Paper>
                </Grid>
            ) : (
                <>
                    <Grid item>
                        <Paper>
                            <Box style={{ display: 'flex', flexDirection: 'column' }} justifyContent="center">

                                <Typography align='center' variant='h5'>Close enough!</Typography>
                                <Typography align='center' variant='body2'>Actual price: ${game.expensiveProduct.price}</Typography>
                                <GuessRange guesses={state.guesses} />
                                <Box style={{ display: 'flex' }} justifyContent="center">
                                    <GameResults guesses={state.guesses} />
                                </Box>
                                <Box style={{ display: 'flex' }} justifyContent="center">
                                    <Button fullWidth={false} variant='contained' onClick={onShareClick}>{hasShared ? 'copied' : 'share'}</Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid container item justifyContent="center" >
                        <Box style={{ display: 'flex', flexWrap: 'nowrap', gap: 5 }} justifyContent="center">
                            <Paper>
                                <Link href={getAffiliateLink(game.normalProduct.storePageUrl)}><Button variant="outlined" color="secondary" >See Basic Amazon Alternative</Button></Link>
                            </Paper>
                            <Paper>
                                <Link href={game.expensiveProduct.storePageUrl}><Button variant="outlined" color="secondary" >See {game.expensiveProduct.seller}</Button></Link>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Paper>
                            <Typography align="center" variant="h6">What normal people get:</Typography>
                            <Typography align="center" variant="caption">Click to see on Amazon</Typography>
                            <NormalProduct product={game.normalProduct} />
                        </Paper>
                    </Grid>

                </>
            )}
        </Grid >
    );
}

export default GameComponent;

function getAffiliateLink(link: string) {
    const url = new URL(link);
    url.searchParams.set('tag', 'kutruffllc-20');
    return url.toString();
}

interface GameResultsProps {
    guesses: number[],
}

export const GameResults: FC<GameResultsProps> = ({ guesses }) => {
    const squares = [];
    for (let i = 0; i < guesses.length - 1; i++) {
        squares.push(<Box key={i}>🟥</Box>);
    }
    squares.push(<Box key={guesses.length - 1}>🟩</Box>);
    return (
        <Box style={{ display: 'inline-flex', maxWidth: 'fit-content' }}>{squares}</Box>
    );
};

function getShareText(guesses: number[]) {
    let results = '';
    for (let i = 0; i < guesses.length - 1; i++) {
        results += '🟥';
        if (i < guesses.length - 2) {
            results += ' ';
        }
    }

    results += '🟩';

    const shareText = `Pricey: ${results} https://pricey.wtf`;
    return shareText;
}

export const GuessRange: FC<GameResultsProps> = ({ guesses }) => {
    const minGuess = guesses.reduce((acc, current) => Math.min(acc, current), Number.MAX_VALUE);
    const maxGuess = guesses.reduce((acc, current) => Math.max(acc, current), Number.MIN_VALUE);

    return (
        <Typography align='center' color="text.secondary" variant='caption'>guess range: ${minGuess} - ${maxGuess}</Typography>
    );
};

export interface NormalProductProps {
    product: Product,
}

export const NormalProduct: FC<NormalProductProps> = ({ product }) => {
    return (
        <Card sx={{ mt: 1 }} elevation={2}>
            <Link href={getAffiliateLink(product.storePageUrl)}>
                <Grid sx={{ mt: 1 }} container justifyContent="center">
                    <Grid item>
                        <Box component="img" sx={{ borderRadius: '10px', maxHeight: 200 }} alt="expensive product image" src={product.imageUrl} />
                    </Grid>
                </Grid>
                <CardContent sx={{ mt: 0, '&:last-child': { pb: 0 } }}>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {product.name}
                    </Typography>
                </CardContent>
            </Link>
        </Card >
    );
};
