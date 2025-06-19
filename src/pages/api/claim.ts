// src/pages/api/claim.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, query, where, getDocs, collection } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { qrid, name, email, password } = req.body;

    if (!qrid || !name || !email || !password) {
      return res.status(400).json({ error: 'Incomplete form data' });
    }

    try {
      // Cek apakah QR ID sudah diklaim
      const userRef = doc(db, 'users', qrid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return res.status(409).json({ error: 'QR ID sudah diklaim' });
      }

      // Cek apakah email sudah ada di Firestore
      const emailQuery = query(collection(db, 'users'), where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        return res.status(409).json({ error: 'Email sudah terdaftar' });
      }

      // Simpan data pengguna baru
      await setDoc(userRef, {
        name,
        email,
        password, // ⚠️ Sebaiknya di-hash nanti
        createdAt: new Date(),
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Firestore error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
