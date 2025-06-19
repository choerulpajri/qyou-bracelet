'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Head from 'next/head'
import Image from 'next/image'

// Interface untuk data profil
interface UserProfile {
  name?: string;
  photoURL?: string;
  bio?: string;
  usia?: string;
  tinggal?: string;
  lahir?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  tweet?: string;
  favoriteAnimal?: string;
  favoriteBook?: string;
  favoriteSport?: string;
  favoriteMovie?: string;
  favoriteSinger?: string;
  favoriteSong?: string;
  favoriteColor?: string;
  favoriteFood?: string;
  favoriteDrink?: string;
}

export default function PublicProfile() {
  const router = useRouter()
  const { id } = router.query

  // State dengan tipe jelas
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Fetch profil dari Firestore
  useEffect(() => {
    if (!router.isReady || !id) return

    const fetchProfile = async () => {
      try {
        const q = query(collection(db, 'users'), where('qrid', '==', id))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          setProfile(snapshot.docs[0].data() as UserProfile)
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router.isReady, id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-orange-900 text-white">
        Memuat profil...
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-orange-900 text-white">
        Profil tidak ditemukan.
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>All About Me - {profile?.name || 'User'}</title>
      </Head>

      {/* Background Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Poster */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-black to-orange-900 text-white">
        <div className="hand-drawn-border max-w-4xl w-full p-8 space-y-10 font-sans">
          {/* Title */}
          <section className="flex justify-center">
            <h1 className="title-large text-center">ALL ABOUT ME!</h1>
          </section>

          {/* Profile Photo & Caption */}
          <section className="flex flex-col items-center">
            <div className="profile-photo-container mb-4 relative overflow-hidden rounded-full border-4 border-dashed border-white shadow-lg transition-transform duration-300 hover:scale-105 hover:rotate-6">
              <img
                src={profile?.photoURL || '/default.jpg'}
                alt="Foto Profil"
                className="profile-photo object-cover w-32 h-32"
                onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default.jpg';
               }}
              />
            </div>
            <p className="mt-2 text-2xl user-input caption-bounce font-semibold">
              {profile?.name || 'Anonim'}
            </p>
          </section>

          {/* Basic Info */}
          <section className="space-y-4">
            <h2 className="handwritten-title flex items-center gap-2">
              <span className="decorative-star" aria-hidden="true"></span>
              About Me
            </h2>
            <ul className="space-y-2 text-lg">
              <li>Nama: <span className="user-input">{profile?.name}</span></li>
              <li>Usia: <span className="user-input">{profile?.usia}</span></li>
              <li>Tinggal di: <span className="user-input">{profile?.tinggal}</span></li>
              <li>Tanggal Lahir: <span className="user-input">{profile?.lahir}</span></li>
            </ul>
          </section>

          {/* Social Media */}
          <section>
            <h2 className="handwritten-title flex items-center gap-2 mb-1">
              <span className="decorative-star" aria-hidden="true"></span>
              My Social Media
            </h2>
            <ul className="space-y-3 text-lg">
              {profile?.whatsapp && (
                <li className="flex items-center gap-2 user-input">
                  <Image src="/icons/whatsapp.svg" width={20} height={20} alt="whatsapp" />
                  <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
                    {profile.whatsapp}
                  </a>
                </li>
              )}
              {profile?.instagram && (
                <li className="flex items-center gap-2 user-input">
                  <Image src="/icons/instagram.svg" width={20} height={20} alt="Instagram" />
                  <a href={`https://instagram.com/${profile.instagram}`}  target="_blank" rel="noopener noreferrer">
                    @{profile.instagram}
                  </a>
                </li>
              )}
              {profile?.tiktok && (
                <li className="flex items-center gap-2 user-input">
                  <Image src="/icons/tiktok.svg" width={20} height={20} alt="TikTok" />
                  <a href={`https://tiktok.com/@${profile.tiktok}`}  target="_blank" rel="noopener noreferrer">
                    @{profile.tiktok}
                  </a>
                </li>
              )}
              {profile?.facebook && (
                <li className="flex items-center gap-2 user-input">
                  <Image src="/icons/facebook.svg" width={20} height={20} alt="Facebook" />
                  <a href={`https://facebook.com/${profile.facebook}`}  target="_blank" rel="noopener noreferrer">
                    {profile.facebook}
                  </a>
                </li>
              )}
              {profile?.tweet && (
                <li className="flex items-center gap-2 user-input">
                  <Image src="/icons/twitter.svg" width={20} height={20} alt="Twitter" />
                  <a href={`https://twitter.com/${profile.tweet}`}  target="_blank" rel="noopener noreferrer">
                    @{profile.tweet}
                  </a>
                </li>
              )}
            </ul>
          </section>

          {/* Top List */}
          <section>
            <h2 className="handwritten-title flex items-center gap-2 mb-4">
              <span className="decorative-star" aria-hidden="true"></span>
              My Top List
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-lg">
              <div><dt>Animal:</dt><dd className="user-input">{profile?.favoriteAnimal}</dd></div>
              <div><dt>Buku:</dt><dd className="user-input">{profile?.favoriteBook}</dd></div>
              <div><dt>Olahraga:</dt><dd className="user-input">{profile?.favoriteSport}</dd></div>
              <div><dt>Film:</dt><dd className="user-input">{profile?.favoriteMovie}</dd></div>
              <div><dt>Penyanyi:</dt><dd className="user-input">{profile?.favoriteSinger}</dd></div>
              <div><dt>Lagu:</dt><dd className="user-input">{profile?.favoriteSong}</dd></div>
              <div><dt>Warna:</dt><dd className="user-input">{profile?.favoriteColor}</dd></div>
              <div><dt>Makanan:</dt><dd className="user-input">{profile?.favoriteFood}</dd></div>
              <div><dt>Minuman:</dt><dd className="user-input">{profile?.favoriteDrink}</dd></div>
            </dl>
          </section>
        </div>
      </main>

      {/* CSS Styles */}
      <style jsx>{`
        .font-handwritten {
          font-family: 'Dancing Script', cursive;
        }
        .hand-drawn-border {
          border: 4px dashed white;
          border-radius: 1.5rem;
          padding: 1rem;
          box-shadow:
            inset 0 0 30px rgba(255, 255, 255, 0.18),
            0 0 20px rgba(255, 121, 36, 0.5);
          animation: subtleWiggle 5s infinite ease-in-out alternate;
        }
        @keyframes subtleWiggle {
          0% { transform: rotate(-0.2deg); }
          100% { transform: rotate(0.2deg); }
        }
        .title-large {
          font-size: 2rem;
          letter-spacing: 0.2em;
          color: transparent;
          -webkit-text-stroke: 1.5px orange;
          text-shadow:
            0 0 6px rgba(255, 121, 36, 0.9),
            0 0 12px rgba(255, 121, 36, 0.6);
          font-weight: bold;
          text-align: center;
        }
        .user-input {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow:
            0 0 1px rgba(255, 153, 36, 0.8),
            0 0 3px rgba(255, 121, 36, 0.4);
        }
        .user-input a {
          color: #ffcc66;
          text-decoration: underline;
        }
        .profile-photo-container {
          width: 120px;
          height: 120px;
          border-radius: 9999px;
          border: 5px dashed white;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(255, 121, 36, 0.6);
          transition: transform 0.35s ease;
        }
        .profile-photo-container:hover {
          transform: rotateZ(6deg) scale(1.05);
          box-shadow: 0 10px 32px #f97316, inset 0 0 44px rgba(255, 255, 255, 0.85);
        }
        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .caption-bounce {
          animation: bounceText 3s ease-in-out infinite;
        }
        @keyframes bounceText {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .decorative-star {
          display: inline-block;
          width: 25px;
          height: 20px;
          position: relative;
        }
        .decorative-star::before,
        .decorative-star::after {
          content: '';
          position: absolute;
          background: orange;
          top: 50%;
          left: 50%;
          border-radius: 1px;
          transform-origin: center;
        }
        .decorative-star::before {
          width: 2px;
          height: 100%;
          transform: translate(-50%, -50%) rotate(45deg);
          box-shadow: 0 0 4px orange;
        }
        .decorative-star::after {
          width: 2px;
          height: 100%;
          transform: translate(-50%, -50%) rotate(-45deg);
          box-shadow: 0 0 4px orange;
        }
        .handwritten-title {
          font-size: 2.2rem;
          color: transparent;
          -webkit-text-stroke: 1px orange;
          text-shadow:
            0 0 6px rgba(255, 121, 36, 0.8),
            0 0 12px rgba(255, 121, 36, 0.4);
          border-bottom: 2.5px dashed rgba(255, 165, 0, 0.6);
          padding-bottom: 0.2rem;
        }
      `}</style>
    </>
  )
}
