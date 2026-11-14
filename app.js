(() => {
  "use strict";

  const STORAGE_KEY = "my-gaming-room.games.v1";
  const demoGames = [
    { id: "demo-1", title: "Cyberpunk 2077", platform: "PlayStation 5", genre: "Action RPG", status: "playing", cover: "", createdAt: 3 },
    { id: "demo-2", title: "The Last of Us Part II", platform: "PlayStation 5", genre: "Adventure", status: "completed", cover: "", createdAt: 2 },
    { id: "demo-3", title: "Resident Evil 4", platform: "PlayStation 5", genre: "Survival horror", status: "playing", cover: "", createdAt: 1 },
    { id: "demo-4", title: "Hades", platform: "PC", genre: "Roguelike", status: "wishlist", cover: "", createdAt: 0 }
  ];
  const $ = (selector) => document.querySelector(selector);
  const grid = $("#game-grid");
  const dialog = $("#game-dialog");
  let games = loadGames();
  let activeFilter = "all";

  function loadGames() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return demoGames.map((game) => ({ ...game }));
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(isValidGame) : [];
    } catch (error) {
      console.error("Unable to load the game library:", error);
      return [];
    }
  }

  function isValidGame(game) {
    return game && typeof game.id === "string" && typeof game.title === "string" &&
      typeof game.platform === "string" && ["playing", "completed", "wishlist", "backlog"].includes(game.status);
  }

  function saveGames() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
      return true;
    } catch (error) {
      console.error("Unable to save the game library:", error);
      showToast("Could not save data. Check your browser storage.");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function safeImageUrl(value) {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  const statusLabels = { playing: "Playing", completed: "Completed", wishlist: "Wishlist", backlog: "Backlog" };

  function render() {
    const query = $("#search-input").value.trim().toLowerCase();
    const platform = $("#platform-filter").value;
    const sort = $("#sort-filter").value;
    const filtered = games.filter((game) => {
      const matchesFilter = activeFilter === "all" || game.status === activeFilter;
      const matchesPlatform = platform === "all" || game.platform === platform;
      const matchesQuery = [game.title, game.genre, game.platform].join(" ").toLowerCase().includes(query);
      return matchesFilter && matchesPlatform && matchesQuery;
    });
    filtered.sort((a, b) => sort === "az" ? a.title.localeCompare(b.title) : sort === "za" ? b.title.localeCompare(a.title) : b.createdAt - a.createdAt);

    $("#total-count").textContent = games.length;
    $("#playing-count").textContent = games.filter((game) => game.status === "playing").length;
    $("#completed-count").textContent = games.filter((game) => game.status === "completed").length;
    $("#wishlist-count").textContent = games.filter((game) => game.status === "wishlist").length;
    $("#visible-count").textContent = filtered.length;
    $("#empty-state").hidden = filtered.length > 0;
    grid.hidden = filtered.length === 0;
    grid.innerHTML = filtered.map((game) => {
      const cover = safeImageUrl(game.cover);
      const title = escapeHTML(game.title);
      const image = cover
        ? `<img src="${escapeHTML(cover)}" alt="Cover of ${title}" loading="lazy" onerror="this.remove()">`
        : `<span class="cover-placeholder" aria-hidden="true">${title.slice(0, 2).toUpperCase()}</span>`;
      return `<article class="game-card" data-id="${escapeHTML(game.id)}">
        <div class="game-cover">${image}<span class="status-pill">${statusLabels[game.status]}</span></div>
        <div class="card-content"><h3 class="card-title" title="${title}">${title}</h3>
        <div class="card-meta"><span>${escapeHTML(game.platform)}</span><span>${escapeHTML(game.genre || "No genre")}</span></div>
        <div class="card-actions"><label class="sr-only" for="status-${escapeHTML(game.id)}">Change status for ${title}</label>
        <select id="status-${escapeHTML(game.id)}" data-action="status" data-id="${escapeHTML(game.id)}" aria-label="Status for ${title}">
          ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${game.status === value ? "selected" : ""}>${label}</option>`).join("")}
        </select><button class="delete-button" data-action="delete" data-id="${escapeHTML(game.id)}" aria-label="Delete ${title}">Remove ×</button></div></div></article>`;
    }).join("");
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function openDialog() {
    $("#game-form").reset();
    dialog.showModal();
    $("#game-title").focus();
  }

  function setFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll(".filter-tab").forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === filter));
    $("#library-heading").textContent = filter === "all" ? "My library" : statusLabels[filter] || "My library";
    render();
  }

  $("#add-game-button").addEventListener("click", openDialog);
  $("#empty-add-button").addEventListener("click", openDialog);
  $("#close-dialog").addEventListener("click", () => dialog.close());
  $("#cancel-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  $("#game-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return;
    games.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      platform: String(form.get("platform")),
      status: String(form.get("status")),
      genre: String(form.get("genre") || "").trim(),
      cover: safeImageUrl(String(form.get("cover") || "")),
      createdAt: Date.now()
    });
    saveGames();
    dialog.close();
    setFilter("all");
    showToast(`“${title}” added to your library.`);
  });

  grid.addEventListener("change", (event) => {
    const target = event.target;
    if (target.dataset.action !== "status") return;
    const game = games.find((item) => item.id === target.dataset.id);
    if (!game) return;
    game.status = target.value;
    saveGames();
    render();
    showToast("Game status updated.");
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="delete"]');
    if (!button) return;
    const game = games.find((item) => item.id === button.dataset.id);
    if (!game || !window.confirm(`Remove “${game.title}” from your library?`)) return;
    games = games.filter((item) => item.id !== game.id);
    saveGames();
    render();
    showToast("Game removed.");
  });

  document.querySelectorAll(".filter-tab").forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.filter)));
  document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    setFilter(link.dataset.view);
    $("#page-title").textContent = link.textContent.trim();
    $("#sidebar").classList.remove("open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
  }));
  $("#search-input").addEventListener("input", render);
  $("#platform-filter").addEventListener("change", render);
  $("#sort-filter").addEventListener("change", render);
  $("#clear-filters").addEventListener("click", () => {
    $("#search-input").value = "";
    $("#platform-filter").value = "all";
    $("#sort-filter").value = "recent";
    setFilter("all");
  });
  $("#menu-toggle").addEventListener("click", () => {
    const open = $("#sidebar").classList.toggle("open");
    $("#menu-toggle").setAttribute("aria-expanded", String(open));
  });

  render();
})();