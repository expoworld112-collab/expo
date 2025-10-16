import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ActivateAccountPage() {
  const router = useRouter();
  const { id: token } = router.query;

  const [status, setStatus] = useState('Processing account activation...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !token) return;

    if (typeof token !== 'string' || token.trim() === '') {
      setStatus('❌ Invalid activation link.');
      setLoading(false);
      return;
    }

    fetch('/api/account-activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error('Invalid server response');
        }

        if (res.ok) {
          setStatus(`✅ ${data.message || 'Account activated successfully.'}`);
          setTimeout(() => router.push('/auth/login'), 3000);
        } else {
          setStatus(`❌ ${data.error || 'Activation failed.'}`);
        }
      })
      .catch((err) => {
        setStatus(`❌ Activation failed. ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, token]);

  return <div>{loading ? '⏳ Processing...' : status}</div>;
}
