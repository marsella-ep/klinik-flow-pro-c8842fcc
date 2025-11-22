import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus, Search, Printer } from "lucide-react";
import { toast } from "sonner";
import { usePatientFlow, type PatientStatus } from "@/contexts/PatientFlowContext";

const Registration = () => {
  const { patients, addPatient } = usePatientFlow();
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [lastRegistered, setLastRegistered] = useState<{ name: string; queueNumber: number } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    complaint: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient = addPatient({
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      address: formData.address,
      complaint: formData.complaint,
    });

    setLastRegistered({ name: newPatient.name, queueNumber: newPatient.queueNumber });
    setShowQueueModal(true);
    toast.success(`Pendaftaran Berhasil! Pasien masuk ke daftar pemeriksaan.`);
    
    setFormData({ name: "", age: "", gender: "", address: "", complaint: "" });
  };

  const statusColors: Record<PatientStatus, string> = {
    "Menunggu Pemeriksaan": "bg-warning/10 text-warning",
    "Menunggu Obat di Apotek": "bg-primary/10 text-primary",
    "Siap Pembayaran": "bg-accent/10 text-accent",
    "Selesai": "bg-success/10 text-success",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pendaftaran Pasien</h1>
          <p className="text-muted-foreground">Daftarkan pasien baru untuk pemeriksaan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Form Pendaftaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama pasien"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Umur</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Masukkan umur"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complaint">Keluhan</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Deskripsikan keluhan pasien"
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftar Pasien
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle>Daftar Pasien Hari Ini</CardTitle>
              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Cari pasien..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Antrian</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Keluhan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.queueNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.age} tahun, {patient.gender}</p>
                        </div>
                      </TableCell>
                      <TableCell>{patient.complaint}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[patient.status]}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setLastRegistered({ name: patient.name, queueNumber: patient.queueNumber });
                          setShowQueueModal(true);
                        }}>
                          <Printer className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showQueueModal} onOpenChange={setShowQueueModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pendaftaran Berhasil</DialogTitle>
            </DialogHeader>
            {lastRegistered && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Nomor Antrian</p>
                  <p className="text-6xl font-bold text-primary">{lastRegistered.queueNumber}</p>
                  <p className="text-lg font-medium mt-4">{lastRegistered.name}</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Pasien telah masuk ke daftar pemeriksaan dokter
                </p>
                <Button onClick={() => setShowQueueModal(false)} className="w-full">
                  Tutup
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Registration;
