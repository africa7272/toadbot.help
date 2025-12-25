(() => {
  const track = document.getElementById("track");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");

  if (!track || !prev || !next) return;

  const scrollByCard = () => {
    const card = track.querySelector(".card");
    return card ? (card.getBoundingClientRect().width + 14) : 220;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollByCard() * 2, behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollByCard() * 2, behavior: "smooth" });
  });
})();
