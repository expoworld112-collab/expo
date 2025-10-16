
import jwt from 'jsonwebtoken';
import dbConnect from '../../utils/dbConnect';  // your DB connection util
import User from '../../models/user';  // your User model

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Only allow POST
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Connect to database
    await dbConnect();

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      const { name, email } = decoded;

      // Find user
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      if (user.isActivated) {
        return res.status(400).json({ error: 'Account already activated' });
      }

      // Activate the user
      user.isActivated = true;
      await user.save();

      return res.status(200).json({ message: 'Account has been activated' });
    });
  } catch (err) {
    console.error('Activation error:', err);
    return res.status(500).json({ error: 'Server error during account activation' });
  }
}
