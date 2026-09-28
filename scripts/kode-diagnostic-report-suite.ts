import { createDiagnosticReport, deserializeDiagnosticReport, diagnostic, serializeDiagnosticReport } from '../packages/mhcm/src/index.ts';

const primary = { start: 4, end: 7, startPosition: { offset: 4, line: 1, column: 5 }, endPosition: { offset: 7, line: 1, column: 8 } };
const related = { start: 12, end: 15, startPosition: { offset: 12, line: 1, column: 13 }, endPosition: { offset: 15, line: 1, column: 16 } };
const report = createDiagnosticReport([
  diagnostic('E_SYMBOL', 'missing', primary, [{ label: 'reference', span: related }]),
  diagnostic('E_DUPLICATE', 'duplicate', related),
]);

if (report.errorCount !== 2 || report.warningCount !== 0 || report.infoCount !== 0) throw new Error('Diagnostic report summary mismatch.');

const wire = serializeDiagnosticReport(report);
if (wire.summary.errorCount !== 2 || wire.diagnostics[0].relatedSpans[0].label !== 'reference') {
  throw new Error('Diagnostic report serialization mismatch.');
}

const roundTrip = deserializeDiagnosticReport(wire);
if (roundTrip.diagnostics.length !== 2 || roundTrip.diagnostics[0].span?.start !== 4) {
  throw new Error('Diagnostic report round-trip mismatch.');
}

console.log('KODE-0.2 diagnostic report suite: PASS');
console.log('PASS report summary');
console.log('PASS report serialization');
console.log('PASS report round-trip');
