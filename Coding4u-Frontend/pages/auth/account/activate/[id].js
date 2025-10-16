// pages/auth/account/activate/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ActivateAccountPage() {
  const router = useRouter();
  const { id: token } = router.query;

  const [status, setStatus] = useState('Processing account activation...');

  useEffect(() => {
    if (!token) return;

    fetch('/api/account-activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setStatus(`✅ ${data.message}`);
        } else {
          setStatus(`❌ ${data.error || 'Unknown error'}`);
        }
      })
      .catch(() => {
        setStatus('❌ Activation failed. Network error.');
      });
  }, [token]);

  return <div>{status}</div>;
}
