# Phase 4 — Commercial Platform Foundation

Phase 4 prepares Dobrofsky Risk Analyzer for a paid product without weakening the auditability of the research engine.

## Product architecture

The commercial layer must remain separate from the deterministic financial-risk engine.

```
Financial Data
  -> Validation & Normalization
  -> Versioned Dobrofsky Engine
  -> Benchmark / Backtesting Layer
  -> AI Analyst
  -> Entitlements
  -> Professional / Consulting / Enterprise experiences
```

AI may explain model outputs, map user instructions to structured scenarios, and draft research reports. It must not silently change the Dobrofsky score, thresholds, source financial data, or benchmark outputs.

## Commercial editions

### Community
- Open-source core
- Single-company analysis
- Core risk score and decomposition
- Basic charts and stress testing
- Methodology and research documentation

### Professional
- AI Financial Analyst
- Ask Dobrofsky
- Advanced scenario builder
- Report generation
- Saved companies and analysis history
- Expanded benchmark and sector analytics

### Consulting
- Everything required to prepare a professional case
- Human review workflow
- Analyst notes and adjustments with audit trail
- Custom scenarios
- Final consulting report
- Review status and sign-off metadata

Consulting is a service workflow, not an automated claim that an analysis has been reviewed.

### Enterprise
- Multi-company portfolios
- Watchlists and screening
- Team workspaces and role-based access
- Portfolio early warnings
- API entitlements
- Usage controls and audit logs

## Engineering principles

1. Entitlements are feature permissions, not UI-only locks.
2. Payment state must never be trusted from the browser alone.
3. Secrets and AI provider keys remain server-side.
4. Every generated report records model version, data period, scenario assumptions, and generation time.
5. AI-generated narrative is clearly distinguished from deterministic model output.
6. No score is described as a bankruptcy probability unless a validated calibration supports that interpretation for a defined population and horizon.
7. Financial inputs and model outputs require an audit trail before institutional use.
8. Provider-specific billing code should sit behind a billing adapter so the product is not coupled to one payment processor.

## Phase 4 implementation sequence

1. Entitlement model and feature registry.
2. Account/workspace model.
3. Server-side API boundary.
4. AI Analyst interface and structured tool contract.
5. Saved analyses and audit trail.
6. Professional report workflow.
7. Consulting review workflow.
8. Enterprise portfolio/watchlist layer.
9. Billing-provider adapter and webhook verification.
10. Usage metering, security review, and production hardening.

## Dependency on Phase 3

Phase 4 can be scaffolded now, but paid analytical claims should not ship before the Phase 3 data, calibration, backtesting, and validation work is completed.
