import { useQuery } from '@tanstack/react-query';
import { fetchPatientLogs } from '../services/logService';

export const usePatientLogs = (userId) => {
  return useQuery({
    queryKey: ['patientLogs', userId],
    queryFn: () => fetchPatientLogs(userId),
    enabled: !!userId,
  });
};
