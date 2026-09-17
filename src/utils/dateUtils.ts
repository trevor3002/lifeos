export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDatePretty(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timestamp: string): string {
  try {
    const d = new Date(timestamp);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Returns the last N days including today
export function getRecentDays(count: number = 7): { dateStr: string; dayLabel: string; isToday: boolean }[] {
  const today = getTodayString();
  const days: { dateStr: string; dayLabel: string; isToday: boolean }[] = [];
  const base = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' }); // M, T, W, etc.
    days.push({
      dateStr,
      dayLabel,
      isToday: dateStr === today,
    });
  }

  return days;
}

// Calculate streak based on completions
export function calculateStreak(completions: Record<string, boolean>): { currentStreak: number; bestStreak: number } {
  const sortedDates = Object.keys(completions)
    .filter((d) => completions[d])
    .sort()
    .reverse();

  if (sortedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const todayStr = getTodayString();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  let currentStreak = 0;
  // If completed today or yesterday, active streak
  let checkDate = completions[todayStr] ? new Date(today) : completions[yesterdayStr] ? new Date(yesterday) : null;

  if (checkDate) {
    while (true) {
      const y = checkDate.getFullYear();
      const m = String(checkDate.getMonth() + 1).padStart(2, '0');
      const d = String(checkDate.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${d}`;
      if (completions[key]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Best streak calculation
  let bestStreak = currentStreak;
  let running = 0;
  const allAscending = Object.keys(completions)
    .filter((d) => completions[d])
    .sort();

  for (let i = 0; i < allAscending.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = new Date(allAscending[i - 1]);
      const curr = new Date(allAscending[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    if (running > bestStreak) {
      bestStreak = running;
    }
  }

  return { currentStreak, bestStreak };
}
