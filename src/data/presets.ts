import { MatchFormatConfig } from '../types/badminton';

export const defaultMatchConfig: MatchFormatConfig = {
  matchNumber: '1',
  competition: 'INDONESIA OPEN 2026',
  date: '2026-06-12T15:30',
  attendance: 5200,
  venue: 'ISTORA SENAYAN GELORA BUNG KARNO',
  court: '1 (TV Court)',
  city: 'DKI JAKARTA',
  country: 'Indonesia',
  gameType: 'men-singles',
  numberOfSets: 3,
  pointsPerGame: 21,
  pointsDecidingGame: 21,
  capPoint: 30,
  conferenceGame: true,
  neutralVenue: false,
  intervalAt11: true,
  officials: [
    {
      id: 'off-1',
      firstName: 'Bambang',
      lastName: 'Roedyanto',
      role: 'Wasit Utama (Umpire)',
      licenseLevel: 'BWF Certificated Umpire',
      federation: 'PBSI / BWF',
      notes: 'Wasit BWF Level 1'
    },
    {
      id: 'off-2',
      firstName: 'Siti',
      lastName: 'Trisnawati',
      role: 'Hakim Servis (Service Judge)',
      licenseLevel: 'BWF Accredited',
      federation: 'PBSI',
      notes: 'Spesialis Service Judge Internasional'
    },
    {
      id: 'off-3',
      firstName: 'Ahmad',
      lastName: 'Kurniawan',
      role: 'Hakim Garis 1 (Line Judge)',
      licenseLevel: 'National Grade A',
      federation: 'PBSI DKI',
      notes: 'Line judge baseline court 1'
    },
    {
      id: 'off-4',
      firstName: 'Dewi',
      lastName: 'Puspitasari',
      role: 'Hakim Garis 2 (Line Judge)',
      licenseLevel: 'National Grade A',
      federation: 'PBSI Jabar',
      notes: 'Line judge sideline court 1'
    }
  ],
  sideA: {
    side: 'A',
    name: 'INDONESIA (INA)',
    code: 'INA',
    coachName: 'Irwansyah',
    jerseyColor: '#dc2626', // Red
    accentColor: '#ffffff',
    players: [
      {
        id: 'p-ina-1',
        name: 'Anthony Sinisuka GINTING',
        displayName: 'A. S. GINTING',
        worldRank: 6,
        handedness: 'Right',
        countryOrClub: 'Indonesia / PB SGS Bandung',
        jerseyNumber: '1'
      }
    ]
  },
  sideB: {
    side: 'B',
    name: 'DENMARK (DEN)',
    code: 'DEN',
    coachName: 'Kenneth Jonassen',
    jerseyColor: '#dc2626',
    accentColor: '#ffffff',
    players: [
      {
        id: 'p-den-1',
        name: 'Viktor AXELSEN',
        displayName: 'V. AXELSEN',
        worldRank: 1,
        handedness: 'Right',
        countryOrClub: 'Denmark / Odense',
        jerseyNumber: '1'
      }
    ]
  },
  printSettings: {
    printScoreSheet: true,
    printOfficials: true,
    printRallyTimeline: true,
    printStatsSummary: true,
    paperSize: 'A4',
    includeHeaderLogo: true
  },
  miscConfig: {
    showLiveScore: true,
    autoCourtChange: true,
    interval11DurationSec: 60,
    gameIntervalDurationSec: 120,
    videoChallengesPerGame: 2,
    soundAlerts: true,
    tvOverlayMode: true
  }
};

