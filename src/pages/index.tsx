'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { QrCode, User, Settings, Smartphone } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 text-gray-800 font-sans">
      {/* HERO SECTION */}
      <motion.section
        className="relative flex flex-col items-center justify-center text-center py-24 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-70 z-0"></div>
        <div className="z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Qyou Bracelet
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            Gelang estetik dengan QR unik yang menampilkan identitas digital kamu secara elegan dan interaktif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Login
            </Link>
            <Link
              href="/u/trst12"
              className="bg-white border border-blue-500 text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Coba Sekarang
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ILLUSTRATION + VALUE PROPOSITION */}
      <motion.section
        className="py-16 px-6 bg-white"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img src="/illustrations/bracelet_demo.svg" alt="QR Bracelet Demo" className="w-full max-w-xs mx-auto" />
          <div>
            <h2 className="text-3xl font-bold mb-4 text-blue-700">Kenalkan Dirimu Dengan Satu Scan</h2>
            <p className="text-gray-700 mb-4">
              QR code pada gelang akan membuka profil publik kamu — seperti kartu nama digital yang selalu kamu bawa.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <Smartphone size={18} className="text-blue-600" /> Mudah discan dengan ponsel apa pun
              </li>
              <li className="flex items-center gap-2">
                <QrCode size={18} className="text-blue-600" /> QR code unik untuk setiap pengguna
              </li>
              <li className="flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Profil bisa diedit kapan saja
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* FEATURES SECTION */}
      <motion.section
        className="py-16 px-6 bg-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">Fitur Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <QrCode size={40} className="text-blue-600 mb-4" />,
              title: "QR Unik & Estetik",
              desc: "Setiap gelang memiliki QR unik yang langsung mengarah ke profil kamu.",
            },
            {
              icon: <User size={40} className="text-blue-600 mb-4" />,
              title: "Profil Publik",
              desc: "Tampilkan informasi bio, kontak, dan sosial media kamu.",
            },
            {
              icon: <Settings size={40} className="text-blue-600 mb-4" />,
              title: "Dashboard Pribadi",
              desc: "Kelola isi profilmu kapan saja lewat dashboard yang simple dan aman.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition group"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Mulai bangun identitas digitalmu hari ini!</h2>
        <p className="text-lg mb-6">Gelang QR yang simple, elegan, dan powerful.</p>
        <Link
          href="/login"
          className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Daftar Sekarang
        </Link>
      </motion.section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-gray-600 bg-white">
        &copy; {new Date().getFullYear()} Qyou Bracelet. Made with 💙 in Indonesia.
      </footer>
    </main>
  )
}