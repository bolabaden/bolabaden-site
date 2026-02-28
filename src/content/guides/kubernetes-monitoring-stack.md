---
description: Deploy a complete monitoring stack for Kubernetes clusters with alerting and visualization.
category: infrastructure
difficulty: intermediate
estimatedTime: 2-3 hours
prerequisites:
  - Kubernetes cluster
  - Helm 3
  - kubectl access
technologies:
  - Kubernetes
  - Prometheus
  - Grafana
  - Helm
---

# Kubernetes Monitoring Stack

Build production-grade monitoring for your Kubernetes clusters with Prometheus, Grafana, and AlertManager.

## Components Included

- Prometheus (Metrics collection and storage)
- Grafana (Visualization and dashboards)
- AlertManager (Alert routing and notification)
- Node Exporter (Hardware and OS metrics)
- kube-state-metrics (Kubernetes object metrics)

## Deployment with Helm

```bash
# Add Prometheus community Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set prometheus.prometheusSpec.retention=15d \
  --set grafana.adminPassword=secure-password-here
```

## Key Features

- Automatic service discovery
- Pre-built Grafana dashboards
- Alert rules for common issues
- Long-term metric retention
- High availability support
