#!/usr/bin/env bash
set -e

echo "🔧 HSE Dev Server Launcher (Potato Laptop Edition 🥔)"
echo "=========================================================="

# Kill existing processes on port 3001
fuser -k 3001/tcp 2>/dev/null || true
sleep 1

# Check if .next/standalone/server.js exists or if --build flag is passed
if [ ! -f ".next/standalone/server.js" ] || [ "$1" == "--build" ]; then
  echo ""
  echo "📦 Building lightweight standalone server (hemat 80% RAM)..."
  if [ -f "./node_modules/next/dist/bin/next" ]; then
    node ./node_modules/next/dist/bin/next build
  else
    npx next build
  fi
  
  # Copy static assets to standalone output
  cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
  cp -r public .next/standalone/ 2>/dev/null || true
  
  echo "✅ Build standalone selesai!"
  sleep 1
else
  echo ""
  echo "⚡ Menggunakan build standalone yang sudah ada (super hemat RAM & anti OOM!)."
  echo "💡 Tips: Jika Anda baru saja mengubah kode source, jalankan: ./start-dev.sh --build"
fi

# Start standalone server (Sangat ringan, hemat RAM, bebas OOM Killer)
echo ""
echo "🚀 Starting Standalone Ultra-Lightweight Server (~50MB RAM)..."
echo "   Open: http://localhost:3001"
echo "   Press Ctrl+C to stop"
echo ""

PORT=3001 HOSTNAME="0.0.0.0" exec node .next/standalone/server.js
