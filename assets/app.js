(() => {
  // Mobile menu
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });
  }

  // Make marquee infinite by duplicating track content once
  const track = document.getElementById('track');
  if (track) {
    const clone = track.cloneNode(true);
    // чтобы анимация “-50%” была корректной — делаем два одинаковых набора подряд
    track.append(...Array.from(clone.children));
  }

  // Search (по будущим страницам + по “возможностям”)
  const form = document.getElementById('siteSearch');
  const input = document.getElementById('q');
  const panel = document.getElementById('searchPanel');

  if (!form || !input || !panel) return;

  const PAGES = [
    { title: 'С чего начать: быстрый старт', url: 'start/index.html', tags: ['начать', 'новичок', 'старт', 'игровой бот', 'тамагочи'] },
    { title: 'Гайды: режимы и советы', url: 'guides/index.html', tags: ['гайды', 'арена', 'кланы', 'подземелье'] },
    { title: 'Wiki: справочник по игре', url: 'wiki/index.html', tags: ['wiki', 'справочник', 'термины'] },
    { title: 'Калькулятор сытости', url: 'tools/satiety-calculator.html', tags: ['сытость', 'калькулятор', 'кормление', 'уход'] },
  ];

  const tiles = Array.from(document.querySelectorAll('.tile'));
  const TILE_RESULTS = tiles.map(t => ({
    title: t.querySelector('.tile__text')?.textContent?.trim() || 'Возможность',
    url: 'guides/index.html', // пока заглушка: позже сделаем точные страницы/анкоры
    tags: (t.getAttribute('data-q') || '').split(' ').filter(Boolean)
  }));

  const normalize = (s) =>
    (s || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const DATA = [...PAGES, ...TILE_RESULTS];

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

    return DATA
      .map(item => {
        const hay = normalize([item.title, ...(item.tags || [])].join(' '));
        let score = 0;
        for (const part of parts) if (hay.includes(part)) score += 2;
        if (normalize(item.title).includes(q)) score += 3;
        return { ...item, score, hint: item.url };
      })
      .filter(x => x.score > 0)
      .sort((a,b) => b.score - a.score)
      .slice(0, 8);
  }

  function render(results, q) {
    if (!q) {
      panel.classList.remove('is-open');
      panel.innerHTML = '';
      return;
    }

    panel.innerHTML = results.length
      ? results.map(r => `
          <a class="search__item" href="${r.url}">
            <span class="search__title">${escapeHtml(r.title)}</span>
            <span class="search__hint">${escapeHtml(r.hint)}</span>
          </a>
        `).join('')
      : `
        <div class="search__item" style="cursor:default">
          <span class="search__title">Ничего не найдено</span>
          <span class="search__hint">Попробуй: “тамагочи”, “сытость”, “арена”, “кланы”.</span>
        </div>
      `;

    panel.classList.add('is-open');
  }

  input.addEventListener('input', () => {
    const q = input.value;
    render(search(q), normalize(q));
  });

  document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) panel.classList.remove('is-open');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = normalize(input.value);
    const results = search(q);
    render(results, q);
    if (results.length === 1) window.location.href = results[0].url;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      panel.classList.remove('is-open');
      input.blur();
    }
  });
})();
