interface GameTeam {
    score: number;
    team: string;
}
export interface Game {
    away: GameTeam;
    home: GameTeam;
    ties?: number;
    leads?: number;
    evaluation?: number;
    deltas?: {
        qt1: number;
        qt2: number;
        qt3: number;
        qt4: number;
    };
    leaders?: {
        qt1: string;
        qt2: string;
        qt3: string;
        qt4: string;
    };
}
export declare const getEvaluations: (day: number, month: number, year: number) => Promise<Game[]>;
export {};
