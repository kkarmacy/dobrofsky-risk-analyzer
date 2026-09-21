# Dobrofsky Risk Analyzer

**Financial distress · Early-warning signals · Stress testing · Explainable risk analytics**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node](https://img.shields.io/badge/Node-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Research](https://img.shields.io/badge/Status-Research%20%26%20Development-555)](#roadmap)

Dobrofsky Risk Analyzer is a research-oriented financial risk analysis platform designed to separate **data normalization, financial ratios, proprietary scoring logic, explainability, stress testing, historical analysis and benchmarking** into clear analytical layers.

It is intended as a decision-support tool for analysts, finance professionals, credit teams and researchers interested in corporate financial distress and early-warning frameworks.

---

## 🎯 Project Goals

The project is being developed around five principles:

1. **Transparent inputs** — financial statement data should be normalized and validated before scoring.
2. **Explainable outputs** — risk results should show the drivers behind the result, not only a final score.
3. **Scenario awareness** — stress tests and sensitivity analysis should show how risk changes under adverse assumptions.
4. **Historical context** — trend analysis matters as much as a single-period snapshot.
5. **Model validation** — predictive claims should only follow documented backtesting and benchmarking.

---

## 🔍 Core Analytical Areas

| Area | Purpose |
|---|---|
| Financial Statement Normalization | Prepare consistent financial inputs before analysis |
| Financial Ratios | Measure liquidity, leverage, profitability, coverage and efficiency |
| Dobrofsky Scoring Engine | Apply the project's independent scoring methodology |
| Explainability | Identify which variables contribute most to the risk result |
| Historical Risk Analysis | Track changes in financial condition through time |
| Early-Warning Signals | Surface deteriorating indicators before they become critical |
| Stress Testing | Recalculate risk under adverse financial scenarios |
| Sensitivity Analysis | Measure how key assumptions affect outputs |
| Benchmarking | Compare results against established distress models |

---

## 🧱 Architecture

The codebase is intentionally separated into analytical layers so that scoring logic, stress testing and historical analysis can evolve independently.

Key areas include:

- `src/` — application and analytical engine
- `src/engine/` — model and risk logic
- `test/` — automated tests
- `docs/` — supporting documentation
- `index.html` — application entry point

---

## 🛠 Technology

- **React 19**
- **Vite 7**
- **Recharts**
- **Node.js 24+**
- Native Node test runner

---

## 🚀 Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run syntax/model checks:

```bash
npm run check
```

---

## 🗺 Roadmap

- [x] Project architecture and analytical separation
- [ ] Financial statement normalization and validation
- [ ] Independent Dobrofsky scoring engine
- [ ] Risk decomposition and explainability
- [ ] Historical risk evolution and early-warning indicators
- [ ] Stress testing and sensitivity analysis
- [ ] Backtesting and benchmarking against established distress models
- [ ] Expanded web application
- [ ] API layer
- [ ] Documented validation dataset and methodology

---

## 🤝 Contributions & Feedback

Feedback from professionals in **credit risk, corporate finance, financial analysis, banking and model validation** is especially valuable.

If you test the project, suggestions on the following are welcome:

- Model assumptions
- Ratio selection
- Stress scenarios
- Explainability
- Benchmarking methodology
- User experience
- Validation design

Issues and pull requests are welcome.

---

## ⚠️ Important Disclaimer

Dobrofsky Risk Analyzer is a **research and analytical decision-support project**.

Risk outputs are analytical estimates and **do not guarantee default, bankruptcy, solvency, investment performance or future outcomes**. They should not be treated as a substitute for professional credit analysis, audited financial information, investment advice or independent due diligence.

Model validation and documented backtesting are required before predictive claims are made.

---

## 👤 Author

**Christian Dobrofsky**  
Financial Consultant · Corporate Finance · Risk Analytics · AI

GitHub: [@kkarmacy](https://github.com/kkarmacy)
