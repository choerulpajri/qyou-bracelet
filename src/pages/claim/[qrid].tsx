import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import yang benar
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';

export default function ClaimPage() {
  const router = useRouter();
  const { qrid } = router.query;

  // State untuk simpan data form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk data profil user (null jika belum ada)
  const [userProfile, setUserProfile] = useState<any>(null);

  // Cek apakah QR ID sudah diklaim
  useEffect(() => {
    if (!router.isReady || !qrid) return;

    const checkQR = async () => {
      try {
        const q = query(collection(db, 'users'), where('qrid', '==', qrid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // Jika sudah ada, ambil data profil user
          const userDoc = snapshot.docs[0];
          setUserProfile(userDoc.data());
        }
        setLoading(false);
      } catch (err) {
        setError('Gagal memeriksa QR ID.');
        setLoading(false);
      }
    };

    checkQR();
  }, [router.isReady, qrid]);

  // Fungsi untuk handle input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi submit form daftar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Daftarkan user di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Simpan data user di Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        qrid,
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString(),
      });

      // Arahkan ke halaman profil
      router.push(`/u/${qrid}`);
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar.');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat halaman...</p>;

  return (
    <main className="container">
      <h1>Klaim QR ID: {qrid}</h1>

      {error && <p className="error">{error}</p>}

      {userProfile ? (
        router.push(`/u/${qrid}`)
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Nama lengkap"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            Klaim & Daftar
          </button>
        </form>
      )}
    </main>
  );
}
