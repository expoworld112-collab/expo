// pages/auth/account/activate/[id].js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ActivatePage() {
  const router = useRouter();
  const { id: token } = router.query;

  const [message, setMessage] = useState('Activating...');

  useEffect(() => {
    if (!token) return;

    fetch('/api/account-activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || data.error || 'Unknown response');
      })
      .catch(err => {
        setMessage('Activation failed');
      });
  }, [token]);

  return <p>{message}</p>;
}
