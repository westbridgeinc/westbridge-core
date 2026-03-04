/**
 * Westbridge ERP — 38 modules and plan definitions.
 * Matches product spec: per-user pricing, included modules per plan, add-on pricing.
 */

export type PlanId = "starter" | "professional" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  pricePerUserPerMonth: number;
  maxUsers: number;
  storageGB: number;
  includedModuleIds: string[];
  features: string[];
}

export interface Module {
  id: string;
  name: string;
  category: string;
  /** Add-on price (Starter/Professional only). Enterprise includes all. */
  addOnPricePerMonth: number;
  /** ERPNext doctype(s) for API calls */
  erpnextDoctype: string;
  description: string;
}

const MODULE_LIST: Module[] = [
  // FINANCE & ACCOUNTING
  { id: "general-ledger", name: "General Ledger", category: "Finance & Accounting", addOnPricePerMonth: 12, erpnextDoctype: "GL Entry", description: "Chart of accounts, journal entries, trial balance." },
  { id: "accounts-payable", name: "Accounts Payable", category: "Finance & Accounting", addOnPricePerMonth: 10, erpnextDoctype: "Purchase Invoice", description: "Vendor bills and payment tracking." },
  { id: "accounts-receivable", name: "Accounts Receivable", category: "Finance & Accounting", addOnPricePerMonth: 10, erpnextDoctype: "Sales Invoice", description: "Customer invoices and collections." },
  { id: "fixed-assets", name: "Fixed Assets", category: "Finance & Accounting", addOnPricePerMonth: 8, erpnextDoctype: "Asset", description: "Asset register and depreciation." },
  { id: "bank-reconciliation", name: "Bank Reconciliation", category: "Finance & Accounting", addOnPricePerMonth: 8, erpnextDoctype: "Bank Reconciliation", description: "Match bank statements to ledger." },
  { id: "budgeting-forecasting", name: "Budgeting & Forecasting", category: "Finance & Accounting", addOnPricePerMonth: 15, erpnextDoctype: "Budget", description: "Budgets and financial planning." },
  { id: "multi-currency", name: "Multi-Currency", category: "Finance & Accounting", addOnPricePerMonth: 10, erpnextDoctype: "Currency Exchange", description: "USD and multi-currency support." },
  { id: "tax-management", name: "Tax Management", category: "Finance & Accounting", addOnPricePerMonth: 8, erpnextDoctype: "Sales Taxes and Charges Template", description: "Sales tax, withholding, configurable tax rules." },
  { id: "financial-reporting", name: "Financial Reporting", category: "Finance & Accounting", addOnPricePerMonth: 12, erpnextDoctype: "Report", description: "P&L, balance sheet, cash flow." },
  // SALES & CRM
  { id: "lead-management", name: "Lead Management", category: "Sales & CRM", addOnPricePerMonth: 10, erpnextDoctype: "Lead", description: "Capture and qualify leads." },
  { id: "opportunity-tracking", name: "Opportunity Tracking", category: "Sales & CRM", addOnPricePerMonth: 12, erpnextDoctype: "Opportunity", description: "Deal pipeline and stages." },
  { id: "quotation-builder", name: "Quotation Builder", category: "Sales & CRM", addOnPricePerMonth: 10, erpnextDoctype: "Quotation", description: "Create and send quotes." },
  { id: "sales-orders", name: "Sales Orders", category: "Sales & CRM", addOnPricePerMonth: 10, erpnextDoctype: "Sales Order", description: "Orders and fulfillment." },
  { id: "customer-portal", name: "Customer Portal", category: "Sales & CRM", addOnPricePerMonth: 8, erpnextDoctype: "Portal Settings", description: "Self-service portal for customers." },
  { id: "territory-management", name: "Territory Management", category: "Sales & CRM", addOnPricePerMonth: 8, erpnextDoctype: "Territory", description: "Sales territories and hierarchy." },
  // INVENTORY & SUPPLY CHAIN
  { id: "stock-management", name: "Stock Management", category: "Inventory & Supply Chain", addOnPricePerMonth: 12, erpnextDoctype: "Stock Entry", description: "Stock levels and movements." },
  { id: "warehouse-management", name: "Warehouse Management", category: "Inventory & Supply Chain", addOnPricePerMonth: 10, erpnextDoctype: "Warehouse", description: "Multi-warehouse and locations." },
  { id: "purchase-orders", name: "Purchase Orders", category: "Inventory & Supply Chain", addOnPricePerMonth: 10, erpnextDoctype: "Purchase Order", description: "POs and supplier orders." },
  { id: "supplier-management", name: "Supplier Management", category: "Inventory & Supply Chain", addOnPricePerMonth: 8, erpnextDoctype: "Supplier", description: "Supplier master and performance." },
  { id: "bill-of-materials", name: "Bill of Materials", category: "Inventory & Supply Chain", addOnPricePerMonth: 12, erpnextDoctype: "BOM", description: "BOMs and product structures." },
  { id: "quality-inspection", name: "Quality Inspection", category: "Inventory & Supply Chain", addOnPricePerMonth: 10, erpnextDoctype: "Quality Inspection", description: "Incoming and in-process inspection." },
  { id: "batch-serial-tracking", name: "Batch & Serial Tracking", category: "Inventory & Supply Chain", addOnPricePerMonth: 10, erpnextDoctype: "Batch", description: "Batch and serial number tracking." },
  // HR & PAYROLL
  { id: "employee-management", name: "Employee Management", category: "HR & Payroll", addOnPricePerMonth: 10, erpnextDoctype: "Employee", description: "Employee records and org chart." },
  { id: "attendance-leave", name: "Attendance & Leave", category: "HR & Payroll", addOnPricePerMonth: 8, erpnextDoctype: "Leave Application", description: "Leave, attendance, timesheets." },
  { id: "payroll-processing", name: "Payroll Processing", category: "HR & Payroll", addOnPricePerMonth: 15, erpnextDoctype: "Salary Slip", description: "Tax, deductions, salary slips." },
  { id: "expense-claims", name: "Expense Claims", category: "HR & Payroll", addOnPricePerMonth: 8, erpnextDoctype: "Expense Claim", description: "Expense claims and approvals." },
  { id: "recruitment", name: "Recruitment", category: "HR & Payroll", addOnPricePerMonth: 10, erpnextDoctype: "Job Applicant", description: "Applicants and hiring pipeline." },
  { id: "training-development", name: "Training & Development", category: "HR & Payroll", addOnPricePerMonth: 10, erpnextDoctype: "Training Event", description: "Training and certifications." },
  { id: "performance-reviews", name: "Performance Reviews", category: "HR & Payroll", addOnPricePerMonth: 12, erpnextDoctype: "Appraisal", description: "Goals and performance reviews." },
  // MANUFACTURING
  { id: "production-planning", name: "Production Planning", category: "Manufacturing", addOnPricePerMonth: 15, erpnextDoctype: "Work Order", description: "Production plans and scheduling." },
  { id: "work-orders", name: "Work Orders", category: "Manufacturing", addOnPricePerMonth: 12, erpnextDoctype: "Work Order", description: "Work orders and execution." },
  { id: "routing-operations", name: "Routing & Operations", category: "Manufacturing", addOnPricePerMonth: 12, erpnextDoctype: "BOM", description: "Routings and operations." },
  { id: "subcontracting", name: "Subcontracting", category: "Manufacturing", addOnPricePerMonth: 10, erpnextDoctype: "Subcontracting Order", description: "Outsourced operations." },
  { id: "capacity-planning", name: "Capacity Planning", category: "Manufacturing", addOnPricePerMonth: 12, erpnextDoctype: "Workstation", description: "Capacity and load." },
  // PROJECT MANAGEMENT
  { id: "project-tracking", name: "Project Tracking", category: "Project Management", addOnPricePerMonth: 12, erpnextDoctype: "Project", description: "Projects and milestones." },
  { id: "task-management", name: "Task Management", category: "Project Management", addOnPricePerMonth: 10, erpnextDoctype: "Task", description: "Tasks and dependencies." },
  { id: "timesheets", name: "Timesheets", category: "Project Management", addOnPricePerMonth: 8, erpnextDoctype: "Timesheet", description: "Time logging and billing." },
  { id: "gantt-charts", name: "Gantt Charts", category: "Project Management", addOnPricePerMonth: 8, erpnextDoctype: "Project", description: "Visual timeline and Gantt." },
  // OTHER
  { id: "website-builder", name: "Website Builder", category: "Other", addOnPricePerMonth: 15, erpnextDoctype: "Web Page", description: "Build and host your site." },
  { id: "e-commerce", name: "E-Commerce", category: "Other", addOnPricePerMonth: 15, erpnextDoctype: "Website Item", description: "Online store and catalog." },
  { id: "point-of-sale", name: "Point of Sale", category: "Other", addOnPricePerMonth: 12, erpnextDoctype: "POS Invoice", description: "POS for retail and counters." },
  { id: "custom-reports", name: "Custom Reports", category: "Other", addOnPricePerMonth: 10, erpnextDoctype: "Report", description: "Custom queries and reports." },
];

