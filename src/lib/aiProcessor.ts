interface VitalSigns {
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  oxygen_saturation: number;
  temperature: number;
  respiratory_rate: number;
}

interface AIPrediction {
  prediction_type: string;
  risk_score: number;
  confidence: number;
  recommendations: string;
  factors: Record<string, unknown>;
}

interface Alert {
  alert_type: string;
  severity: string;
  title: string;
  message: string;
}

export class AIProcessor {
  private normalRanges = {
    heart_rate: { min: 60, max: 100, critical_low: 40, critical_high: 120 },
    blood_pressure_systolic: { min: 90, max: 140, critical_low: 80, critical_high: 180 },
    blood_pressure_diastolic: { min: 60, max: 90, critical_low: 50, critical_high: 110 },
    oxygen_saturation: { min: 95, max: 100, critical_low: 90, critical_high: 100 },
    temperature: { min: 36.5, max: 37.5, critical_low: 35, critical_high: 39 },
    respiratory_rate: { min: 12, max: 20, critical_low: 8, critical_high: 30 }
  };

  analyzeVitalSigns(vitals: VitalSigns): { alerts: Alert[]; prediction: AIPrediction | null } {
    const alerts: Alert[] = [];
    let totalRiskScore = 0;
    let criticalFactors = 0;
    const factors: Record<string, string> = {};

    for (const [key, value] of Object.entries(vitals)) {
      const ranges = this.normalRanges[key as keyof typeof this.normalRanges];
      if (!ranges) continue;

      if (value < ranges.critical_low || value > ranges.critical_high) {
        criticalFactors++;
        totalRiskScore += 30;

        alerts.push({
          alert_type: 'critical',
          severity: 'high',
          title: `Critical ${this.formatVitalName(key)}`,
          message: `${this.formatVitalName(key)} is at critical level: ${value}${this.getUnit(key)}`
        });

        factors[key] = 'critical';
      } else if (value < ranges.min || value > ranges.max) {
        totalRiskScore += 15;

        alerts.push({
          alert_type: 'warning',
          severity: 'medium',
          title: `Abnormal ${this.formatVitalName(key)}`,
          message: `${this.formatVitalName(key)} is outside normal range: ${value}${this.getUnit(key)}`
        });

        factors[key] = 'abnormal';
      } else {
        factors[key] = 'normal';
      }
    }

    let prediction: AIPrediction | null = null;

    if (totalRiskScore > 0) {
      const riskScore = Math.min(totalRiskScore, 100);
      const confidence = 0.75 + (criticalFactors * 0.05);

      let predictionType = 'deterioration';
      let recommendations = this.generateRecommendations(vitals, factors);

      if (vitals.oxygen_saturation < 90 && vitals.heart_rate > 110) {
        predictionType = 'respiratory_distress';
        recommendations = 'Immediate oxygen therapy recommended. Consider respiratory support.';
      } else if (vitals.temperature > 38.5 && vitals.heart_rate > 100) {
        predictionType = 'sepsis_risk';
        recommendations = 'Monitor for sepsis indicators. Blood cultures recommended.';
      } else if (vitals.blood_pressure_systolic < 90) {
        predictionType = 'hypotension';
        recommendations = 'Monitor fluid balance. Consider vasopressor support.';
      }

      prediction = {
        prediction_type: predictionType,
        risk_score: riskScore,
        confidence: Math.min(confidence, 0.99),
        recommendations,
        factors
      };
    }

    return { alerts, prediction };
  }

  private formatVitalName(key: string): string {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getUnit(key: string): string {
    const units: Record<string, string> = {
      heart_rate: ' BPM',
      blood_pressure_systolic: ' mmHg',
      blood_pressure_diastolic: ' mmHg',
      oxygen_saturation: '%',
      temperature: '°C',
      respiratory_rate: ' breaths/min'
    };
    return units[key] || '';
  }

  private generateRecommendations(vitals: VitalSigns, factors: Record<string, string>): string {
    const recommendations: string[] = [];

    if (factors.oxygen_saturation === 'critical' || factors.oxygen_saturation === 'abnormal') {
      recommendations.push('Increase oxygen supplementation');
    }

    if (factors.heart_rate === 'critical' || factors.heart_rate === 'abnormal') {
      recommendations.push('Monitor cardiac function closely');
    }

    if (factors.temperature === 'critical' || factors.temperature === 'abnormal') {
      recommendations.push('Implement temperature management protocol');
    }

    if (factors.blood_pressure_systolic === 'critical' || factors.blood_pressure_systolic === 'abnormal') {
      recommendations.push('Adjust fluid and vasopressor management');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue current monitoring protocol');
    }

    return recommendations.join('. ') + '.';
  }

  generateSimulatedVitals(baseline: Partial<VitalSigns> = {}): VitalSigns {
    const randomVariation = (base: number, variation: number) => {
      return base + (Math.random() - 0.5) * variation;
    };

    return {
      heart_rate: Math.round(randomVariation(baseline.heart_rate || 75, 15)),
      blood_pressure_systolic: Math.round(randomVariation(baseline.blood_pressure_systolic || 120, 15)),
      blood_pressure_diastolic: Math.round(randomVariation(baseline.blood_pressure_diastolic || 80, 10)),
      oxygen_saturation: Math.round(randomVariation(baseline.oxygen_saturation || 98, 2) * 10) / 10,
      temperature: Math.round(randomVariation(baseline.temperature || 37, 0.5) * 10) / 10,
      respiratory_rate: Math.round(randomVariation(baseline.respiratory_rate || 16, 4))
    };
  }
}

export const aiProcessor = new AIProcessor();
