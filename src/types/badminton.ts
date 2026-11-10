export type GameType = 
  | 'men-singles' 
  | 'women-singles' 
  | 'men-doubles' 
  | 'women-doubles' 
  | 'mixed-doubles';

export interface Official {
  id: string;
  firstName: string;
  lastName: string;
  role: 'Wasit Utama (Umpire)' | 'Hakim Servis (Service Judge)' | 'Hakim Garis 1 (Line Judge)' | 'Hakim Garis 2 (Line Judge)' | 'Referee Turnamen';
  licenseLevel?: string;
  federation?: string;
  notes?: string;
}

export interface Player {
  id: string;
  name: string;
  displayName: string;
  worldRank?: number;
  handedness: 'Right' | 'Left';
  countryOrClub: string;
  jerseyNumber?: string;
}

export interface TeamSide {
  side: 'A' | 'B';
  name: string;
  code: string;
  coachName?: string;
  jerseyColor: string;
  accentColor: string;
  players: Player[];
}

export interface PrintSettings {
  printScoreSheet: boolean;
  printOfficials: boolean;
  printRallyTimeline: boolean;
  printStatsSummary: boolean;
  paperSize: 'A4' | 'Letter';
  includeHeaderLogo: boolean;
}

export interface MiscConfig {
  showLiveScore: boolean;
  autoCourtChange: boolean;
  interval11DurationSec: number; // 60s
  gameIntervalDurationSec: number; // 120s
  videoChallengesPerGame: number; // 2
  soundAlerts: boolean;
  tvOverlayMode: boolean;
}

export interface MatchFormatConfig {
  matchNumber: string;
  competition: string;
  date: string;
  attendance: number;
  venue: string;
  court: string;
  city: string;
  country: string;
  gameType: GameType;
  numberOfSets: number; // 3
  pointsPerGame: number; // 21
  pointsDecidingGame: number; // 21
  capPoint: number; // 30
  conferenceGame: boolean;
  neutralVenue: boolean;
  intervalAt11: boolean;
  officials: Official[];
  sideA: TeamSide;
  sideB: TeamSide;
  printSettings: PrintSettings;
  miscConfig: MiscConfig;
}

export type ShotType = 
  | 'Smash Winner' 
  | 'Drop Shot' 
  | 'Net Kill' 
  | 'Drive Winner' 
  | 'Clear/Lob' 
  | 'Opponent Error Net' 
  | 'Opponent Error Out' 
  | 'Service Ace' 
  | 'Service Fault';

export interface RallyPoint {
  id: string;
  gameNumber: number;
  rallyNumber: number;
  servingSide: 'A' | 'B';
  winnerSide: 'A' | 'B';
  scoreSideA: number;
  scoreSideB: number;
  shotType: ShotType;
  serverPlayerName?: string;
  durationSeconds?: number;
  timestamp: string;
}

export interface GameScore {
  gameNumber: number;
  scoreA: number;
  scoreB: number;
  completed: boolean;
  winner?: 'A' | 'B';
}
