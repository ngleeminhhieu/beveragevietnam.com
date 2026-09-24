export default function HeaderModule() {
  const header = document.querySelector(".hd");
  if (!header) return;

  const main = document.querySelector(".main");
  const actions = document.querySelector(".page-actions");
  const megaItems = [...header.querySelectorAll(".menu-item.mega[data-mega]")];
  const megaContainer = header.querySelector(".hd-mega");
  const overlay = header.querySelector(".hd-overlay");
  const desktop = window.matchMedia("(min-width: 1201px)");

  // The bar may not leave until the page is this far down, so it never flickers
  // against the top of the document; and it only changes its mind after this
  // much travel, so a trackpad's jitter cannot flap it open and shut.
  const HIDE_AFTER = 120;
  const FLIP_DELTA = 8;

  let megaOpen = false;
  let megaCloseTimer;
  let lastY = Math.max(window.scrollY, 0);
  let frame = 0;

  const updateTransparent = () => {
    const transparent = desktop.matches
      && window.scrollY <= 0
      && !megaOpen
      && !header.hasAttribute("data-header-action")
      && !header.classList.contains("default");
    header.classList.toggle("hd-transparent", transparent);
  };

  const closeMega = () => {
    window.clearTimeout(megaCloseTimer);
    megaOpen = false;
    header.removeAttribute("data-active-mega");
    updateTransparent();
  };

  const openMega = (key) => {
    if (!desktop.matches) return;
    document.dispatchEvent(new CustomEvent("panel:open", { detail: "header-mega" }));
    window.clearTimeout(megaCloseTimer);
    megaOpen = true;
    header.dataset.activeMega = key;
    setHidden(false);
    updateTransparent();
  };

  const scheduleCloseMega = () => {
    window.clearTimeout(megaCloseTimer);
    megaCloseTimer = window.setTimeout(() => {
      if (megaContainer?.matches(":hover") || megaContainer?.contains(document.activeElement)) return;
      closeMega();
    }, 120);
  };

  // The floating rail rides the same signal as the bar, so the two leave and
  // return together off one listener.
  const setHidden = (hidden) => {
    header.classList.toggle("is-hidden", hidden);
    actions?.classList.toggle("is-hidden", hidden);
  };

  // Scrolling down takes the bar away, scrolling up brings it back -- except
  // while a panel is open, when it has to stay for the panel hanging off it.
  const applyHeader = () => {
    frame = 0;
    if (document.body.style.position === "fixed") return;

    const y = Math.max(window.scrollY, 0);
    const delta = y - lastY;

    document.body.classList.toggle("sticky", y > 0);
    main?.classList.toggle("hd-sticky", y > 0);
    updateTransparent();

    // no-scroll covers the mobile menu and the popups: the bar must stay put
    // for anything anchored to it, and a transformed .hd would become the
    // containing block for its own position: fixed children.
    const pinned = megaOpen
      || header.hasAttribute("data-header-action")
      || document.body.classList.contains("no-scroll");

    if (pinned || y <= HIDE_AFTER) {
      setHidden(false);
      lastY = y;
      return;
    }

    // Below the threshold the reading stands: lastY is left where the last
    // decision was made, so slow travel accumulates instead of resetting.
    if (Math.abs(delta) < FLIP_DELTA) return;

    setHidden(delta > 0);
    lastY = y;
  };

  // One read and one write per frame: the listener used to run the whole of
  // this on every scroll event, and the class toggles forced a style recalc
  // each time.
  const updateHeader = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(applyHeader);
  };

  megaItems.forEach((item) => {
    item.addEventListener("mouseenter", () => openMega(item.dataset.mega));
    item.addEventListener("mouseleave", scheduleCloseMega);
    item.addEventListener("focusin", () => openMega(item.dataset.mega));
    item.addEventListener("focusout", scheduleCloseMega);
  });

  megaContainer?.addEventListener("mouseenter", () => window.clearTimeout(megaCloseTimer));
  megaContainer?.addEventListener("mouseleave", scheduleCloseMega);
  megaContainer?.addEventListener("focusin", () => window.clearTimeout(megaCloseTimer));
  megaContainer?.addEventListener("focusout", scheduleCloseMega);
  overlay?.addEventListener("click", closeMega);

  document.addEventListener("panel:open", (event) => {
    if (event.detail !== "header-mega") closeMega();
  });

  document.addEventListener("header-action:change", () => {
    setHidden(false);
    updateTransparent();
    updateHeader();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMega();
  });

  desktop.addEventListener("change", (event) => {
    if (!event.matches) {
      closeMega();
      return;
    }

    updateTransparent();
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("pageshow", updateHeader);
  window.addEventListener("resize", updateHeader);
  applyHeader();
}
