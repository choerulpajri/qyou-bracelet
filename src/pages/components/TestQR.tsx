'use client';

import { useEffect, useRef } from 'react';
const QRCode = require('qrcode');

export default function TestQR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        const url = 'http://192.168.1.9:3000/u/trst12';
        await QRCode.toCanvas(canvasRef.current, url, {
          width: 200,
        });
      }
    };
    generateQR();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">QR Code ke /claim/test1</h2>
      <canvas ref={canvasRef} />
      <p className="mt-2 text-sm text-gray-500">Scan QR ini dari HP kamu.</p>
    </div>
  );
}
