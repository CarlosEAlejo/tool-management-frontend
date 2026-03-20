import { buildToolStats, filterTools, getApiErrorMessage, sanitizeToolPayload, TOOL_STATUS } from './model';

const tools = [
  { id: '1', code: 'TL-1', name: 'Taladro', status: TOOL_STATUS.ACTIVE, responsible: '', nextMaintenance: '2026-01-10' },
  { id: '2', code: 'MS-2', name: 'Martillo', status: TOOL_STATUS.ASSIGNED, responsible: 'Ana', nextMaintenance: '' },
  { id: '3', code: 'SC-3', name: 'Sierra', status: TOOL_STATUS.MAINTENANCE, responsible: '', nextMaintenance: '2025-02-01' },
];

test('filterTools applies search and responsible filters', () => {
  const result = filterTools(tools, { search: 'mar', responsible: 'Ana', status: 'all' });
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Martillo');
});

test('buildToolStats calculates totals', () => {
  const stats = buildToolStats(tools);
  expect(stats.total).toBe(3);
  expect(stats.assigned).toBe(1);
  expect(stats.maintenance).toBe(1);
});

test('buildToolStats keeps plain dates stable across timezone parsing', () => {
  const stats = buildToolStats([{ id: '1', nextMaintenance: '2026-03-20', status: TOOL_STATUS.ACTIVE }]);
  expect(stats.nextMaintenance.startsWith('2026-03-20')).toBe(true);
});

test('sanitizeToolPayload clears incompatible fields for active tool', () => {
  const payload = sanitizeToolPayload({
    code: 'TL-1',
    name: 'Taladro',
    status: TOOL_STATUS.ACTIVE,
    responsible: 'Ana',
    assignmentDate: '2026-01-01',
    dateMaintenance: '2026-02-01',
    nextMaintenance: '2026-03-01',
    location: 'Almacen',
    notes: '  nota  ',
  });

  expect(payload.responsible).toBe('');
  expect(payload.assignmentDate).toBe('');
  expect(payload.dateMaintenance).toBe('');
  expect(payload.notes).toBe('nota');
});

test('getApiErrorMessage prioritizes validation details and known codes', () => {
  expect(getApiErrorMessage({ response: { data: { code: 'invalid_id' } } }, 'fallback')).toMatch(/identificador/i);
  expect(
    getApiErrorMessage({ response: { data: { code: 'validation_error', details: { name: 'Nombre requerido' } } } }, 'fallback')
  ).toBe('Nombre requerido');
});
