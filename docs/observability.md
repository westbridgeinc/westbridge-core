# Observability

This document describes how SLOs, tracing, health checks, and alerting fit together.

## SLOs (Service Level Objectives)

Defined in **`lib/slo.ts`**:

| SLO | Target | Window |
|-----|--------|--------|
| API Availability | 99.95% | 30 days |
| Auth Latency p99 | &lt; 500ms | 30 days |
| ERP Proxy Latency p99 | &lt; 2000ms | 30 days |
| Dashboard Load p95 | &lt; 1500ms | 30 days |

- **Error budget**: `remainingErrorBudget(slo, totalRequests, errorRequests)` and `formatErrorBudget()` are available for dashboards.
- To consume SLOs in production you need to feed **totalRequests** and **errorRequests** (and latencies) from your metrics store (e.g. Prometheus, Datadog) into these helpers.

## Distributed tracing

- **OpenTelemetry** is initialised in **`lib/telemetry.ts`** when `OTEL_EXPORTER_OTLP_ENDPOINT` is set.
- **`initTelemetry()`** should be called once at process start (e.g. in `instrumentation.ts`).
- **`withSpan(name, fn)`** wraps async work in a span; **`extractTraceId(request)`** and **`getCurrentTraceContext()`** are used by the API pipeline to propagate trace IDs.
- Set **`OTEL_SERVICE_NAME`** (default: `westbridge`) and **`OTEL_EXPORTER_OTLP_ENDPOINT`** (e.g. Jaeger or your vendor) in production to get traces.

## Health checks

- **`GET /api/health`** — Full health: DB, Redis, ERPNext, memory, disk. Returns `healthy` / `degraded` / `unhealthy` and 200 or 503.
- **`GET /api/health/live`** — Liveness (process up).
- **`GET /api/health/ready`** — Readiness (e.g. for k8s); use when the app can serve traffic.

The health response includes **`slo_definitions`** (name and target for each SLO) so operators can align alerting with the same targets.

## Alerting

1. **Availability**: Alert when error budget for `api_availability` drops below a threshold (e.g. 10% remaining). Use the same 30-day window as the SLO.
2. **Latency**: Alert when p99 for `/api/auth/*` or `/api/erp/*` exceeds the SLO target (500ms / 2000ms) over a short window (e.g. 5m).
3. **Health**: Alert when **`GET /api/health`** returns 503 or when **`status`** is `unhealthy`.

Runbooks: **`docs/runbooks/incident-response.md`**, **`docs/runbooks/rollback.md`**.
