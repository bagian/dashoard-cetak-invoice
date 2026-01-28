"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Ambil inputan user
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const {error} = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("❌ Error Supabase:", error.message);
    redirect("/login?error=Email atau Password Salah");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard"); // Kalau sukses, masuk dashboard
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const {error} = await supabase.auth.signUp(data);

  if (error) {
    redirect("/login?error=Gagal Daftar");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
