import {createClient} from "@/utils/supabase/server";
import {notFound, redirect} from "next/navigation";
import EditInvoiceForm from "./edit-form";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const {data: invoice, error} = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) notFound();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Edit Invoice</h1>
        <p className="text-gray-500">Ubah detail invoice yang sudah dibuat.</p>
      </div>

      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}
