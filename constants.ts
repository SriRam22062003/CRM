
import { Contact, Deal, DealStage, Product, Task, Invoice, InvoiceStatus, ProjectStage } from './types';

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'John Smith', company: 'TechCorp HQ', role: 'IT Director', email: 'john@techcorp.com', phone: '555-0101', address: '123 Tech Blvd, San Francisco, CA', linkedin: 'https://linkedin.com', remarks: 'Key decision maker for Q3 budget.' },
  { id: 'c2', name: 'Sarah Connor', company: 'Cyberdyne Systems', role: 'Facilities Manager', email: 'sarah@cyberdyne.com', phone: '555-0102', address: '800 Innovation Dr, Palo Alto, CA' },
  { id: 'c3', name: 'Bruce Wayne', company: 'Wayne Enterprises', role: 'CEO', email: 'bruce@wayne.com', phone: '555-0103', address: '1007 Mountain Dr, Gotham' },
  { id: 'c4', name: 'Diana Prince', company: 'Themyscira Museum', role: 'Curator', email: 'diana@museum.org', phone: '555-0104', address: '500 History Ln, Washington DC' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Sony 85" Pro Bravia', category: 'Display', price: 3500, tpPrice: 2800 },
  { id: 'p2', name: 'Samsung The Wall (Module)', category: 'Display', price: 12000, tpPrice: 9500 },
  { id: 'p3', name: 'Crestron NVX Endpoint', category: 'Infrastructure', price: 1200, tpPrice: 850 },
  { id: 'p4', name: 'Q-SYS Core 110f', category: 'Audio', price: 2800, tpPrice: 2100 },
  { id: 'p5', name: 'Shure MXA920 Ceiling Mic', category: 'Audio', price: 4500, tpPrice: 3200 },
  { id: 'p6', name: 'Logitech Rally Bar', category: 'Display', price: 3999, tpPrice: 3100 },
  { id: 'p7', name: 'Installation Labor (Day)', category: 'Labor', price: 1200, tpPrice: 600 },
  { id: 'p8', name: 'Programming Services', category: 'Labor', price: 1500, tpPrice: 800 },
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'TechCorp Boardroom Upgrade',
    contactId: 'c1',
    stage: DealStage.PROPOSAL_SENT,
    value: 28500,
    products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[3], MOCK_PRODUCTS[4], MOCK_PRODUCTS[7]],
    notes: 'Client wants a clean table look, no visible wires. Ceiling mic is a must.',
    lastActivity: '2023-10-25'
  },
  {
    id: 'd2',
    title: 'Cyberdyne Lobby Video Wall',
    contactId: 'c2',
    stage: DealStage.SITE_SURVEY,
    value: 85000,
    products: [MOCK_PRODUCTS[1], MOCK_PRODUCTS[1], MOCK_PRODUCTS[1], MOCK_PRODUCTS[1], MOCK_PRODUCTS[2]],
    notes: 'High ambient light environment. Need verify structural backing for wall.',
    lastActivity: '2023-10-26'
  },
  {
    id: 'd3',
    title: 'Wayne Manor Cinema',
    contactId: 'c3',
    stage: DealStage.CLOSED_WON,
    value: 150000,
    products: [MOCK_PRODUCTS[1], MOCK_PRODUCTS[3], MOCK_PRODUCTS[4]],
    notes: 'Client is very particular about audio quality. Needs dolby atmos config.',
    lastActivity: '2023-10-27',
    projectStage: ProjectStage.INSTALLATION
  },
  {
    id: 'd4',
    title: 'Museum Interactive Kiosks',
    contactId: 'c4',
    stage: DealStage.LEAD_IN,
    value: 12000,
    products: [MOCK_PRODUCTS[5]],
    notes: 'Initial inquiry received via website.',
    lastActivity: '2023-10-28'
  },
  {
    id: 'd5',
    title: 'HQ Townhall Audio',
    contactId: 'c1',
    stage: DealStage.CLOSED_WON,
    value: 45000,
    products: [MOCK_PRODUCTS[4], MOCK_PRODUCTS[4], MOCK_PRODUCTS[3]],
    notes: 'Townhall space for 200 people.',
    lastActivity: '2023-09-15',
    projectStage: ProjectStage.PROGRAMMING
  }
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Site Visit: Cyberdyne', dueDate: '2023-11-02', priority: 'High', status: 'Pending', type: 'Meeting', relatedDealId: 'd2', source: 'CRM' },
  { id: 't2', title: 'Follow up on TechCorp Proposal', dueDate: '2023-11-01', priority: 'Medium', status: 'Pending', type: 'Email', relatedDealId: 'd1', source: 'CRM' },
  { id: 't3', title: 'Prepare Kiosk Demo', dueDate: '2023-11-05', priority: 'Low', status: 'Pending', type: 'ToDo', relatedDealId: 'd4', source: 'CRM' },
  { id: 't4', title: 'Wayne Manor Final Sign-off', dueDate: '2023-11-10', priority: 'High', status: 'Pending', type: 'Meeting', relatedDealId: 'd3', source: 'CRM' },
];

export const MOCK_OUTLOOK_EVENTS: Task[] = [
  { id: 'o1', title: 'Weekly Sales Review', dueDate: '2023-11-01', startTime: '09:00', priority: 'Medium', status: 'Pending', type: 'Meeting', source: 'Outlook', location: 'Teams' },
  { id: 'o2', title: 'Client Lunch: Bruce Wayne', dueDate: '2023-11-03', startTime: '12:30', priority: 'High', status: 'Pending', type: 'Meeting', source: 'Outlook', location: 'Gotham Steakhouse' },
  { id: 'o3', title: 'Project Handover - Townhall', dueDate: '2023-11-04', startTime: '14:00', priority: 'High', status: 'Pending', type: 'Meeting', source: 'Outlook', location: 'TechCorp HQ' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', number: 'INV-2023-001', dealId: 'd3', amount: 75000, dueDate: '2023-10-15', status: InvoiceStatus.PAID, date: '2023-09-15', clientName: 'Wayne Enterprises', poNumber: 'PO-WAYNE-001', remarks: '50% Deposit' },
  { id: 'inv2', number: 'INV-2023-002', dealId: 'd3', amount: 75000, dueDate: '2023-11-15', status: InvoiceStatus.SENT, date: '2023-10-15', clientName: 'Wayne Enterprises', poNumber: 'PO-WAYNE-001', remarks: 'Completion payment' },
  { id: 'inv3', number: 'INV-2023-003', dealId: 'd5', amount: 22500, dueDate: '2023-10-30', status: InvoiceStatus.OVERDUE, date: '2023-09-30', clientName: 'TechCorp HQ', poNumber: 'TC-998877', remarks: 'Audio equipment' },
];
