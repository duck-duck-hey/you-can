
export interface LogEntry {
  day: number;
  feeling: string;
  trigger: string;
  succeeded: boolean;
  timestamp: number;
}

export interface GameState {
  currentDay: number;
  level: number;
  awarenessPoints: number;
  controlPoints: number;
  energy: number;
  logs: LogEntry[];
  lastSuccessTimestamp: number | null;
  aiInsight: string | null;
  insightRequested: boolean;
}
