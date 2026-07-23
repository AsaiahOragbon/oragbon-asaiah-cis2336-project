document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.querySelector(".faq-icon").textContent = isOpen ? "−" : "+";
    });
  });

  const searchInput = document.querySelector("#artwork-search");
  const categorySelect = document.querySelector("#category-filter");
  const artworkCards = [...document.querySelectorAll(".artwork-card")];
  const emptyState = document.querySelector("#empty-state");

  function filterArtwork() {
    if (!artworkCards.length) return;
    const term = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const category = categorySelect ? categorySelect.value : "all";
    let visibleCount = 0;

    artworkCards.forEach((card) => {
      const searchable = card.dataset.search.toLowerCase();
      const cardCategory = card.dataset.category;
      const matchesSearch = searchable.includes(term);
      const matchesCategory = category === "all" || cardCategory === category;
      const shouldShow = matchesSearch && matchesCategory;
      card.classList.toggle("hidden", !shouldShow);
      if (shouldShow) visibleCount++;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  searchInput?.addEventListener("input", filterArtwork);
  categorySelect?.addEventListener("change", filterArtwork);

  const eventButtons = document.querySelectorAll("[data-event]");
  const eventDetail = document.querySelector("#event-detail");

  const eventData = {
    studio: {
      title: "Open Studio Night",
      date: "July 25, 2026 · 6:00–9:00 PM",
      location: "Sawyer Yards, Houston, TX",
      image: "../images/event-open-studio.svg",
      description: "Tour working studios, meet local artists, and see paintings, photography, and mixed-media projects in progress. Admission is free."
    },
    watercolor: {
      title: "Beginner Watercolor Workshop",
      date: "August 1, 2026 · 11:00 AM–1:30 PM",
      location: "Art League Houston",
      image: "../images/event-watercolor.svg",
      description: "Learn basic washes, color mixing, and brush techniques in a relaxed beginner-friendly class. Supplies are included with registration."
    },
    walk: {
      title: "Downtown Art Walk",
      date: "August 8, 2026 · 5:30–8:30 PM",
      location: "Market Square Park",
      image: "../images/event-art-walk.svg",
      description: "Follow a self-guided route through galleries, pop-up exhibits, and public murals. Visitors can join at any point during the evening."
    },
    showcase: {
      title: "Young Creators Showcase",
      date: "August 15, 2026 · 2:00–6:00 PM",
      location: "MATCH Houston",
      image: "../images/event-showcase.svg",
      description: "Celebrate emerging artists through a community exhibition, artist talks, and live demonstrations. All ages are welcome."
    }
  };

  eventButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const event = eventData[button.dataset.event];
      if (!event || !eventDetail) return;

      eventDetail.innerHTML = `
        <img src="${event.image}" alt="${event.title}">
        <p class="eyebrow">Selected event</p>
        <h2>${event.title}</h2>
        <p><strong>${event.date}</strong></p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
      `;
      eventDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  const submissionForm = document.querySelector("#submission-form");
  const statusMessage = document.querySelector("#form-status");

  function setError(fieldId, message) {
    const field = document.querySelector(`#${fieldId}`);
    const error = document.querySelector(`#${fieldId}-error`);
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  }

  submissionForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(submissionForm);
    const artistName = formData.get("artistName").trim();
    const email = formData.get("email").trim();
    const artworkTitle = formData.get("artworkTitle").trim();
    const category = formData.get("category");
    const price = formData.get("price").trim();
    const description = formData.get("description").trim();

    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setError("artistName", artistName ? "" : "Please enter the artist name.");
    setError("email", emailPattern.test(email) ? "" : "Please enter a valid email address.");
    setError("artworkTitle", artworkTitle ? "" : "Please enter an artwork title.");
    setError("category", category ? "" : "Please choose a category.");
    setError("price", price === "" || Number(price) >= 0 ? "" : "Price must be zero or greater.");
    setError("description", description.length >= 20 ? "" : "Please enter at least 20 characters.");

    if (!artistName || !emailPattern.test(email) || !artworkTitle || !category || (price !== "" && Number(price) < 0) || description.length < 20) {
      valid = false;
    }

    if (!valid) {
      statusMessage.className = "status-message error";
      statusMessage.textContent = "Please correct the highlighted fields and submit again.";
      return;
    }

    statusMessage.className = "status-message success";
    statusMessage.textContent = `Thank you, ${artistName}. Your artwork information passed the front-end validation. Backend submission will be added in the next phase.`;
    submissionForm.reset();
    submissionForm.querySelectorAll("[aria-invalid]").forEach((field) => field.setAttribute("aria-invalid", "false"));
  });

  const showcaseImage = document.querySelector("#showcase-image");
  const thumbnailButtons = document.querySelectorAll(".thumbnail-button");

  thumbnailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!showcaseImage) return;
      showcaseImage.src = button.dataset.image;
      showcaseImage.alt = button.dataset.alt;
      thumbnailButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
});