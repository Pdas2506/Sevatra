/**
 * Doctor-focused Service Layer
 * Patient management, vitals, schedule, clinical notes, profile.
 */

import {
  INITIAL_PATIENTS,
  INITIAL_SCHEDULE,
  INITIAL_NOTES,
  CURRENT_DOCTOR,
} from '../data/sampleData';
import type { DoctorInfo, ScheduleSlot, ClinicalNote } from '../types/dashboard.types';

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface AdmittedPatient {
  patient_id: number;
  patient_name: string;
  age: number;
  gender: string;
  bed_id: string;
  admission_date: string;
  heart_rate: number | null;
  spo2: number | null;
  resp_rate: number | null;
  temperature: number | null;
  blood_pressure: { systolic: number | null; diastolic: number | null };
  measured_time: string;
  presenting_ailment: string | null;
  medical_history: string | null;
  clinical_notes: string | null;
  lab_results: string | null;
  severity_score: number;
  condition: string;
  doctor: string;
  created_at: string;
  updated_at: string;
}

// ── In-memory stores ─────────────────────────────────────────────────────────

let patients: AdmittedPatient[] = [...INITIAL_PATIENTS];
let schedule: ScheduleSlot[] = [...INITIAL_SCHEDULE];
let notes: ClinicalNote[] = [...INITIAL_NOTES];
let doctorProfile: DoctorInfo = { ...CURRENT_DOCTOR };
let nextNoteId = notes.length + 1;

const delay = (ms = 200) => new Promise<void>(r => setTimeout(r, ms));

// ── Severity helpers ─────────────────────────────────────────────────────────

function deriveSeverity(
  hr?: number, spo2?: number, rr?: number,
  temp?: number, sys?: number, dia?: number,
): number {
  let score = 3;
  if (hr && (hr > 120 || hr < 50)) score += 2;
  if (spo2 && spo2 < 90) score += 3;
  else if (spo2 && spo2 < 94) score += 1;
  if (rr && (rr > 25 || rr < 10)) score += 2;
  if (temp && (temp > 39 || temp < 35)) score += 1;
  if (sys && (sys > 180 || sys < 90)) score += 2;
  if (dia && dia > 110) score += 1;
  return Math.min(score, 10);
}

function deriveCondition(score: number): string {
  if (score >= 8) return 'Critical';
  if (score >= 5) return 'Serious';
  if (score >= 3) return 'Stable';
  return 'Recovering';
}

// ── Patient services ─────────────────────────────────────────────────────────

/** Return ALL patients assigned to the logged-in doctor. */
export const getDoctorPatients = async (): Promise<AdmittedPatient[]> => {
  await delay();
  return patients.filter(p => p.doctor === doctorProfile.full_name);
};

/** Alias kept for backward-compat usage. Returns all doctor's patients. */
export const getAllAdmissions = async (_params?: {
  condition?: string;
  minSeverity?: number;
  maxSeverity?: number;
  limit?: number;
  offset?: number;
}): Promise<{ success: boolean; message: string; data: AdmittedPatient[] }> => {
  await delay();
  let filtered = patients.filter(p => p.doctor === doctorProfile.full_name);
  if (_params?.condition) filtered = filtered.filter(p => p.condition.toLowerCase() === _params.condition!.toLowerCase());
  if (_params?.minSeverity) filtered = filtered.filter(p => p.severity_score >= _params.minSeverity!);
  if (_params?.maxSeverity) filtered = filtered.filter(p => p.severity_score <= _params.maxSeverity!);
  return { success: true, message: 'OK', data: filtered };
};

/** Get a single patient by ID. */
export const getPatientById = async (patientId: number): Promise<AdmittedPatient> => {
  await delay();
  const p = patients.find(pt => pt.patient_id === patientId);
  if (!p) throw new Error('Patient not found');
  return p;
};

/** Update vital signs — also recalculates severity. */
export const updatePatientVitals = async (
  patientId: number,
  vitals: {
    heartRate?: number; spo2?: number; respRate?: number;
    temperature?: number; bpSystolic?: number; bpDiastolic?: number;
  },
): Promise<AdmittedPatient> => {
  await delay();
  const idx = patients.findIndex(p => p.patient_id === patientId);
  if (idx === -1) throw new Error('Patient not found');
  const p = { ...patients[idx] };
  if (vitals.heartRate !== undefined) p.heart_rate = vitals.heartRate;
  if (vitals.spo2 !== undefined) p.spo2 = vitals.spo2;
  if (vitals.respRate !== undefined) p.resp_rate = vitals.respRate;
  if (vitals.temperature !== undefined) p.temperature = vitals.temperature;
  if (vitals.bpSystolic !== undefined) p.blood_pressure = { ...p.blood_pressure, systolic: vitals.bpSystolic };
  if (vitals.bpDiastolic !== undefined) p.blood_pressure = { ...p.blood_pressure, diastolic: vitals.bpDiastolic };
  p.severity_score = deriveSeverity(
    p.heart_rate ?? undefined, p.spo2 ?? undefined, p.resp_rate ?? undefined,
    p.temperature ?? undefined, p.blood_pressure.systolic ?? undefined, p.blood_pressure.diastolic ?? undefined,
  );
  p.condition = deriveCondition(p.severity_score);
  p.measured_time = new Date().toISOString();
  p.updated_at = new Date().toISOString();
  patients[idx] = p;
  return p;
};

/** Update clinical info (notes, lab results, misc fields). */
export const updatePatientClinicalInfo = async (
  patientId: number,
  data: Partial<AdmittedPatient>,
): Promise<AdmittedPatient> => {
  await delay(300);
  const idx = patients.findIndex(p => p.patient_id === patientId);
  if (idx === -1) throw new Error('Patient not found');
  patients[idx] = { ...patients[idx], ...data, updated_at: new Date().toISOString() };
  return patients[idx];
};

// ── Schedule services ────────────────────────────────────────────────────────

/** Get today's schedule. */
export const getSchedule = async (): Promise<ScheduleSlot[]> => {
  await delay();
  return [...schedule];
};

/** Update a schedule slot status. */
export const updateScheduleStatus = async (
  slotId: number,
  status: ScheduleSlot['status'],
): Promise<ScheduleSlot> => {
  await delay();
  const idx = schedule.findIndex(s => s.id === slotId);
  if (idx === -1) throw new Error('Slot not found');
  schedule[idx] = { ...schedule[idx], status };
  return schedule[idx];
};

// ── Clinical notes services ──────────────────────────────────────────────────

/** Get all clinical notes written by this doctor. */
export const getClinicalNotes = async (): Promise<ClinicalNote[]> => {
  await delay();
  return [...notes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

/** Add a new clinical note. */
export const addClinicalNote = async (
  note: Omit<ClinicalNote, 'id' | 'created_at'>,
): Promise<ClinicalNote> => {
  await delay(300);
  const newNote: ClinicalNote = {
    ...note,
    id: nextNoteId++,
    created_at: new Date().toISOString(),
  };
  notes.unshift(newNote);
  return newNote;
};

// ── Doctor profile services ──────────────────────────────────────────────────

/** Get the logged-in doctor's profile. */
export const getDoctorProfile = async (): Promise<DoctorInfo> => {
  await delay();
  return { ...doctorProfile };
};

/** Update the doctor's profile. */
export const updateDoctorProfile = async (
  data: Partial<DoctorInfo>,
): Promise<DoctorInfo> => {
  await delay(300);
  doctorProfile = { ...doctorProfile, ...data };
  return { ...doctorProfile };
};
