"use server";

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Ambil Invoices (History & Chart)
  const {data: invoices} = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {ascending: false});

  // 2. Ambil Projects (Widget Progress)
  const {data: projects} = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("deadline", {ascending: true});

  // --- LOGIC STATISTIK ---
  const totalRevenue =
    invoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
  const totalInvoices = invoices?.length || 0;
  const paidInvoices =
    invoices?.filter((inv) => inv.status === "PAID").length || 0;
  const pendingInvoices =
    invoices?.filter((inv) => inv.status !== "PAID").length || 0;

  // --- LOGIC CHART ---
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();
  const chartData = Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setMonth(currentMonth - (5 - i));
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    const revenue =
      invoices
        ?.filter((inv) => {
          const invDate = new Date(inv.created_at);
          return (
            invDate.getMonth() === monthIndex && invDate.getFullYear() === year
          );
        })
        .reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
    return {name: months[monthIndex], revenue: revenue};
  });

  // --- LOGIC PROJECT STATS (DENGAN FALLBACK) ---
  // Jika category NULL, kita anggap 'Web Development' agar widget tidak error/hilang
  const webProjects =
    projects?.filter((p) => p.category === "Web Development" || !p.category) ||
    [];
  const appProjects =
    projects?.filter((p) => p.category === "App Development") || [];

  const calculateAvg = (projs: {progress: number | null}[]) => {
    if (projs.length === 0) return 0;
    const totalProgress = projs.reduce((sum, p) => sum + (p.progress || 0), 0);
    return Math.round(totalProgress / projs.length);
  };

  const projectStats = {
    web: {count: webProjects.length, progress: calculateAvg(webProjects)},
    app: {count: appProjects.length, progress: calculateAvg(appProjects)},
  };

  // --- DATA HARI LIBUR NASIONAL 2026 (Format: "Bulan-Tanggal") ---
  // Bulan dimulai dari 0 (Januari) sampai 11 (Desember)
  const holidays2026: Record<string, string> = {
    "0-1": "Tahun Baru 2026",
    "0-27": "Isra Mi'raj",
    "1-12": "Tahun Baru Imlek", // Feb (Bulan 1)
    "2-3": "Hari Raya Nyepi", // Mar (Bulan 2)
    "2-20": "Idul Fitri 1447H", // Estimasi Mar (Bulan 2)
    "2-31": "Cuti Bersama",
    "4-1": "Hari Buruh", // Mei (Bulan 4)
    "4-13": "Kenaikan Isa Almasih",
    "4-23": "Hari Waisak",
    "5-1": "Hari Lahir Pancasila", // Jun (Bulan 5)
    "5-6": "Idul Adha 1447H",
    "6-7": "Tahun Baru Islam", // Jul (Bulan 6)
    "7-17": "HUT RI ke-81", // Agu (Bulan 7)
    "9-8": "Maulid Nabi", // Okt (Bulan 9)
    "11-25": "Hari Natal", // Des (Bulan 11)
  };

  return {
    stats: {totalRevenue, totalInvoices, paidInvoices, pendingInvoices},
    chartData,
    projects: projects || [],
    invoices: invoices || [],
    projectStats, // Data ini wajib ada agar frontend tidak error
    holidays: holidays2026,
  };
}

// ... (Function createInvoiceAction tetap sama seperti sebelumnya)
export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const rawData = {
    user_id: user.id,
    customer_name: formData.get("customerName") as string,
    customer_email: formData.get("customerEmail") as string,
    customer_address: formData.get("customerAddress") as string,
    items: JSON.parse(formData.get("items") as string),
    total_amount: Number(formData.get("totalAmount")),
    status: formData.get("status") as string,
    due_date: (formData.get("dueDate") as string) || null,
    notes: formData.get("notes") as string,
  };

  const {data, error} = await supabase
    .from("invoices")
    .insert(rawData)
    .select("id")
    .single();
  if (error) return {error: error.message};

  revalidatePath("/dashboard");
  return {success: true, id: data.id};
}

// --- DELETE INVOICE ---
export async function deleteInvoiceAction(id: string) {
  const supabase = await createClient();

  const {error} = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    return {error: error.message};
  }

  revalidatePath("/dashboard/invoices");
  return {success: true};
}

