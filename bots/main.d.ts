interface GameTeam {
    score: number;
    team: string;
    rating: string;
}
interface Game {
    away: GameTeam;
    home: GameTeam;
    delta: number;
    rating: number;
    ties: number;
    leads: number;
    evaluation?: number;
}
export declare const getEvaluations: (day: number, month: number, year: number) => Promise<Game[]>;
export {};
