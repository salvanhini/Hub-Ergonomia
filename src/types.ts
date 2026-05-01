/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AssessmentCategory {
  OFFICE = 'Escritório',
  INDUSTRY = 'Indústria',
  LOGISTICS = 'Logística',
  HEALTH = 'Saúde'
}

export type MethodologyType = 
  | 'RULA' | 'REBA' | 'ROSAS' 
  | 'NIOSH' | 'CORLETT' 
  | 'MOORE_GARG' | 'COUTO' 
  | 'NORDICO' | 'NASA_TLX' | 'BORG'
  | 'MATRIX';

export interface MethodologyInfo {
  id: MethodologyType;
  name: string;
  category: AssessmentCategory;
  description: string;
}

export interface RulaScore {
  score: number;
  actionLevel: number;
  recommendation: string;
}

export interface RulaInput {
  // Group A: Arm, Forearm, Wrist
  upperArm: number;
  forearm: number;
  wrist: number;
  wristTwist: number;
  
  // Group B: Neck, Trunk, Legs
  neck: number;
  trunk: number;
  legs: number;
  
  // Modifiers
  muscleUse: number; // 0 or 1
  forceLoad: number; // 0, 1, 2, or 3
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  industry: string;
}

export interface InventoryItem {
  id: string;
  sector: string;
  task: string;
  risk: string;
  methodology: string;
  score: string | number;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  date: string;
  status: 'Pendente' | 'Em Ação' | 'Resolvido';
}

export interface Report {
  id: string;
  created_at: string;
  title: string;
  company_name: string;
  cnpj?: string;
  address?: string;
  employee_name?: string;
  sector?: string;
  job_function?: string;
  report_type: 'AET' | 'AEP' | 'LIP' | 'PGR';
  assessment_ids: string[];
  status: 'Draft' | 'Review' | 'Completed';
  content: Record<string, string>;
  conclusion?: string;
  recommendations?: string;
}
