interface GameTeam {
    score: number;
    team: string;
}
export interface Game {
    away: GameTeam;
    home: GameTeam;
    delta?: number;
}
export {};
