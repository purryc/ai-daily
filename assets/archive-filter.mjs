// Archive dates come from existing issue cards, never from generated fixtures.
export function issueDate(value) {
  const match = String(value).match(/(?:^|\s)d-(\d{4}-\d{2}-\d{2})(?:\s|$)/);
  if (!match) return null;
  const date = match[1];
  const parsed = new Date(date + 'T12:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : null;
}
export function torontoToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  return ['year', 'month', 'day'].map(key => parts.find(p => p.type === key).value).join('-');
}
export function yearsFor(dates) {
  return [...new Set(dates.map(date => date.slice(0, 4)))].sort().reverse();
}
export function normalizeState(params, dates) {
  const year = params.get('year') || 'all';
  const month = params.get('month') || 'all';
  return {
    year: year === 'all' || yearsFor(dates).includes(year) ? year : 'all',
    month: /^(0[1-9]|1[0-2])$/.test(month) ? month : 'all',
    order: params.get('order') === 'oldest' ? 'oldest' : 'newest'
  };
}
export function selectDates(dates, state) {
  return dates.filter(date =>
    (state.year === 'all' || date.startsWith(state.year + '-')) &&
    (state.month === 'all' || date.slice(5, 7) === state.month)
  ).sort((a, b) => state.order === 'oldest' ? a.localeCompare(b) : b.localeCompare(a));
}
export function monthOptions(dates, year, today) {
  const scoped = dates.filter(date => year === 'all' || date.startsWith(year + '-'));
  return Array.from({length: 12}, (_, i) => {
    const value = String(i + 1).padStart(2, '0');
    const count = scoped.filter(date => date.slice(5, 7) === value).length;
    // An all-years month can contain older issues, even if this year's month is future.
    const future = count === 0 && (year !== 'all' ?
      `${year}-${value}` > today.slice(0, 7) :
      dates.length > 0 && yearsFor(dates).every(y => y >= today.slice(0, 4)) && value > today.slice(5, 7));
    return {value, count, future};
  });
}
export function writeState(url, state) {
  const next = new URL(url);
  for (const key of ['year', 'month', 'order']) {
    const defaultValue = key === 'order' ? 'newest' : 'all';
    if (state[key] === defaultValue) next.searchParams.delete(key);
    else next.searchParams.set(key, state[key]);
  }
  return next;
}

export function mountArchive(doc = document, win = window) {
  const root = doc.querySelector('[data-archive-filters]');
  if (!root) return;
  const zh = doc.documentElement.lang.startsWith('zh');
  const cards = [...doc.querySelectorAll('.issue-card[data-time]')];
  const entries = cards.map(card => ({card, date: issueDate(card.dataset.time)}));
  if (entries.some(entry => !entry.date)) throw Error('Archive contains an invalid issue date');
  const dates = entries.map(entry => entry.date), today = torontoToday();
  const yearControl = root.querySelector('[data-archive-year]');
  const sortControl = root.querySelector('[data-archive-order]');
  const monthButtons = [...root.querySelectorAll('[data-archive-month]')];
  const status = root.querySelector('[data-archive-status]');
  const empty = doc.querySelector('[data-archive-empty]');
  const list = doc.querySelector('#archive');
  const languageLinks = [...doc.querySelectorAll('.lang-switch a')].map(a => ({a, url: a.href}));
  const monthNames = zh ? [] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let state = normalizeState(new URL(win.location.href).searchParams, dates);
  for (const year of yearsFor(dates)) {
    const option = doc.createElement('option');
    option.value = year;
    option.textContent = `${year} (${dates.filter(d => d.startsWith(year + '-')).length})`;
    yearControl.append(option);
  }
  function render(updateUrl = true) {
    yearControl.value = state.year;
    sortControl.value = state.order;
    const months = monthOptions(dates, state.year, today);
    const visible = selectDates(dates, state);
    const visibleSet = new Set(visible);
    const ordered = [...entries].sort((a, b) => state.order === 'oldest' ?
      a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    for (const {card, date} of ordered) {
      card.hidden = !visibleSet.has(date);
      list.append(card);
    }
    for (const button of monthButtons) {
      const value = button.dataset.archiveMonth;
      const item = months.find(m => m.value === value);
      const count = item ? item.count : months.reduce((sum, m) => sum + m.count, 0);
      const title = value === 'all' ? (zh ? '全部月份' : 'All months') :
        (zh ? `${Number(value)}月` : monthNames[Number(value) - 1]);
      button.querySelector('[data-month-name]').textContent = title;
      button.querySelector('[data-month-count]').textContent = item?.future ?
        (zh ? '未到月份 · 0' : 'Upcoming · 0') : (zh ? `${count}期` : `${count} issues`);
      button.disabled = Boolean(item?.future);
      button.setAttribute('aria-pressed', String(state.month === value));
      button.setAttribute('aria-label', `${title} · ${count}${zh ? '期' : ' issues'}${item?.future ? (zh ? ' · 未到月份，不可选' : ' · Upcoming, unavailable') : ''}`);
    }
    const period = [state.year === 'all' ? (zh ? '全部年份' : 'All years') : state.year,
      state.month === 'all' ? (zh ? '全部月份' : 'All months') :
        (zh ? `${Number(state.month)}月` : monthNames[Number(state.month) - 1])].join(' · ');
    status.textContent = zh ? `${period} · 共 ${visible.length} 期` : `${period} · ${visible.length} issues`;
    empty.hidden = visible.length !== 0;
    if (!empty.hidden) {
      const future = months.find(m => m.value === state.month)?.future;
      empty.querySelector('h2').textContent = future ?
        (zh ? '这个月份尚未到来' : 'This month is still ahead') :
        (zh ? '这个月份暂无刊物' : 'No issues for this month');
      empty.querySelector('p').textContent = zh ?
        '可以选择其他月份，或清除日期筛选查看全部已收录刊物。' :
        'Choose another month, or clear the date filters to browse all indexed issues.';
    }
    const next = writeState(win.location.href, state);
    if (updateUrl) win.history.replaceState(null, '', next.href);
    for (const {a, url} of languageLinks) {
      const target = writeState(url, state);
      a.href = target.href;
    }
    root.dataset.ready = 'true';
  }
  yearControl.addEventListener('change', () => {
    state.year = yearControl.value;
    if (monthOptions(dates, state.year, today).find(m => m.value === state.month)?.future) state.month = 'all';
    render();
  });
  sortControl.addEventListener('change', () => {state.order = sortControl.value; render();});
  for (const button of monthButtons) button.addEventListener('click', () => {
    state.month = button.dataset.archiveMonth; render();
  });
  doc.querySelectorAll('[data-archive-reset]').forEach(button => button.addEventListener('click', () => {
    state.year = 'all'; state.month = 'all'; render();
    // Empty-state actions disappear; keep the keyboard user on a visible control.
    if (empty.contains(button)) yearControl.focus();
  }));
  win.addEventListener('popstate', () => {
    state = normalizeState(new URL(win.location.href).searchParams, dates); render(false);
  });
  render();
}
if (typeof document !== 'undefined') mountArchive();
