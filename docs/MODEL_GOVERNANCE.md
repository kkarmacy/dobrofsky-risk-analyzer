# Model Governance

## Status
The current Dobrofsky engine is a research scaffold. Version `0.1-research` is explicitly uncalibrated.

## Required before predictive claims
- Freeze and document every input definition.
- Define treatment of financial, industrial, utility and early-stage companies.
- Build point-in-time datasets without survivorship or look-ahead bias.
- Separate training/calibration and out-of-sample validation sets.
- Measure ROC-AUC, precision, recall, specificity, calibration and false-positive/false-negative rates.
- Backtest 12, 24 and 36-month horizons.
- Compare against documented baseline models without changing their definitions to favor the Dobrofsky model.
- Version thresholds, weights, datasets and model changes.
- Document limitations and material model-risk assumptions.

## Interpretation
Scores are analytical risk indicators. A score must not be presented as a probability of bankruptcy unless a statistically validated calibration maps scores to probabilities for a clearly defined population and horizon.
