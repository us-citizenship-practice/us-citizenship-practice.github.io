// nav.js
// -----------------------------------------------------------------------
// Shared site-wide header behavior, included on every page. Handles:
//   - Click-to-open dropdown menus (works identically on desktop & mobile,
//     which avoids the classic "hover menu closes before I can click it"
//     problem on trackpads/touch)
//   - Closing a dropdown when you click anywhere else on the page
//   - The mobile hamburger menu toggle
// -----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  const hamburger = document.getElementById("navHamburger");
  const navLinks = document.getElementById("siteNavLinks");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-dropdown-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("is-open");
      // Close any other open dropdown first
      dropdowns.forEach((d) => {
        d.classList.remove("is-open");
        const t = d.querySelector(".nav-dropdown-trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        dropdown.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Clicking anywhere outside a dropdown closes all of them
  document.addEventListener("click", () => {
    dropdowns.forEach((d) => {
      d.classList.remove("is-open");
      const t = d.querySelector(".nav-dropdown-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });

  // Mobile hamburger menu
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      hamburger.classList.toggle("is-open", isOpen);
    });
  }

  // Pressing Escape closes everything (dropdowns + mobile menu)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    dropdowns.forEach((d) => d.classList.remove("is-open"));
    if (navLinks) navLinks.classList.remove("is-open");
    if (hamburger) hamburger.classList.remove("is-open");
  });
});
