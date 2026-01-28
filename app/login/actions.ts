"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

export async function signInAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const captchaToken = formData.get("captchaToken") as string; // AMBIL TOKENNYA

  const {error} = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken: captchaToken, // KIRIM KE SUPABASE
    },
  });

  if (error) {
    console.log("❌ Login Error:", error.message);
    return {error: error.message};
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
