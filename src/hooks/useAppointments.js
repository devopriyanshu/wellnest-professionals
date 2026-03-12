import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpertAppointments, updateAppointmentStatus } from '../services/appointmentService';

export const useExpertAppointments = (expertId) => {
  return useQuery({
    queryKey: ['expertAppointments', expertId],
    queryFn: () => fetchExpertAppointments(expertId),
    enabled: !!expertId,
  });
};

export const useUpdateAppointmentStatus = (expertId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ['expertAppointments', expertId] });
    },
  });
};
