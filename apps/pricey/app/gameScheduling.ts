import { Game } from '.';

export interface TimeOffset {
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
}

export const switchToNextGameTimeOfDayUtc: TimeOffset = {
    hours: 4,
    minutes: 0,
    seconds: 0,
};

export function getDateAtUtcTimeOfDay(basisDate: Date, utcTimeOfDay: TimeOffset): Date {
    const year = basisDate.getUTCFullYear();
    const month = basisDate.getUTCMonth();
    const date = basisDate.getUTCDate();

    return new Date((Date.UTC(year, month, date, utcTimeOfDay.hours || 0, utcTimeOfDay.minutes || 0, utcTimeOfDay.seconds || 0, utcTimeOfDay.milliseconds || 0)));
}

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export async function getGamesSortedByTime() {
    const games = (await import('../data/games.json')).default as Game[];
    games.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return games;
}

export function getNextUpdateTime(): Date {
    const now = new Date();
    let updateTime = getDateAtUtcTimeOfDay(now, switchToNextGameTimeOfDayUtc);

    if (updateTime.getTime() < now.getTime()) {
        updateTime = new Date(updateTime.getTime() + MILLISECONDS_PER_DAY);
    }

    return getDateAtUtcTimeOfDay(updateTime, switchToNextGameTimeOfDayUtc);
}

export function getLastUpdateTime(): Date {
    const now = new Date();
    let updateTime = getDateAtUtcTimeOfDay(now, switchToNextGameTimeOfDayUtc);
    if (updateTime.getTime() > now.getTime()) {
        updateTime = new Date(updateTime.getTime() - MILLISECONDS_PER_DAY);
    }

    return getDateAtUtcTimeOfDay(updateTime, switchToNextGameTimeOfDayUtc);
}

export function findClosestGameToTime(games: Game[], now: number) {
    let closestGame: Game | undefined = undefined;
    let closestGameIndex = -1;
    let closestGameTime = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < games.length; i++) {
        const current = games[i];
        const currentGameTime = new Date(current.date).getTime();

        if (currentGameTime <= now && (!closestGame || currentGameTime > closestGameTime)) {
            closestGame = current;
            closestGameTime = currentGameTime;
            closestGameIndex = i;
        }
    }

    if (!closestGame) {
        closestGameIndex = games.length - 1;
        closestGame = games[closestGameIndex];
    }
    return { closestGame, closestGameIndex };
}