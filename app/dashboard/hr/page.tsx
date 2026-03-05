"use client";

import { useState, useEffect, useMemo } from "react";
import { UserCog } from "lucide-react";
import { MODULE_EMPTY_STATES, EMPTY_STATE_SUPPORT_LINE } from "@/lib/dashboard/empty-state-config";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/locale/date";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  status: "Active" | "Inactive";
  dateJoined: string; // ISO date
}

interface HRStats {
  total: number;
  active: number;
  inactive: number;
}

/* ------------------------------------------------------------------ */
/*  Demo data (swap for API call in production)                        */
/* ------------------------------------------------------------------ */

const DEMO_EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Priya Ramdeen", designation: "Accountant", department: "Finance", status: "Active", dateJoined: "2024-01-15" },
  { id: "EMP-002", name: "Devendra Singh", designation: "Operations Manager", department: "Operations", status: "Active", dateJoined: "2024-03-04" },
  { id: "EMP-003", name: "Shantelle Williams", designation: "HR Manager", department: "HR", status: "Active", dateJoined: "2024-05-20" },
  { id: "EMP-004", name: "Rajiv Persaud", designation: "Sales Lead", department: "Sales", status: "Active", dateJoined: "2024-06-10" },
  { id: "EMP-005", name: "Camille Thomas", designation: "Payroll Officer", department: "Finance", status: "Active", dateJoined: "2024-08-01" },
  { id: "EMP-006", name: "Akash Doobay", designation: "Systems Admin", department: "IT", status: "Active", dateJoined: "2024-09-12" },
  { id: "EMP-007", name: "Natasha Charles", designation: "Account Executive", department: "Sales", status: "Inactive", dateJoined: "2024-10-03" },
  { id: "EMP-008", name: "Marcus Fernandes", designation: "Warehouse Supervisor", department: "Operations", status: "Active", dateJoined: "2024-11-18" },
];

function deriveStats(employees: Employee[]): HRStats {
  const active = employees.filter((e) => e.status === "Active").length;
  return { total: employees.length, active, inactive: employees.length - active };
}

/* ------------------------------------------------------------------ */
/*  Columns                                                            */
/* ------------------------------------------------------------------ */

const columns: Column<Employee>[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => (
      <span className="font-medium" style={{ color: "var(--color-ink)" }}>
        {row.name}
      </span>
    ),
    sortValue: (row) => row.name,
  },
  {
    id: "designation",
    header: "Designation",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{row.designation}</span>
    ),
    sortValue: (row) => row.designation,
  },
  {
    id: "department",
    header: "Department",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-secondary)" }}>{row.department}</span>
    ),
    sortValue: (row) => row.department,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => <Badge status={row.status}>{row.status}</Badge>,
    sortValue: (row) => row.status,
  },
  {
    id: "dateJoined",
    header: "Date Joined",
    accessor: (row) => (
      <span style={{ color: "var(--color-ink-tertiary)" }}>{formatDate(row.dateJoined)}</span>
    ),
    sortValue: (row) => row.dateJoined,
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = () => {
    setLoading(true);
    setError(null);

    // Simulate async fetch -- replace with real API call
    const timer = setTimeout(() => {
      try {
        setEmployees(DEMO_EMPLOYEES);
      } catch {
        setError("Failed to load employee directory.");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const cleanup = fetchEmployees();
    return cleanup;
  }, []);

  const stats = useMemo(() => deriveStats(employees), [employees]);

  /* ---- Error state ---- */
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="HR" description="Employee directory and management" />
        <div
          className="flex flex-col items-center gap-4 rounded-[var(--radius-md)] border px-6 py-16 text-center"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-ground-elevated)",
          }}
        >
          <p className="text-body" style={{ color: "var(--color-ink-secondary)" }}>
            {error}
          </p>
          <Button variant="secondary" size="sm" onClick={fetchEmployees}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="HR" description="Employee directory and management" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="card animate-pulse"
              style={{ minHeight: 88 }}
            />
          ))}
        </div>
        <SkeletonTable rows={8} columns={5} />
      </div>
    );
  }

  /* ---- Success / Empty states ---- */
  return (
    <div className="space-y-6">
      <PageHeader title="HR" description="Employee directory and management" />

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Total Employees" value={stats.total} />
        <MetricCard label="Active" value={stats.active} subtextVariant="success" />
        <MetricCard label="Inactive" value={stats.inactive} subtextVariant="muted" />
      </div>

      {/* Data table */}
      <DataTable<Employee>
        columns={columns}
        data={employees}
        keyExtractor={(r) => r.id}
        loading={false}
        emptyState={
          <EmptyState
            icon={<UserCog className="h-6 w-6" />}
            title={MODULE_EMPTY_STATES.hr.title}
            description={MODULE_EMPTY_STATES.hr.description}
            actionLabel={MODULE_EMPTY_STATES.hr.actionLabel}
            actionHref={MODULE_EMPTY_STATES.hr.actionLink}
            supportLine={EMPTY_STATE_SUPPORT_LINE}
          />
        }
        pageSize={20}
      />
    </div>
  );
}
