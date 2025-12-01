
export enum DealStage {
  LEAD_IN = 'Lead In',
  SITE_SURVEY = 'Site Survey',
  PROPOSAL_SENT = 'Proposal Sent',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export enum ProjectStage {
  TP_CLEARED = 'TP Cleared',
  MATERIAL_PLACED = 'Material Placed',
  DELIVERED = 'Delivered',
  INSTALLATION = 'Installation',
  PROGRAMMING = 'Programming',
  HANDOVER = 'Handover'
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  OVERDUE = 'Overdue',
  PAID = 'Paid'
}

export interface Product {
  id: string;
  name: string;
  category: 'Display' | 'Audio' | 'Control' | 'Infrastructure' | 'Labor';
  price: number; // Selling/Reference Price
  tpPrice: number; // Transfer Price (Cost)
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role?: string;
  address?: string;
  linkedin?: string;
  remarks?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  relatedDealId?: string;
  type: 'Meeting' | 'Call' | 'Email' | 'ToDo';
  source?: 'CRM' | 'Outlook';
  description?: string;
  location?: string;
  startTime?: string; // For meetings
}

export interface Invoice {
  id: string;
  number: string;
  dealId: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  date: string;
  poNumber?: string;
  clientName?: string;
  remarks?: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  stage: DealStage;
  value: number;
  products: Product[];
  notes: string;
  lastActivity: string;
  projectStage?: ProjectStage; // If Closed Won
  proposalLink?: string;
}

export interface DealStats {
  totalPipeline: number;
  closedWon: number;
  avgDealSize: number;
  conversionRate: number;
}
