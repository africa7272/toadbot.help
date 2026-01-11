(function () {
  const track = document.getElementById("gTrack");
  const prev = document.getElementById("gPrev");
  const next = document.getElementById("gNext");

  if (!track || !prev || !next) return;

  function stepPx() {
    // листаем ровно на ширину 1 карточки + gap
    const card = track.querySelector(".gcard");
    if (!card) return 420;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "14") || 14;
    return card.getBoundingClientRect().width + gap;
  }

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -stepPx(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: stepPx(), behavior: "smooth" });
  });
})();
