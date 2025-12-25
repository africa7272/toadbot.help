(() => {
  const form = document.getElementById('siteSearch');
  const input = document.getElementById('q');
  const panel = document.getElementById('searchPanel');

  if (!form || !input || !panel) return;

  // Заглушки страниц: пути уже прописаны — добавишь файлы позже
  const PAGES = [
    { title: 'С чего начать: быстрый старт', url: 'start/index.html', tags: ['начать', 'новичок', 'старт', 'команды', 'telegram', 'игровой бот'] },
    { title: 'Гайды: раздел для новичков', url: 'guides/index.html', tags: ['гайды', 'советы', 'бот', 'телеграм', 'тамагочи'] },
    { title: 'Гайд по боям и арене', url: 'guides/battles.html', tags: ['бои', 'арена', 'дуэль', 'соревнования', 'сражения'] },
    { title: 'Wiki: справочник по игре', url: 'wiki/index.html', tags: ['wiki', 'справочник', 'термины', 'вопросы'] },
    { title: 'Wiki: предметы и награды', url: 'wiki/items.html', tags: ['предметы', 'награды', 'ресурсы', 'добыча'] },
    { title: 'Калькулятор сытости', url: 'tools/satiety-calculator.html', tags: ['сытость', 'калькулятор', 'уход', 'кормление', 'тамагочи'] },
  ];

  const normalize = (s) =>
    (s || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  function render(results, q) {
    if (!q) {
      panel.classList.remove('is-open');
      panel.innerHTML = '';
      return;
    }

    const items = results.slice(0, 8).map(r => {
      return `
        <a class="search__item" href="${r.url}">
          <span class="search__title">${escapeHtml(r.title)}</span>
          <span class="search__hint">${escapeHtml(r.hint)}</span>
        </a>
      `;
    }).join('');

    panel.innerHTML = items || `
      <div class="search__item" style="cursor:default">
        <span class="search__title">Ничего не найдено</span>
        <span class="search__hint">Попробуйте: “начать”, “сытость”, “wiki”, “бои”.</span>
      </div>
    `;
    panel.classList.add('is-open');
  }

  function escapeHtml(str) {
    return (str || '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function search(qRaw) {
    const q = normalize(qRaw);
    if (!q) return [];

    const parts = q.split(' ').filter(Boolean);

    const scored = PAGES.map(p => {
      const hay = normalize([p.title, ...(p.tags || [])].join(' '));
      let score = 0;

      for (const part of parts) {
        if (hay.includes(part)) score += 2;
      }
      if (normalize(p.title).includes(q)) score += 3;

      return { ...p, score, hint: p.url };
    })
    .filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score);

    return scored;
  }

  input.addEventListener('input', () => {
    const q = input.value;
    render(search(q), normalize(q));
  });

  document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) {
      panel.classList.remove('is-open');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = normalize(input.value);
    const results = search(q);
    render(results, q);

    // если есть явный топ-результат — можно перейти сразу
    if (results.length === 1) window.location.href = results[0].url;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      panel.classList.remove('is-open');
      input.blur();
    }
  });
})();
