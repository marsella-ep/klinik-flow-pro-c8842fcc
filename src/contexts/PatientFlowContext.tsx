import { createContext, useContext, useState, ReactNode } from "react";

export type PatientStatus = 
  | "Menunggu Pemeriksaan" 
  | "Menunggu Obat di Apotek" 
  | "Siap Pembayaran" 
  | "Selesai";

export interface PatientFlow {
  id: string;
  queueNumber: number;
  name: string;
  age: number;
  gender: string;
  address: string;
  complaint: string;
  status: PatientStatus;
  registrationTime: string;
  
  // Examination data
  diagnosis?: string;
  prescription?: string;
  examinationTime?: string;
  
  // Pharmacy data
  medicines?: { name: string; dose: string; quantity: number; notes: string }[];
  pharmacyTime?: string;
  
  // Payment data
  serviceCharge?: number;
  medicineCharge?: number;
  totalCharge?: number;
  paymentMethod?: string;
  paymentTime?: string;
}

interface PatientFlowContextType {
  patients: PatientFlow[];
  addPatient: (patient: Omit<PatientFlow, 'id' | 'queueNumber' | 'status' | 'registrationTime'>) => PatientFlow;
  updatePatientStatus: (id: string, status: PatientStatus, data?: Partial<PatientFlow>) => void;
  getPatientsByStatus: (status: PatientStatus) => PatientFlow[];
  getPatientById: (id: string) => PatientFlow | undefined;
}

const PatientFlowContext = createContext<PatientFlowContextType | undefined>(undefined);

export const PatientFlowProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<PatientFlow[]>([]);
  const [queueCounter, setQueueCounter] = useState(1);

  const addPatient = (patientData: Omit<PatientFlow, 'id' | 'queueNumber' | 'status' | 'registrationTime'>): PatientFlow => {
    const newPatient: PatientFlow = {
      ...patientData,
      id: Date.now().toString(),
      queueNumber: queueCounter,
      status: "Menunggu Pemeriksaan",
      registrationTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setPatients(prev => [...prev, newPatient]);
    setQueueCounter(prev => prev + 1);
    return newPatient;
  };

  const updatePatientStatus = (id: string, status: PatientStatus, data?: Partial<PatientFlow>) => {
    setPatients(prev => prev.map(patient => {
      if (patient.id === id) {
        const updatedPatient = { ...patient, status, ...data };
        
        // Add timestamps based on status
        if (status === "Menunggu Obat di Apotek") {
          updatedPatient.examinationTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else if (status === "Siap Pembayaran") {
          updatedPatient.pharmacyTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else if (status === "Selesai") {
          updatedPatient.paymentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }
        
        return updatedPatient;
      }
      return patient;
    }));
  };

  const getPatientsByStatus = (status: PatientStatus): PatientFlow[] => {
    return patients.filter(patient => patient.status === status);
  };

  const getPatientById = (id: string): PatientFlow | undefined => {
    return patients.find(patient => patient.id === id);
  };

  return (
    <PatientFlowContext.Provider value={{
      patients,
      addPatient,
      updatePatientStatus,
      getPatientsByStatus,
      getPatientById,
    }}>
      {children}
    </PatientFlowContext.Provider>
  );
};

export const usePatientFlow = () => {
  const context = useContext(PatientFlowContext);
  if (!context) {
    throw new Error("usePatientFlow must be used within PatientFlowProvider");
  }
  return context;
};