// --- CREATE PROJECT ACTION ---
export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const name = formData.get("name") as string;
  const client_name = formData.get("clientName") as string;
  const category = formData.get("category") as string;
  const deadline = formData.get("deadline") as string;

  // Validasi sederhana
  if (!name || !client_name || !deadline) {
    return {error: "Mohon lengkapi semua data."};
  }

  const {error} = await supabase.from("projects").insert({
    user_id: user.id,
    name,
    client_name,
    category, // Web Development / App Development
    deadline,
    status: "ONGOING", // Default status
    progress: 0, // Default progress
  });

  if (error) return {error: error.message};

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard"); // Refresh statistik dashboard utama juga
  return {success: true};
}

// --- UPDATE PROJECT ACTION ---
export async function updateProjectAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) return {error: "User not authenticated"};

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const clientName = formData.get("client_name") as string;
    const progress = Number(formData.get("progress"));

    // Validasi
    if (!id) return {error: "Project ID tidak ditemukan"};
    if (!name?.trim()) return {error: "Nama project tidak boleh kosong"};
    if (!clientName?.trim()) return {error: "Nama client tidak boleh kosong"};
    if (isNaN(progress)) return {error: "Progress harus berupa angka"};

    // Logic Status Otomatis
    let status = "ONGOING";
    if (progress === 100) status = "COMPLETED";
    if (progress === 0) status = "PENDING";

    const {data, error} = await supabase
      .from("projects")
      .update({
        name: name.trim(),
        client_name: clientName.trim(),
        progress,
        status,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return {error: error.message || "Gagal mengupdate project"};
    }

    if (!data || data.length === 0) {
      return {error: "Project tidak ditemukan atau Anda tidak memiliki akses"};
    }

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath(`/dashboard/projects/${id}/edit`);

    return {success: true, data: data[0]};
  } catch (error) {
    console.error("Update project error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak terduga",
    };
  }
}

export async function deleteProjectAction(projectId: string) {
  const supabase = await createClient();

  // Hapus data project berdasarkan ID
  const {error} = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    return {error: error.message};
  }

  // Refresh halaman agar card hilang
  revalidatePath("/dashboard/projects");
  return {success: true};
}

// --- CREATE CUSTOMER ACTION ---
export async function createCustomerAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const {error} = await supabase.from("customers").insert([
    {
      name,
      company,
      email,
      phone,
      address,
      user_id: user.id,
    },
  ]);

  if (error) return {error: error.message};

  revalidatePath("/dashboard/customers");
  return {success: true};
}

// --- GET ALL CUSTOMERS ---
export async function getCustomersAction() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return [];

  const {data, error} = await supabase
    .from("customers")
    .select("id, name, company, email, phone")
    .eq("user_id", user.id)
    .order("name", {ascending: true});

  if (error) return [];
  return data;
}

// --- DELETE CUSTOMER ---
export async function deleteCustomerAction(id: string) {
  const supabase = await createClient();
  const {error} = await supabase.from("customers").delete().eq("id", id);
  if (error) return {error: error.message};
  revalidatePath("/dashboard/customers");
  return {success: true};
}

// --- GET CUSTOMER PROFILE ---
export async function getCustomerProfileAction(id: string) {
  const supabase = await createClient();

  // Ambil data customer
  const {data: customer, error: customerError} = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (customerError) return {error: customerError.message};

  // Ambil proyek yang terkait dengan nama customer ini
  const {data: projects, error: projectsError} = await supabase
    .from("projects")
    .select("*")
    .eq("client_name", customer.name) // Menghubungkan lewat nama
    .order("created_at", {ascending: false});

  return {customer, projects: projects || []};
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Project {
  id: string;
  name: string;
  client_name: string;
  category: string;
  status: string;
  deadline: string | null;
  progress: number;
}

// --- UPDATE CUSTOMER ACTION ---
export async function updateCustomerAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const updateData = {
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  const {error} = await supabase
    .from("customers")
    .update(updateData)
    .eq("id", id);

  if (error) return {error: error.message};

  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
  return {success: true};
}

// --- SIGN IN CONFIGURATION ---
export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const {error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {error: error.message};
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
