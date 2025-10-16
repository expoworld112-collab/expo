// // pages/api/account-activate.js
// import jwt from 'jsonwebtoken';
// import dbConnect from '../../utils/dbConnect';
// import User from '../../models/user';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).json({ error: `Method ${req.method} not allowed` });
//   }

//   try {
//     await dbConnect();

//     const { token } = req.body;
//     if (!token) {
//       return res.status(400).json({ error: 'Token is required' });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
//     } catch (err) {
//       return res.status(401).json({ error: 'Invalid or expired token' });
//     }

//     const { email } = decoded;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     if (user.isActivated) {
//       return res.status(400).json({ error: 'Account already activated' });
//     }

//     user.isActivated = true;
//     await user.save();

//     return res.status(200).json({ message: 'Account has been activated' });
//   } catch (err) {
//     console.error('Activation error:', err);
//     return res.status(500).json({ error: 'Server error during account activation' });
//   }
// }
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
      .then(async res => {
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
      .catch(err => {
        setStatus(`❌ Activation failed. ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, token]);

  return (
    <div>
      {loading ? '⏳ Processing...' : status}
    </div>
  );
}
