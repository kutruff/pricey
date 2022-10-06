import { Game } from '.';

export function findClosestGameToTime(games: Game[], now: number): Game | undefined {
    let closestGame: Game | undefined = undefined;
    let closestGameTime = Number.MAX_SAFE_INTEGER;

    for (const current of games) {
        const currentGameTime = new Date(current.date).getTime();
        // console.log(current.date, currentGameTime);
        if (currentGameTime <= now && (!closestGame || currentGameTime > closestGameTime)) {
            closestGame = current;
            closestGameTime = currentGameTime;
        }
    }

    if (!closestGame) {
        closestGame = games[games.length - 1];
    }
    return closestGame;
}