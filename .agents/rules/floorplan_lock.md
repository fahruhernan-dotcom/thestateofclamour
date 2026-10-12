# Floorplan Table Coordinates Lock Rule

## 🔒 PERINGATAN KERAS / STRICT RULE:
1. File src/data/floorPlanData.ts berisi pemetaan koordinat pin meja (x dan y dalam persentase) untuk denah Lantai 1 dan Lantai 2.
2. Seluruh koordinat di file tersebut telah dikalibrasi secara manual dan presisi sesuai gambar denah floor1-layout.png dan floor2-lounge.png.
3. DILARANG KERAS mengubah, menggeser, mengkalkulasi ulang, merapikan, atau menimpa nilai koordinat x dan y pada FLOOR_ONE_SPOTS dan FLOOR_TWO_SPOTS, KECUALI jika pengguna secara eksplisit meminta perubahan pada kode meja tertentu.
4. Jika pengguna meminta perubahan, gunakan mode /plan dan konfirmasikan nilai persentase baru sebelum mengubah file.
