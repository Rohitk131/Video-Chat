import React, { useState } from 'react';
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import './App.css';

const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiRGFzaF9SZW5kYXIiLCJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0Rhc2hfUmVuZGFyIiwiaWF0IjoxNzE2MDM5ODgxLCJleHAiOjE3MTY2NDQ2ODZ9.eAkUkZGcPaL6jAdAKHx5x17b5f2nCO_mvST-xY1l1gs';
const userId = 'Dash_Rendar';

const user: User = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });

export default function App() {
  const [call, setCall] = useState<Call | null>(null);

  const handleJoinWithInviteCode = (inviteCode: string) => {
    const callId = getCallIdFromInviteCode(inviteCode);
    if (callId) {
      const newCall = client.call('default', callId);
      newCall.join({ create: true });
      setCall(newCall);
    } else {
      alert('Invalid invite code.');
    }
  };

  const handleGenerateInviteCode = () => {
    const callId = 'IAuWpHkjQIIw'; // generate a unique call ID
    const inviteCode = generateInviteCode(callId);
    alert(`Invite code: ${inviteCode}`);
  };

  return (
    <div>
      {!call ? (
        <JoinForm onJoin={handleJoinWithInviteCode} onGenerateInviteCode={handleGenerateInviteCode} />
      ) : (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <MyUILayout />
          </StreamCall>
        </StreamVideo>
      )}
    </div>
  );
}

interface JoinFormProps {
  onJoin: (inviteCode: string) => void;
  onGenerateInviteCode: () => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ onJoin, onGenerateInviteCode }) => {
  const [inviteCode, setInviteCode] = useState<string>('');

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Join a Call</h2>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Enter invite code"
        />
        <button onClick={() => onJoin(inviteCode)}>Join with Invite Code</button>
        <button className="secondary" onClick={onGenerateInviteCode}>Generate Invite Code</button>
      </div>
    </div>
  );
};

const getCallIdFromInviteCode = (inviteCode: string): string | undefined => {
  const inviteCodeMapping: { [key: string]: string } = {
    '12345': 'IAuWpHkjQIIw', // example mapping
  };
  return inviteCodeMapping[inviteCode];
};

const generateInviteCode = (callId: string): string => {
  return '12345'; // example invite code
};

export const MyUILayout: React.FC = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};
