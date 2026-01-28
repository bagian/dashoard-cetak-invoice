"use client";

import {useState} from "react";
import {updateProjectAction} from "@/app/actions";
import {useToast} from "@/components/providers/toast-provider";
import {Save, Loader2, AlertCircle, User, Building2} from "lucide-react";
import {useRouter} from "next/navigation";

interface Project {
  id: string;
  name?: string;
  client_name?: string;
  progress?: number;
}

export default function EditProjectForm({project}: {project: Project}) {
  const router = useRouter();
  const {showToast} = useToast();
  const [projectName, setProjectName] = useState(project.name || "");
  const [clientName, setClientName] = useState(project.client_name || "");
  const [progress, setProgress] = useState(project.progress || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!projectName.trim()) {
        const errMsg = "Nama project tidak boleh kosong";
        setError(errMsg);
        showToast(errMsg, "error");
        setIsLoading(false);
        return;
      }

      if (!clientName.trim()) {
        const errMsg = "Nama client tidak boleh kosong";
        setError(errMsg);
        showToast(errMsg, "error");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("id", project.id);
      formData.append("name", projectName.trim());
      formData.append("client_name", clientName.trim());
      formData.append("progress", progress.toString());

      const result = await updateProjectAction(formData);

      if (result?.error) {
        setError(result.error);
        showToast(result.error, "error");
        setIsLoading(false);
        return;
      }

      showToast("Project berhasil diperbarui!", "success");
      setTimeout(() => {
        router.refresh(); // Refresh data server
        router.push("/dashboard/projects"); // Kembali ke list
      }, 1500);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errMsg);
      showToast(errMsg, "error");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm space-y-6"
    >
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900">
        <Save className="text-[#B6F09C]" />
        Edit Project
      </h3>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle
            className="text-red-500 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div>
            <p className="font-bold text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* --- PROJECT NAME --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Project
        </label>
        <div className="relative">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={isLoading}
            placeholder="Masukkan nama project"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Building2
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* --- CLIENT NAME --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Client
        </label>
        <div className="relative">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            disabled={isLoading}
            placeholder="Masukkan nama client"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* --- PROGRESS --- */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <label className="text-sm font-medium text-gray-700">
            Persentase Pengerjaan
          </label>
          <span className="text-3xl font-bold text-[#1C1C1C]">{progress}%</span>
        </div>

        {/* CUSTOM RANGE SLIDER */}
        <div className="relative w-full h-6 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            disabled={isLoading}
            // --- BAGIAN KUNCI (LOGIC WARNA) ---
            style={{
              background: `linear-gradient(to right, #7ef367 0%, #42af2c ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
            }}
            // ----------------------------------
            className="
                    w-full h-3 rounded-lg appearance-none cursor-pointer
                    /* Hapus class bg-gray-200 disini karena sudah dihandle oleh style di atas */

                    /* --- CSS KHUSUS CHROME, SAFARI, EDGE --- */
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-6      
                    [&::-webkit-slider-thumb]:h-6      
                    [&::-webkit-slider-thumb]:bg-[#1a500f] /* Warna Pill */
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-webkit-slider-thumb]:border-2 
                    [&::-webkit-slider-thumb]:border-white /* Opsional: Biar pill lebih pop-up */

                    /* --- CSS KHUSUS FIREFOX --- */
                    [&::-moz-range-thumb]:w-6
                    [&::-moz-range-thumb]:h-6
                    [&::-moz-range-thumb]:bg-[#1a500f]
                    [&::-moz-range-thumb]:border-none
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:transition-all
                    [&::-moz-range-thumb]:hover:scale-110

                    /* State Disabled */
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
          <span>0% (Start)</span>
          <span>50% (Halfway)</span>
          <span>100% (Finish)</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-xl font-bold bg-[#B6F09C] hover:bg-[#a3d98b] text-black transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              Simpan Update
            </>
          )}
        </button>
      </div>
    </form>
  );
}
