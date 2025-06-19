'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [editableData, setEditableData] = useState<any>({})
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push('/login')

      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        setUserData(data)
        setEditableData(data)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleChange = (field: string, value: string) => {
    setEditableData({ ...editableData, [field]: value })
  }

  const handleImageUpload = (file: File) => {
    if (!auth.currentUser ) return

    setUploading(true)

    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      const MAX_SIZE = 300
      let { width, height } = img

      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width
          width = MAX_SIZE
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height
          height = MAX_SIZE
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      ctx?.drawImage(img, 0, 0, width, height)
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.6)

      setEditableData({ ...editableData, photoURL: resizedBase64 })
      setUploading(false)
    }

    img.onerror = () => {
      alert('Gagal memuat gambar.')
      setUploading(false)
    }

    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!auth.currentUser ) return

    try {
      setUploading(true)
      const docRef = doc(db, 'users', auth.currentUser .uid)
      await setDoc(docRef, editableData, { merge: true })
      alert('Profil berhasil disimpan!')
    } catch (error) {
      console.error('Gagal menyimpan profil:', error)
      alert('Gagal menyimpan profil.')
    } finally {
      setUploading(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-orange-900 text-white">
        Memuat data...
      </div>
    )

  if (!userData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-orange-900 text-white">
        Data tidak ditemukan.
      </div>
    )

  return (
    <>
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

      {/* Main Container */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-black to-blue-900 text-white"
      >
        <div className="hand-drawn-border max-w-4xl w-full p-8 space-y-8 font-sans backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">Edit Profil</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto Profil */}
            <div className="flex flex-col items-center">
              <label className="font-semibold mb-2">Foto Profil</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0])
                  }
                }}
                className="mb-2 text-sm text-white"
              />
              {uploading && <p className="text-xs text-orange-300">Mengunggah foto...</p>}
              {editableData.photoURL && (
                <img
                  src={editableData.photoURL}
                  alt="Foto Profil"
                  className="w-32 h-32 rounded-full object-cover border-2 border-white shadow-lg mt-2"
                />
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold">Nama</label>
                <input
                  type="text"
                  value={editableData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <div>
                <label className="block font-semibold">Usia</label>
                <input
                  type="number"
                  value={editableData.usia || ''}
                  onChange={(e) => handleChange('usia', e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold">Tempat Tinggal</label>
                <input
                  type="text"
                  value={editableData.tinggal || ''}
                  onChange={(e) => handleChange('tinggal', e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold">Tanggal Lahir</label>
                <input
                  type="date"
                  value={editableData.lahir || ''}
                  onChange={(e) => handleChange('lahir', e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-semibold">Bio</label>
            <textarea
              value={editableData.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block font-semibold">WhatsApp</label>
            <input
              type="text"
              value={editableData.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Sosial Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Instagram</label>
              <input
                type="text"
                value={editableData.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold">TikTok</label>
              <input
                type="text"
                value={editableData.tiktok || ''}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold">Facebook</label>
              <input
                type="text"
                value={editableData.facebook || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-semibold">Twitter/X</label>
              <input
                type="text"
                value={editableData.tweet || ''}
                onChange={(e) => handleChange('tweet', e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {uploading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
