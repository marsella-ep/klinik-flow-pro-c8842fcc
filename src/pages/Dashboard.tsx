import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Users, Pill, DollarSign, Calendar, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePatientFlow } from "@/contexts/PatientFlowContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { patients } = usePatientFlow();

  const todayPatients = patients.length;
  const completedExaminations = patients.filter(p => 
    p.status === "Menunggu Obat di Apotek" || 
    p.status === "Siap Pembayaran" || 
    p.status === "Selesai"
  ).length;
  const totalRevenue = patients
    .filter(p => p.status === "Selesai")
    .reduce((sum, p) => sum + (p.totalCharge || 0), 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = [
    {
      title: "Pasien Hari Ini",
      value: todayPatients.toString(),
      icon: Users,
      trend: { value: `${todayPatients} pasien terdaftar`, isPositive: true }
    },
    {
      title: "Resep Hari Ini",
      value: completedExaminations.toString(),
      icon: Pill,
      trend: { value: `${completedExaminations} pemeriksaan selesai`, isPositive: true }
    },
    {
      title: "Pendapatan Hari Ini",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      trend: { value: `Dari ${patients.filter(p => p.status === "Selesai").length} transaksi`, isPositive: true }
    },
    {
      title: "Pasien Menunggu",
      value: patients.filter(p => p.status === "Menunggu Pemeriksaan").length.toString(),
      icon: Activity,
    },
  ];

  // Recent activities from PatientList
  const recentActivities = patients
    .slice()
    .reverse()
    .slice(0, 5)
    .map(patient => {
      let action = "";
      let status: "success" | "warning" | "info" = "info";
      
      if (patient.status === "Selesai") {
        action = "Pembayaran lunas";
        status = "success";
      } else if (patient.status === "Siap Pembayaran") {
        action = "Menunggu pembayaran";
        status = "warning";
      } else if (patient.status === "Menunggu Obat di Apotek") {
        action = "Menunggu obat";
        status = "warning";
      } else {
        action = "Terdaftar";
        status = "info";
      }
      
      return {
        time: patient.registrationTime || "-",
        patient: patient.name,
        action,
        status
      };
    });

  const statusColors = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-primary/10 text-primary",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang, <span className="font-medium text-foreground">{user?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada aktivitas hari ini
                  </p>
                ) : (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-base">
                      <div className="text-sm font-medium text-muted-foreground w-16">
                        {activity.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.patient}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[activity.status]}`}>
                        {activity.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Statistik Mingguan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pasien Terdaftar</span>
                    <span className="font-medium">{todayPatients}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: todayPatients > 0 ? "100%" : "0%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pemeriksaan Selesai</span>
                    <span className="font-medium">{completedExaminations} / {todayPatients}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success rounded-full" 
                      style={{ width: todayPatients > 0 ? `${(completedExaminations / todayPatients) * 100}%` : "0%" }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pembayaran Lunas</span>
                    <span className="font-medium">
                      {patients.filter(p => p.status === "Selesai").length} / {completedExaminations}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-warning rounded-full" 
                      style={{ 
                        width: completedExaminations > 0 
                          ? `${(patients.filter(p => p.status === "Selesai").length / completedExaminations) * 100}%` 
                          : "0%" 
                      }} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
