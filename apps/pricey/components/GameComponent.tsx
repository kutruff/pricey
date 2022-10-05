/* eslint-disable @next/next/no-img-element */
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, FC, useMemo } from 'react';
import { Game, Product } from '../app';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Card, CardActionArea, CardContent, CardMedia, FormControl, FormGroup, TextField } from '@mui/material';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';

const parseGuess = (value: string) => {
    const price = Number.parseFloat(value);
    return Number.isFinite(price) && price > 0 ? price : undefined;
};
const marginOfErrorToWin = 15;

const GameComponent: FC<{ game: Game }> = ({ game }) => {
    const [guesses, setGuesses] = useState<number[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [hasError, setHasError] = useState(false);
    const [guessDifference, setGuessDifference] = useState(0);
    const [hasWon, setHasWon] = useState(false);
    const [score, setScore] = useState(0);
    const [totalGuesses, setTotalGuesses] = useState(0);

    const [hasShared, setHasShared] = useState(false);

    const formatter = useMemo(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    }), []);
    const handleChange = (event: any) => {
        const value = event.target.value;
        console.log(value);
        setCurrentGuess(value);
        setHasError(value && !parseGuess(value));
    };

    const onShareClick = () => {
        navigator.clipboard.writeText(getShareText(guesses));
        setHasShared(true);
    };


    const handleSubmit = (event: any) => {
        event.preventDefault();
        const value = parseGuess(currentGuess);
        if (value) {
            setCurrentGuess('');
            setTotalGuesses(x => x + 1);

            const difference = value - game.expensiveProduct.price;
            setGuessDifference(difference);
            const absDifference = Math.abs(difference);
            const errorAmount = absDifference / game.expensiveProduct.price;
            const hasWon = errorAmount * 100 < marginOfErrorToWin;
            setHasWon(hasWon);
            // if(!hasWon) {
            //     setScore(x => x + absDifference);
            // }

            setGuesses([...guesses, value]);
        }
    };

    if (!game) {
        return <div>404</div>;
    }

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
                            {guesses.length === 0 ?
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
                            {guesses.map((x, index) =>
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
                            {/* <div>
                            <Link href={game.expensiveProduct.storePageUrl}>{game.expensiveProduct.seller}</Link>
                            <Typography>{game.expensiveProduct.name}</Typography>
                        </div> */}
                            {/* 
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Typography align='center' variant='h5'>Close enough!</Typography>
                                    <Typography align='center' variant='body2'>Actual price: ${game.expensiveProduct.price}</Typography>
                                    <GuessRange guesses={guesses} />
                                    <Grid container justifyContent="center">
                                        <Grid item>
                                            <GameResults guesses={guesses} />
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid> */}

                            <Box style={{ display: 'flex', flexDirection: 'column' }} justifyContent="center">

                                <Typography align='center' variant='h5'>Close enough!</Typography>
                                <Typography align='center' variant='body2'>Actual price: ${game.expensiveProduct.price}</Typography>
                                <GuessRange guesses={guesses} />
                                <Box style={{ display: 'flex' }} justifyContent="center">
                                    <GameResults guesses={guesses} />
                                </Box>
                                <Box style={{ display: 'flex' }} justifyContent="center">
                                    <Button fullWidth={false} variant='contained' onClick={onShareClick}>{hasShared ? 'copied' : 'share'}</Button>
                                </Box>
                            </Box>

                            {/* <NormalProduct product={game.normalProduct} /> */}
                        </Paper>
                    </Grid>
                    <Grid container item justifyContent="center" >
                        <Box style={{ display: 'flex', flexWrap: 'nowrap', gap: 5 }} justifyContent="center">
                            <Paper>
                                <Link href={game.normalProduct.storePageUrl}><Button variant="outlined" color="secondary" >See Cheaper Amazon alternative </Button></Link>
                            </Paper>
                            <Paper>
                                <Link href={game.expensiveProduct.storePageUrl}><Button variant="outlined" color="secondary" >See original</Button></Link>
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
};

export default GameComponent;

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
        // <div >
        //     <h2>Normal product</h2>
        //     <a href={product.storePageUrl}>
        //         <div>
        //             {product.name}
        //         </div>
        //         Click to see price on Amazon.
        //         <div style={{ display: 'flex', justifyContent: 'center' }}>
        //             <img style={{ maxHeight: 200 }} src={product.imageUrl} />
        //         </div>
        //     </a>
        // </div>
        <Card sx={{ mt: 1 }} elevation={2}>
            <Link href={product.storePageUrl}>
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
