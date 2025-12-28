import { useMemo } from "react";
import { View } from "react-big-calendar";
import { startOfWeek, endOfWeek, startOfDay, endOfDay, startOfMonth, endOfMonth, addMonths } from "date-fns";

interface UseCalendarDateRangeParams {
  currentDate: Date;
  currentView: View;
}

interface UseCalendarDateRangeReturn {
  timeMin: Date;
  timeMax: Date;
}

export function useCalendarDateRange({
  currentDate,
  currentView,
}: UseCalendarDateRangeParams): UseCalendarDateRangeReturn {
  const { timeMin, timeMax } = useMemo(() => {
    let min: Date;
    let max: Date;
    
    switch (currentView) {
      case "day":
        min = startOfDay(currentDate);
        max = endOfDay(currentDate);
        break;
      case "week":
        min = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
        max = endOfWeek(currentDate, { weekStartsOn: 0 }); // Saturday
        break;
      case "agenda":
        // Agenda view shows events from current date forward
        // Fetch a wide range (6 months ahead) to ensure all agenda events are available
        min = startOfDay(currentDate);
        max = endOfMonth(addMonths(currentDate, 6)); // 6 months ahead
        break;
      case "month":
      default:
        min = startOfMonth(currentDate);
        max = endOfMonth(currentDate);
        break;
    }
    
    return { timeMin: min, timeMax: max };
  }, [currentDate, currentView]);

  return { timeMin, timeMax };
}

