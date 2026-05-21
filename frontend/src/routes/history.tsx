import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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
        console.log(res.data);
        if (res.data && res.data.data) return res.data.data;
        return [];
      } catch (error) {
        console.error("Failed to fetch history:", error);
        return [];
      }
    },
  });

  const getCategoryVariant = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("low") || cat.includes("normal")) return "success";
    if (cat.includes("medium") || cat.includes("moderate")) return "warning";
    if (cat.includes("high") || cat.includes("severe")) return "destructive";
    return "default";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id: string) => {
    // TODO: Connect this to your backend API to delete the history item
    console.log("Delete history item with ID:", id);
    try {
      const res = await api.delete(`/chatbot/history/${id}`);
      if (res.data) {
        toast.success("History item deleted successfully.");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete history item.");
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
                  <ArrowLeft className="h-3 w-3" /> Home
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">History</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Wellbeing Dashboard</h1>
              <p className="text-muted-foreground">Monitor your stress patterns over time.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="glass">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button asChild size="sm" variant="hero">
                <Link to="/measurement">New Check-in</Link>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3 animate-fade-up-delay-1">
            <Card className="glass border-none shadow-soft overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Stress Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgScore}</div>
                <p className="text-xs text-muted-foreground">
                  Based on {totalMeasurements} check-ins
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
                <CardTitle className="text-sm font-medium">Latest Category</CardTitle>
                <LayoutDashboard className="h-4 w-4 text-accent-bright" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lastMeasurement ? lastMeasurement.category : "No Data"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recorded on {lastMeasurement ? formatDate(lastMeasurement.createdAt) : "N/A"}
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
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <LineChart className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMeasurements}</div>
                <p className="text-xs text-muted-foreground">Measurements completed</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Consistency is key</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Table */}
          <Card className="glass border-none shadow-card animate-fade-up-delay-2">
            <CardHeader className="pb-3">
              <CardTitle>Recent Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground animate-pulse">Retrieving your journey...</p>
                </div>
              ) : history && history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="w-[180px]">Date & Time</TableHead>
                      <TableHead>Stress Score</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Key Answer</TableHead>
                      <TableHead className="text-right">Action</TableHead>
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
                            {item.answers.occupation || "N/A"} • Sleep:{" "}
                            {item.answers.sleep_duration || "N/A"}h
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to="/result" search={{ id: item.id }}>
                                View Details <ChevronRight className="ml-1 h-3 w-3" />
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
                                  <AlertDialogTitle>Delete check-in record?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently remove this stress measurement from your
                                    history. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    variant="outline"
                                    size="default"
                                    className="border-border hover:bg-accent/5"
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    variant="destructive"
                                    size="default"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    Delete
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
                  <h3 className="text-lg font-semibold">No measurements yet</h3>
                  <p className="text-muted-foreground max-w-xs mb-6">
                    Start your first stress analysis to see your history here.
                  </p>
                  <Button asChild variant="hero">
                    <Link to="/measurement">Get Started</Link>
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
