(() => {
  // Gallery carousel: 3 visible, total 7 (first 3 visible, next 4 scroll behind)
  const track = document.getElementById("gTrack");
  const prevBtn = document.getElementById("gPrev");
  const nextBtn = document.getElementById("gNext");

  function cardStepPx() {
    const card = track?.querySelector(".gcard");
    if (!card) return 320;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "14");
    return card.getBoundingClientRect().width + (isNaN(gap) ? 14 : gap);
  }

  function scrollByCards(dir = 1) {
    if (!track) return;
    track.scrollBy({ left: cardStepPx() * dir, behavior: "smooth" });
  }

  prevBtn?.addEventListener("click", () => scrollByCards(-1));
  nextBtn?.addEventListener("click", () => scrollByCards(1));

  // Search: send query to search.html?q=
  const form = document.getElementById("searchForm");
  form?.addEventListener("submit", (e) => {
    const input = form.querySelector("input[name='q']");
    const q = (input?.value || "").trim();
    if (!q) e.preventDefault();
  });
})();
