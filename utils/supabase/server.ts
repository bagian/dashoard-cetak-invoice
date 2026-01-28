import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";

export async function createClient() {
  const cookieStore = await cookies(); // Next.js 16 wajib pakai await buat cookies

  // Fungsi ini membuat koneksi ke Supabase
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Mengambil semua cookies yang ada
        getAll() {
          return cookieStore.getAll();
        },
        // Menyimpan cookies (misal token login)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Error ini wajar kalau dipanggil dari Server Component, abaikan saja
          }
        },
      },
    },
  );
}
