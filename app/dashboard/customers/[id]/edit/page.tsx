import {getCustomerProfileAction} from "@/app/actions";
import EditCustomerForm from "./edit-form";

interface PageProps {
  params: Promise<{id: string}>;
}

export default async function EditCustomerPage({params}: PageProps) {
  const resolvedParams = await params;
  const {customer, error} = await getCustomerProfileAction(resolvedParams.id);

  if (error || !customer) {
    return (
      <div className="p-10 text-center font-sans text-gray-500">
        Data customer tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-[#1C1C1C] font-sans">
        Edit Customer
      </h1>
      {/* KUNCI: Gunakan key agar form re-mount otomatis saat data customer berubah */}
      <EditCustomerForm key={customer.id} customer={customer} params={params} />
    </div>
  );
}