const STARTER_INCLUDED = [
  "general-ledger", "accounts-receivable", "accounts-payable", "sales-orders",
  "stock-management", "employee-management",
];
const PROFESSIONAL_ADDITIONAL = [
  "lead-management", "opportunity-tracking", "quotation-builder", "customer-portal", "territory-management",
  "warehouse-management", "purchase-orders", "supplier-management", "bill-of-materials", "quality-inspection", "batch-serial-tracking",
  "attendance-leave", "payroll-processing", "expense-claims", "recruitment", "training-development", "performance-reviews",
  "financial-reporting", "fixed-assets", "bank-reconciliation", "budgeting-forecasting", "multi-currency", "tax-management",
];

export const MODULES: Module[] = MODULE_LIST;
export const MODULE_IDS: string[] = MODULE_LIST.map((m) => m.id);
export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    pricePerUserPerMonth: 29,
    maxUsers: 5,
    storageGB: 10,
    includedModuleIds: STARTER_INCLUDED,
    features: ["Up to 5 users", "10 GB storage", "Email support", "Core finance & sales"],
  },
  {
    id: "professional",
    name: "Growth",
    pricePerUserPerMonth: 59,
    maxUsers: 25,
    storageGB: 50,
    includedModuleIds: [...STARTER_INCLUDED, ...PROFESSIONAL_ADDITIONAL],
    features: ["Up to 25 users", "50 GB storage", "Priority support", "Full CRM, HR, inventory, manufacturing"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    pricePerUserPerMonth: 99,
    maxUsers: -1,
    storageGB: -1,
    includedModuleIds: MODULE_IDS,
    features: ["Unlimited users", "Unlimited storage", "Dedicated account manager", "Custom integrations", "SLA guarantee"],
  },
];

export const CATEGORIES = [
  "Finance & Accounting",
  "Sales & CRM",
  "Inventory & Supply Chain",
  "HR & Payroll",
  "Manufacturing",
  "Project Management",
  "Other",
] as const;

export function getPlan(id: PlanId): Plan {
  const p = PLANS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown plan: ${id}`);
  return p;
}

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

export function isModuleIncludedInPlan(moduleId: string, planId: PlanId): boolean {
  const plan = getPlan(planId);
  return plan.includedModuleIds.includes(moduleId);
}

export function getAddOnPrice(moduleId: string, planId: PlanId): number | null {
  if (planId === "enterprise") return null;
  if (isModuleIncludedInPlan(moduleId, planId)) return null;
  const m = getModule(moduleId);
  return m ? m.addOnPricePerMonth : null;
}

/** For comparison matrix: rows by category then module */
export const MODULE_ROWS = MODULES.map((m) => ({
  category: m.category,
  module: m.name,
  moduleId: m.id,
  addOnPrice: m.addOnPricePerMonth,
}));
