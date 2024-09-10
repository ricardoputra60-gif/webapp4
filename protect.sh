#!/bin/bash

# Step 1: Hapus folder dist
echo "Delete folder dist..."
rm -rf /Users/rmltech/Documents/react-js-project/rml-internet-bank-fake/dist
if [ $? -ne 0 ]; then
  echo "Gagal menghapus folder dist"
  exit 1
fi

# Step 2: Hapus folder dist-protected
echo "Delete folder dist-protected..."
rm -rf /Users/rmltech/Documents/react-js-project/rml-internet-bank-fake/dist-protected
if [ $? -ne 0 ]; then
  echo "Gagal menghapus folder dist-protected"
  exit 1
fi

# Step 3: Jalankan npm run build
echo "npm run build..."
npm run build
if [ $? -ne 0 ]; then
  echo "Gagal menjalankan npm run build"
  exit 1
fi

# Step 4: Jalankan npm run protect
echo "npm run protect..."
npm run protect
if [ $? -ne 0 ]; then
  echo "Gagal menjalankan npm run protect"
  exit 1
fi

# Step 5: Jalankan web menggunakan dist-protected
echo "Menjalankan web menggunakan dist-protected..."
serve -s /Users/rmltech/Documents/react-js-project/rml-internet-bank-fake/dist-protected
if [ $? -ne 0 ]; then
  echo "Gagal menjalankan web menggunakan dist-protected"
  exit 1
fi

echo "Skrip selesai."
