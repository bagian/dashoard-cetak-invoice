import {getCustomerProfileAction, Customer, Project} from "@/app/actions";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import ProjectCard from "../../projects/project-card"; // Pastikan path ini benar

interface PageProps {
  params: Promise<{id: string}>;
}

export default async function CustomerProfilePage({params}: PageProps) {
  // Unwrapping params untuk Next.js 16
  const resolvedParams = await params;
  const {customer, projects, error} = await getCustomerProfileAction(
    resolvedParams.id,
  );

  if (error || !customer) {
    return (
      <div className="p-20 text-center bg-white rounded-[32px] border border-gray-100 mt-10">
        <h2 className="text-xl font-bold text-gray-800">
          Customer Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-6">ID: {resolvedParams.id}</p>
        <Link
          href="/dashboard/customers"
          className="text-blue-500 hover:underline font-bold"
        >
          Kembali ke Daftar Customer
        </Link>
      </div>
    );
  }

  const projectList: Project[] = projects ?? [];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 font-sans">
      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard/customers"
            className="p-3 bg-white rounded-full border border-gray-100 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft size={22} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#1C1C1C]">
              {customer.name}
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Building2 size={16} /> {customer.company || "Personal Client"}
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/customers/${customer.id}/edit`}
          className="gap-2 bg-[#1C1C1C] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#B6F09C] hover:text-black transition-all shadow-lg active:scale-95 w-full sm:w-fit flex items-center justify-center"
        >
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar Kontak */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-fit">
          <h3 className="text-xs  uppercase tracking-widest text-gray-400 mb-6">
            Informasi Kontak
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] uppercase font-black text-[#1C1C1C]">
                  Email
                </p>
                <p className="text-sm text-gray-800 truncate">
                  {customer.email || "-"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-50 text-green-500 rounded-lg">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[12px] uppercase font-black text-[#1C1C1C]">
                  Telepon
                </p>
                <p className="text-sm text-gray-800">{customer.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[12px] uppercase font-black text-[#1C1C1C]">
                  Alamat
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {customer.address || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-[#1C1C1C] flex items-center gap-2">
              <Briefcase className="text-[#B6F09C]" /> Project History
            </h2>
            <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold">
              {projectList.length} Projects
            </span>
          </div>

          {projectList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectList.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center text-gray-400 font-medium">
              Belum ada riwayat proyek untuk customer ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
