import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileInput, useAuth, useUpdateProfile } from "../hooks/useAuth";
import { User, Calendar, Mail, Activity, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "../lib/api";

export const Route = createFileRoute("/profile")({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const { data } = await api.get("/auth/me");
          return data.user;
        },
      });
      if (!user) {
        throw redirect({ to: "/login" });
      }
    } catch (e) {
      throw redirect({ to: "/login" });
    }
  },
  component: Profile,
});

function Profile() {
  const { data: user, isLoading } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      birthDate: "",
    },
  });

  useEffect(() => {
    if (user) {
      let formattedBirthDate = "";
      if (user.birthDate) {
        try {
          formattedBirthDate = new Date(user.birthDate).toISOString().split("T")[0];
        } catch (e) {
          console.error("Error parsing user.birthDate:", e);
        }
      }
      reset({
        name: user.name || "",
        birthDate: formattedBirthDate,
      });
    }
  }, [user, reset]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  const onSubmit = (data: UpdateProfileInput) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Profil berhasil diperbarui!");
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.message || "Gagal memperbarui profil";
        toast.error(errMsg);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Profil</h1>
          <p className="text-slate-500 mt-2">Kelola detail akun dan informasi pribadi Anda.</p>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-slate-100">
              <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.email}`} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">{user.name}</h2>
                <p className="text-slate-500 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Nama Anda"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Alamat email tidak dapat diubah.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    {...register("birthDate")}
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                {errors.birthDate && <p className="text-destructive text-xs mt-1">{errors.birthDate.message}</p>}
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!isDirty || isPending}
                  className="rounded-xl px-6"
                >
                  {isPending ? (
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
