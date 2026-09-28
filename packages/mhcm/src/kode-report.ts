import type { KodeDiagnostic } from './kode-diagnostics.ts';
import type { KodeSpan } from './kode.ts';

export type KodeDiagnosticReport = {
  version: '0.1';
  diagnostics: KodeDiagnostic[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
};

export function createDiagnosticReport(diagnostics: KodeDiagnostic[]): KodeDiagnosticReport {
  const sorted = diagnostics.slice();
  return {
    version: '0.1',
    diagnostics: sorted,
    errorCount: sorted.filter((item) => item.severity === 'error').length,
    warningCount: sorted.filter((item) => item.severity === 'warning').length,
    infoCount: sorted.filter((item) => item.severity === 'info').length,
  };
}

export type KodeDiagnosticWire = {
  code: string;
  severity: string;
  message: string;
  span?: {
    start: number;
    end: number;
    startPosition: { offset: number; line: number; column: number };
    endPosition: { offset: number; line: number; column: number };
  };
  relatedSpans: Array<{
    label: string;
    span: KodeDiagnosticWire['span'];
  }>;
};

export type KodeDiagnosticReportWire = {
  version: '0.1';
  diagnostics: KodeDiagnosticWire[];
  summary: {
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
};

export function serializeDiagnosticReport(report: KodeDiagnosticReport): KodeDiagnosticReportWire {
  return {
    version: report.version,
    diagnostics: report.diagnostics.map((item) => ({
      code: item.code,
      severity: item.severity,
      message: item.message,
      span: item.span,
      relatedSpans: (item.relatedSpans ?? []).map((label) => ({
        label: label.label,
        span: label.span,
      })),
    })),
    summary: {
      errorCount: report.errorCount,
      warningCount: report.warningCount,
      infoCount: report.infoCount,
    },
  };
}

export function deserializeDiagnosticReport(wire: KodeDiagnosticReportWire): KodeDiagnosticReport {
  return {
    version: wire.version,
    diagnostics: wire.diagnostics.map((item) => ({
      code: item.code as KodeDiagnostic['code'],
      severity: item.severity as KodeDiagnostic['severity'],
      message: item.message,
      span: item.span as KodeSpan | undefined,
      relatedSpans: item.relatedSpans.map((label) => ({
        label: label.label,
        span: label.span as KodeSpan,
      })),
    })),
    errorCount: wire.summary.errorCount,
    warningCount: wire.summary.warningCount,
    infoCount: wire.summary.infoCount,
  };
}
