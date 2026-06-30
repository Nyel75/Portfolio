// ============================================
// PORTFOLIO SCRIPT
// Handles: sticky nav active-state slider,
// mobile nav toggle, smooth scrolling,
// and scroll-reveal animations.
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  const nav        = document.getElementById("nav");
  const navLinks   = document.getElementById("navLinks");
  const navToggle  = document.getElementById("navToggle");
  const navSlider  = document.getElementById("navSlider");
  const links      = Array.from(navLinks.querySelectorAll("a"));
  const sections   = links
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  // --------------------------------------------
  // Slide the indicator under the active nav link
  // --------------------------------------------
  function moveSliderTo(link){
    if (!link) {
      navSlider.classList.remove("is-visible");
      return;
    }
    const linkRect = link.getBoundingClientRect();
    const navRect  = navLinks.getBoundingClientRect();

    navSlider.style.left  = (linkRect.left - navRect.left) + "px";
    navSlider.style.width = linkRect.width + "px";
    navSlider.classList.add("is-visible");
  }

  function setActiveLink(activeLink){
    links.forEach(l => l.classList.remove("is-active"));
    if (activeLink){
      activeLink.classList.add("is-active");
      moveSliderTo(activeLink);
    }
  }

  // --------------------------------------------
  // Smooth scroll on click + close mobile menu
  // --------------------------------------------
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      const navHeight = nav.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({ top: targetTop, behavior: "smooth" });
      setActiveLink(link);
      closeMobileNav();
    });
  });

  // --------------------------------------------
  // Mobile nav toggle
  // --------------------------------------------
  function openMobileNav(){
    navLinks.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.classList.add("is-open");
  }
  function closeMobileNav(){
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.classList.remove("is-open");
  }
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("is-open");
    isOpen ? closeMobileNav() : openMobileNav();
  });

  // --------------------------------------------
  // Highlight active section on scroll
  // --------------------------------------------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute("id");
        const matchingLink = links.find(l => l.getAttribute("href") === `#${id}`);
        if (matchingLink) setActiveLink(matchingLink);
      }
    });
  }, {
    rootMargin: "-40% 0px -50% 0px",
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));

  // Recalculate slider position on resize (link positions shift)
  window.addEventListener("resize", () => {
    const current = navLinks.querySelector("a.is-active");
    if (current) moveSliderTo(current);
  });

  // --------------------------------------------
  // Scroll-reveal animations
  // --------------------------------------------
  const revealTargets = document.querySelectorAll(
    ".section__head, .about__lead, .about__details, .skill-card, .thesis-card, .timeline__item, .cert-card, .contact__lead, .contact__links"
  );
  revealTargets.forEach(el => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // --------------------------------------------
  // Nav background grows more opaque after scroll
  // --------------------------------------------
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40){
      nav.style.boxShadow = "0 1px 0 rgba(0,0,0,0.4)";
    } else {
      nav.style.boxShadow = "none";
    }
  });

  // --------------------------------------------
  // Lightbox: click an image to view it enlarged
  // --------------------------------------------
  const lightbox        = document.getElementById("lightbox");
  const lightboxImg     = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose   = document.getElementById("lightboxClose");
  const lightboxTargets = document.querySelectorAll(".lightbox-img");

  function openLightbox(img){
    lightboxImg.src = img.getAttribute("src");
    lightboxImg.alt = img.getAttribute("alt") || "";
    lightboxCaption.textContent = img.getAttribute("data-caption") || img.getAttribute("alt") || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  lightboxTargets.forEach(img => {
    img.addEventListener("click", () => openLightbox(img));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  // Close when clicking the dark backdrop (but not the image/caption itself)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")){
      closeLightbox();
    }
  });

});