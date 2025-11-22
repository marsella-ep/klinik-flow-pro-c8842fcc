import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Search } from "lucide-react";
import { usePatientFlow } from "@/contexts/PatientFlowContext";

const PatientData = () => {
  const { patients } = usePatientFlow();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    "Menunggu Pemeriksaan": "bg-warning/10 text-warning",
    "Menunggu Obat di Apotek": "bg-primary/10 text-primary",
    "Siap Pembayaran": "bg-accent/10 text-accent",
    "Selesai": "bg-success/10 text-success",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Pasien</h1>
          <p className="text-muted-foreground">Kelola data dan rekam medis pasien</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Daftar Pasien
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cari nama pasien..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Umur</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {searchTerm ? "Pasien tidak ditemukan" : "Belum ada pasien terdaftar"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age} tahun</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.complaint}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[patient.status as keyof typeof statusColors]}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{patient.registrationTime}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientData;
