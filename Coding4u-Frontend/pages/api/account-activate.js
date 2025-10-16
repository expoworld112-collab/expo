// export default async function handler(req, res) {
//   try {
//     await res.revalidate(req.query.path);
//     return res.json({
//       revalidated: true
//     });
//   } catch (err) {
//     return res.status(500).send('Error revalidating');
//   }
// }
// pages/api/account-activate.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;
    // Decode and activate logic here
    return res.status(200).json({ message: "Account activated" });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
