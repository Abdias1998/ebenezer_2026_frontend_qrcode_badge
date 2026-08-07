"use client";

import { useQuery } from "@tanstack/react-query";
import { eventService, mockEventInfo } from "@/services/event.service";
import type { EventInfo } from "@/types/registration.types";

export function useEventInfo(eventId?: string) {
  return useQuery<EventInfo>({
    queryKey: ["event", eventId || "active"],
    queryFn: async () => {
      try {
        if (eventId) {
          return await eventService.getEvent(eventId);
        }
        return await eventService.getActiveEvent();
      } catch {
        // Fallback to mock data during development
        return mockEventInfo;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 min
    refetchInterval: 1000 * 60 * 5, // refresh every 5 min
  });
}
