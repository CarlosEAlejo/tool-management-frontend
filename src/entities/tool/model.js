export const TOOL_STATUS = {
  ACTIVE: 'active',
  ASSIGNED: 'assigned',
  MAINTENANCE: 'maintenance',
  LOST: 'lost',
  DAMAGED: 'damaged',
};

export const TOOL_TYPE = {
  ELECTRIC: 'electric',
  MANUAL: 'manual',
  MEASURING: 'measuring',
  SAFETY: 'safety',
  OTHER: 'other',
};

export const TOOL_STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: TOOL_STATUS.ACTIVE, label: 'Disponible' },
  { value: TOOL_STATUS.ASSIGNED, label: 'Asignada' },
  { value: TOOL_STATUS.MAINTENANCE, label: 'Mantenimiento' },
  { value: TOOL_STATUS.LOST, label: 'Perdida' },
  { value: TOOL_STATUS.DAMAGED, label: 'Danada' },
];

export const TOOL_EDITABLE_STATUS_OPTIONS = TOOL_STATUS_OPTIONS.filter(({ value }) => value !== 'all');
export const TOOL_CREATE_STATUS_OPTIONS = [{ value: TOOL_STATUS.ACTIVE, label: 'Disponible' }];

export const TOOL_TYPE_OPTIONS = [
  { value: TOOL_TYPE.ELECTRIC, label: 'Electrica' },
  { value: TOOL_TYPE.MANUAL, label: 'Manual' },
  { value: TOOL_TYPE.MEASURING, label: 'Medicion' },
  { value: TOOL_TYPE.SAFETY, label: 'Seguridad' },
  { value: TOOL_TYPE.OTHER, label: 'Otro' },
];

export const STATUS_META = {
  [TOOL_STATUS.ACTIVE]: { label: 'Disponible', badgeClassName: 'bg-emerald-100 text-emerald-800' },
  [TOOL_STATUS.ASSIGNED]: { label: 'Asignada', badgeClassName: 'bg-blue-100 text-blue-800' },
  [TOOL_STATUS.MAINTENANCE]: { label: 'Mantenimiento', badgeClassName: 'bg-amber-100 text-amber-800' },
  [TOOL_STATUS.LOST]: { label: 'Perdida', badgeClassName: 'bg-rose-100 text-rose-800' },
  [TOOL_STATUS.DAMAGED]: { label: 'Danada', badgeClassName: 'bg-rose-100 text-rose-800' },
};

export const TYPE_LABELS = TOOL_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const EMPTY_TOOL_FORM = {
  code: '',
  name: '',
  type: TOOL_TYPE.ELECTRIC,
  status: TOOL_STATUS.ACTIVE,
  responsible: '',
  assignmentDate: '',
  dateMaintenance: '',
  nextMaintenance: '',
  deterioration: false,
  location: '',
  notes: '',
};

const parseISODate = (value) => {
  const plainDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (plainDateMatch) {
    return new Date(Number(plainDateMatch[1]), Number(plainDateMatch[2]) - 1, Number(plainDateMatch[3]));
  }

  return new Date(value);
};

export const getApiErrorMessage = (error, fallbackMessage) => {
  const code = error?.response?.data?.code;
  const details = error?.response?.data?.details;

  if (code === 'validation_error' && details) {
    return Object.values(details)[0] || fallbackMessage;
  }

  if (code === 'invalid_id') {
    return 'El identificador de la herramienta no es valido.';
  }

  if (code === 'tool_not_found') {
    return 'La herramienta seleccionada ya no existe.';
  }

  if (code === 'invalid_json') {
    return 'Los datos enviados no tienen un formato valido.';
  }

  return error?.response?.data?.message || error?.message || fallbackMessage;
};

export const sanitizeToolPayload = (tool) => {
  const payload = {
    ...EMPTY_TOOL_FORM,
    ...tool,
    code: tool.code?.trim() ?? '',
    name: tool.name?.trim() ?? '',
    location: tool.location?.trim() ?? '',
    notes: tool.notes?.trim() ?? '',
    responsible: tool.responsible?.trim() ?? '',
  };

  if (payload.status === TOOL_STATUS.ACTIVE) {
    payload.responsible = '';
    payload.assignmentDate = '';
    payload.dateMaintenance = '';
    payload.nextMaintenance = '';
    payload.deterioration = false;
  }

  if (payload.status === TOOL_STATUS.ASSIGNED) {
    payload.dateMaintenance = '';
    payload.nextMaintenance = '';
    payload.deterioration = false;
  }

  if (payload.status === TOOL_STATUS.MAINTENANCE) {
    payload.responsible = '';
    payload.assignmentDate = '';
    payload.deterioration = false;
  }

  if (payload.status === TOOL_STATUS.LOST) {
    payload.dateMaintenance = '';
    payload.nextMaintenance = '';
    payload.deterioration = false;
  }

  if (payload.status === TOOL_STATUS.DAMAGED) {
    payload.dateMaintenance = '';
    payload.nextMaintenance = '';
  }

  return payload;
};

export const getStatusMeta = (status) => STATUS_META[status] || { label: status, badgeClassName: 'bg-slate-100 text-slate-800' };
export const getTypeLabel = (type) => TYPE_LABELS[type] || type;

export const filterTools = (tools = [], filters = {}) => {
  const searchValue = filters.search?.trim().toLowerCase() || '';
  return tools.filter((tool) => {
    const matchesSearch =
      searchValue === '' ||
      tool.code?.toLowerCase().includes(searchValue) ||
      tool.name?.toLowerCase().includes(searchValue);
    const matchesStatus = !filters.status || filters.status === 'all' || tool.status === filters.status;
    const matchesResponsible =
      !filters.responsible || filters.responsible === 'all' || tool.responsible === filters.responsible;

    return matchesSearch && matchesStatus && matchesResponsible;
  });
};

export const buildToolStats = (tools = []) => {
  const maintenanceDates = tools
    .map((tool) => tool.nextMaintenance)
    .filter(Boolean)
    .map((value) => parseISODate(value))
    .filter((date) => !Number.isNaN(date.getTime()));

  return {
    total: tools.length,
    maintenance: tools.filter((tool) => tool.status === TOOL_STATUS.MAINTENANCE).length,
    lostOrDamaged: tools.filter((tool) => tool.status === TOOL_STATUS.LOST || tool.status === TOOL_STATUS.DAMAGED).length,
    assigned: tools.filter((tool) => tool.status === TOOL_STATUS.ASSIGNED).length,
    active: tools.filter((tool) => tool.status === TOOL_STATUS.ACTIVE).length,
    nextMaintenance:
      maintenanceDates.length > 0
        ? new Date(Math.min(...maintenanceDates.map((date) => date.getTime()))).toISOString()
        : '',
  };
};

export const getResponsibleOptions = (tools = []) =>
  Array.from(new Set(tools.map((tool) => tool.responsible).filter(Boolean))).sort((left, right) => left.localeCompare(right));

export const mapToolsToReportRows = (tools = []) =>
  tools.map((tool) => ({
    Codigo: tool.code,
    Nombre: tool.name,
    Tipo: getTypeLabel(tool.type),
    Estado: getStatusMeta(tool.status).label,
    Responsable: tool.responsible || '-',
    FechaAsignacion: tool.assignmentDate || '-',
    Ubicacion: tool.location || '-',
  }));
