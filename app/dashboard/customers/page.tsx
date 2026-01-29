import {getCustomersAction} from "@/app/actions";
import CustomerCard from "./customer-card";
import Link from "next/link";
import {Plus, Users, Search} from "lucide-react";

export default async function CustomersPage() {
  const customers = await getCustomersAction();

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10 w-full">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Customers</h1>
          <p className="text-gray-500">
            Kelola database klien {customers.length} orang.
          </p>
        </div>
        <div className="flex items-center gap-3  md:w-auto">
          <Link
            href="/dashboard/customers/create"
            className="flex sm:justify-start justify-center items-center gap-2 bg-[#1C1C1C] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#B6F09C] hover:text-black transition-all shadow-lg active:scale-95 w-full sm:w-fit"
          >
            <Plus size={18} /> Add Customer
          </Link>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold text-xl">Belum ada data customer</h3>
          <p className="text-gray-500">
            Mulai tambahkan klien untuk manajemen yang lebih baik.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {customers.map((c) => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </div>
      )}
    </div>
  );
}
