import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Filter,
  Info,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  TrendingUp,
  Trash2,
} from "lucide-react";
import api from "@/lib/api";
// import testHistory from "@/lib/testHistory.json";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/history")({
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
  component: HistoryPage,
});

interface HistoryItem {
  id: string;
  answers: Record<string, any>;
  score: number;
  category: string;
  advice: string;
  createdAt: string;
}

function HistoryPage() {
  const {
    data: history,
    isLoading,
    refetch,
  } = useQuery<HistoryItem[]>({
    queryKey: ["history"],
    queryFn: async () => {
      try {
        const res = await api.get("/chatbot/history");
        if (res.data && res.data.data) return res.data.data;
        return [];
      } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
        return [];
      }
    },
  });

  const getCategoryVariant = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("low") || cat.includes("normal") || cat.includes("rendah")) return "success";
    if (cat.includes("medium") || cat.includes("moderate") || cat.includes("sedang")) return "warning";
    if (cat.includes("high") || cat.includes("severe") || cat.includes("tinggi")) return "destructive";
    return "default";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id: string) => {
    console.log("Hapus riwayat dengan ID:", id);
    try {
      const res = await api.delete(`/chatbot/history/${id}`);
      if (res.data) {
        toast.success("Catatan riwayat berhasil dihapus.");
        refetch();
      }
    } catch (error) {
      toast.error("Gagal menghapus catatan riwayat.");
    }
  };

  // Calculate summary stats
  const totalMeasurements = history?.length || 0;
  const avgScore =
    totalMeasurements > 0
      ? Math.round(history!.reduce((acc, curr) => acc + curr.score, 0) / totalMeasurements)
      : 0;
  const lastMeasurement = history && history.length > 0 ? history[0] : null;

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="blob blob-blue w-[500px] h-[500px] -top-64 -left-64 opacity-20" />
      <div className="blob blob-pink w-[400px] h-[400px] bottom-0 -right-40 opacity-15" />

      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link
                  to="/"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" /> Beranda
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Riwayat</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Dasbor Kesejahteraan</h1>
              <p className="text-muted-foreground">Pantau pola stres Anda dari waktu ke waktu.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="hero">
                <Link to="/measurement">Pemeriksaan Baru</Link>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3 animate-fade-up-delay-1">
            <Card className="glass border-none shadow-soft overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Skor Stres</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgScore}</div>
                <p className="text-xs text-muted-foreground">
                  Berdasarkan {totalMeasurements} pemeriksaan
                </p>
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${avgScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-none shadow-soft overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-bright" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kategori Terbaru</CardTitle>
                <LayoutDashboard className="h-4 w-4 text-accent-bright" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lastMeasurement ? lastMeasurement.category : "Tidak Ada Data"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tercatat pada {lastMeasurement ? formatDate(lastMeasurement.createdAt) : "N/A"}
                </p>
                {lastMeasurement && (
                  <Badge className="mt-4" variant={getCategoryVariant(lastMeasurement.category)}>
                    {lastMeasurement.category}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-none shadow-soft overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sesi</CardTitle>
                <LineChart className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMeasurements}</div>
                <p className="text-xs text-muted-foreground">Pemeriksaan selesai</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Konsistensi adalah kunci</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Table */}
          <Card className="glass border-none shadow-card animate-fade-up-delay-2">
            <CardHeader className="pb-3">
              <CardTitle>Pemeriksaan Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground animate-pulse">Mengambil perjalanan kesejahteraan Anda...</p>
                </div>
              ) : history && history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="w-[180px]">Tanggal & Waktu</TableHead>
                      <TableHead>Skor Stres</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="hidden md:table-cell">Jawaban Kunci</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow
                        key={item.id}
                        className="group border-border/40 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDate(item.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.score > 70 ? "bg-destructive" : item.score > 40 ? "bg-warning" : "bg-success"}`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <span className="font-semibold">{item.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getCategoryVariant(item.category)}
                            className="font-medium"
                          >
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          <div className="flex items-center gap-2">
                            <Info className="h-3.5 w-3.5" />
                            Tidur: {item.answers.sleep_duration || "N/A"} jam
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to="/result" search={{ id: item.id }}>
                                Lihat Detail <ChevronRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="glass shadow-card border-none">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus catatan pemeriksaan?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini akan menghapus pengukuran stres ini secara permanen dari riwayat Anda. Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    variant="outline"
                                    size="default"
                                    className="border-border hover:bg-accent/5"
                                  >
                                    Batal
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    variant="destructive"
                                    size="default"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Belum ada pemeriksaan</h3>
                  <p className="text-muted-foreground max-w-xs mb-6">
                    Mulai analisis stres pertama Anda untuk melihat riwayat Anda di sini.
                  </p>
                  <Button asChild variant="hero">
                    <Link to="/measurement">Mulai Sekarang</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
