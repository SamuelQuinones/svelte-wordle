export type CharStatus = 'absent' | 'present' | 'correct';

export type CharValue =
	| 'Q'
	| 'W'
	| 'E'
	| 'R'
	| 'T'
	| 'Y'
	| 'U'
	| 'I'
	| 'O'
	| 'P'
	| 'A'
	| 'S'
	| 'D'
	| 'F'
	| 'G'
	| 'H'
	| 'J'
	| 'K'
	| 'L'
	| 'Z'
	| 'X'
	| 'C'
	| 'V'
	| 'B'
	| 'N'
	| 'M';

export interface IGameStats {
	winDistribution: number[];
	gamesFailed: number;
	currentStreak: number;
	bestStreak: number;
	totalGames: number;
	successRate: number;
}

export interface Guess {
	letters: CharValue[];
	statuses: CharStatus[];
}

export interface IGameStore {
	playState: 'playing' | 'won' | 'lost';
	isHardMode: boolean;
	guesses: Guess[];
	// currentGuess?: CharValue[];
}

export interface IKeyboardStore {
	modalOpen: boolean;
	letterStatus: Map<CharValue, CharStatus>;
}