export const matchPresets: { label: string; config: Partial<MatchFormatConfig> }[] = [
  {
    label: 'MS: Anthony S. Ginting vs Viktor Axelsen (Indonesia Open)',
    config: {
      ...defaultMatchConfig,
      competition: 'INDONESIA OPEN 2026 - SUPER 1000',
      gameType: 'men-singles',
      sideA: {
        side: 'A',
        name: 'INDONESIA',
        code: 'INA',
        coachName: 'Irwansyah',
        jerseyColor: '#e11d48',
        accentColor: '#ffffff',
        players: [
          {
            id: 'p-1',
            name: 'Anthony Sinisuka GINTING',
            displayName: 'A. S. GINTING',
            worldRank: 6,
            handedness: 'Right',
            countryOrClub: 'Indonesia',
            jerseyNumber: '8'
          }
        ]
      },
      sideB: {
        side: 'B',
        name: 'DENMARK',
        code: 'DEN',
        coachName: 'Kenneth Jonassen',
        jerseyColor: '#dc2626',
        accentColor: '#ffffff',
        players: [
          {
            id: 'p-2',
            name: 'Viktor AXELSEN',
            displayName: 'V. AXELSEN',
            worldRank: 1,
            handedness: 'Right',
            countryOrClub: 'Denmark',
            jerseyNumber: '1'
          }
        ]
      }
    }
  },
  {
    label: 'MD: Fajar/Rian vs Liang/Wang (Final All England)',
    config: {
      ...defaultMatchConfig,
      competition: 'ALL ENGLAND OPEN 2026 - SUPER 1000',
      venue: 'UTILITA ARENA BIRMINGHAM',
      city: 'BIRMINGHAM',
      country: 'United Kingdom',
      gameType: 'men-doubles',
      sideA: {
        side: 'A',
        name: 'INDONESIA',
        code: 'INA',
        coachName: 'Aryono Miranat',
        jerseyColor: '#dc2626',
        accentColor: '#ffffff',
        players: [
          {
            id: 'p-md-1',
            name: 'Fajar ALFIAN',
            displayName: 'F. ALFIAN',
            worldRank: 5,
            handedness: 'Right',
            countryOrClub: 'Indonesia',
            jerseyNumber: '5'
          },
          {
            id: 'p-md-2',
            name: 'Muhammad Rian ARDIANTO',
            displayName: 'M. R. ARDIANTO',
            worldRank: 5,
            handedness: 'Right',
            countryOrClub: 'Indonesia',
            jerseyNumber: '7'
          }
        ]
      },
      sideB: {
        side: 'B',
        name: 'CHINA',
        code: 'CHN',
        coachName: 'Chen Qiqiu',
        jerseyColor: '#ca8a04',
        accentColor: '#991b1b',
        players: [
          {
            id: 'p-md-3',
            name: 'LIANG Wei Keng',
            displayName: 'W. K. LIANG',
            worldRank: 2,
            handedness: 'Right',
            countryOrClub: 'China',
            jerseyNumber: '11'
          },
          {
            id: 'p-md-4',
            name: 'WANG Chang',
            displayName: 'C. WANG',
            worldRank: 2,
            handedness: 'Right',
            countryOrClub: 'China',
            jerseyNumber: '12'
          }
        ]
      }
    }
  },
  {
    label: 'WS: Gregoria M. Tunjung vs An Se Young (Indonesia Masters)',
    config: {
      ...defaultMatchConfig,
      competition: 'DAIHATSU INDONESIA MASTERS 2026',
      gameType: 'women-singles',
      sideA: {
        side: 'A',
        name: 'INDONESIA',
        code: 'INA',
        coachName: 'Herli Djaenudin',
        jerseyColor: '#ef4444',
        accentColor: '#ffffff',
        players: [
          {
            id: 'p-ws-1',
            name: 'Gregoria Mariska TUNJUNG',
            displayName: 'G. M. TUNJUNG',
            worldRank: 7,
            handedness: 'Right',
            countryOrClub: 'Indonesia',
            jerseyNumber: '10'
          }
        ]
      },
      sideB: {
        side: 'B',
        name: 'KOREA',
        code: 'KOR',
        coachName: 'Kim Hak-kyun',
        jerseyColor: '#2563eb',
        accentColor: '#ffffff',
        players: [
          {
            id: 'p-ws-2',
            name: 'AN Se Young',
            displayName: 'S. Y. AN',
            worldRank: 1,
            handedness: 'Right',
            countryOrClub: 'South Korea',
            jerseyNumber: '1'
          }
        ]
      }
    }
  }
];
