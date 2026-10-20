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
export function populatedMonths(dates, year) {
  return monthOptions(dates, year, '9999-12-31').filter(month => month.count > 0);
}
export function changeYear(state, year, dates) {
  return {...state, year, month: state.month === 'all' || populatedMonths(dates, year).some(m => m.value === state.month) ? state.month : 'all'};
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
  const monthGrid = root.querySelector('.archive-month-grid');
  const monthButtons = new Map([...root.querySelectorAll('[data-archive-month]')].map(button => [button.dataset.archiveMonth, button]));
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
    const available = populatedMonths(dates, state.year);
    const choices = [{value:'all', count:available.reduce((sum, month) => sum + month.count, 0)}, ...available];
    const values = new Set(choices.map(item => item.value));
    for (const button of [...monthGrid.children]) {
      if (!values.has(button.dataset.archiveMonth)) {
        if (doc.activeElement === button) yearControl.focus();
        button.remove();
      }
    }
    choices.forEach((item, index) => {
      const value = item.value, count = item.count;
      let button = monthButtons.get(value);
      if (!button) {
        button = doc.createElement('button');
        button.type = 'button'; button.dataset.archiveMonth = value;
        for (const name of ['monthName', 'monthCount']) {
          const span = doc.createElement('span'); span.dataset[name] = '';
          if (name === 'monthCount') span.setAttribute('aria-hidden', 'true');
          button.append(span);
        }
        monthButtons.set(value, button);
      }
      const title = value === 'all' ? (zh ? '全部' : 'All') :
        (zh ? `${Number(value)}月` : monthNames[Number(value) - 1]);
      button.querySelector('[data-month-name]').textContent = title;
      button.querySelector('[data-month-count]').textContent = String(count);
      button.disabled = false;
      button.setAttribute('aria-pressed', String(state.month === value));
      button.setAttribute('aria-label', `${title} · ${count}${zh ? '期' : ' issues'}`);
      // Preserve the focused chip instead of rebuilding the whole control row.
      if (monthGrid.children[index] !== button) monthGrid.insertBefore(button, monthGrid.children[index] || null);
    });
    root.querySelector('[data-archive-reset]').hidden = state.year === 'all' && state.month === 'all';
    const period = [state.year === 'all' ? (zh ? '全部年份' : 'All years') : state.year,
      state.month === 'all' ? (zh ? '全部月份' : 'All months') :
        (zh ? `${Number(state.month)}月` : monthNames[Number(state.month) - 1])].join(' · ');
    status.textContent = zh ? `${period} · 共 ${visible.length} 期` : `${period} · ${visible.length} issues`;
    empty.hidden = visible.length !== 0;
    if (!empty.hidden) {
      const future = months.find(m => m.value === state.month)?.future;
      empty.querySelector('h2').textContent = future ?
        (zh ? `${period}尚未到来` : `${period} is still ahead`) :
        (zh ? `${period}暂无刊物` : `No issues: ${period}`);
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
    state = changeYear(state, yearControl.value, dates);
    render();
  });
  sortControl.addEventListener('change', () => {state.order = sortControl.value; render();});
  monthGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-archive-month]');
    if (button && monthGrid.contains(button)) {state.month = button.dataset.archiveMonth; render();}
  });
  doc.querySelectorAll('[data-archive-reset]').forEach(button => button.addEventListener('click', () => {
    state.year = 'all'; state.month = 'all'; render();
    // Both reset buttons disappear; keep the keyboard user on a visible control.
    yearControl.focus();
  }));
  win.addEventListener('popstate', () => {
    state = normalizeState(new URL(win.location.href).searchParams, dates); render(false);
  });
  render();
}
if (typeof document !== 'undefined') mountArchive();
