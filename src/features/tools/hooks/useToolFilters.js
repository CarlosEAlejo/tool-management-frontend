import { useMemo, useState } from 'react';
import { buildToolStats, filterTools, getResponsibleOptions } from '../../../entities/tool/model';

export const useToolFilters = (tools) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [responsible, setResponsible] = useState('all');

  const filteredTools = useMemo(
    () =>
      filterTools(tools, {
        search,
        status,
        responsible,
      }),
    [tools, search, status, responsible]
  );

  const stats = useMemo(() => buildToolStats(tools), [tools]);
  const responsibles = useMemo(() => getResponsibleOptions(tools), [tools]);

  return {
    filters: { search, status, responsible },
    filteredTools,
    responsibles,
    stats,
    setSearch,
    setStatus,
    setResponsible,
  };
};
