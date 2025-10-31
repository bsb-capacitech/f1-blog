import { Session } from '../f1-api.service';

export const MOCK_SESSIONS: Session[] = [
  {
    session_key: 1,
    meeting_key: 100,
    session_name: 'Practice 1',
    session_type: 'Practice',
    date_start: '2024-05-01T10:00:00Z'
  },
  {
    session_key: 2,
    meeting_key: 100,
    session_name: 'Qualifying 1',
    session_type: 'Qualifying',
    date_start: '2024-05-01T14:00:00Z'
  },
  {
    session_key: 1,
    meeting_key: 100,
    session_name: 'Race 1',
    session_type: 'Race',
    date_start: '2024-05-02T15:00:00Z'
  }
];

export const MOCK_DRIVERS = [
  {
    driver_number: 1,
    broadcast_name: 'M VERSTAPPEN',
    full_name: 'Max Verstappen',
    team_name: 'Red Bull Racing'
  },
  {
    driver_number: 44,
    broadcast_name: 'L HAMILTON',
    full_name: 'Lewis Hamilton',
    team_name: 'Ferrari'
  }
];

export const MOCK_ERROR_RESPONSE = new ProgressEvent('Network error');
