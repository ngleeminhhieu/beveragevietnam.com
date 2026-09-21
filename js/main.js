import HeaderModule from "./modules/HeaderModule.js";
import HeaderActionsModule from "./modules/HeaderActionsModule.js";
import MobileModule from "./modules/MobileModule.js";
import MobileSubModule from "./modules/MobileSubModule.js";
import CountUpModule from "./modules/CountUpModule.js";
import ExhibitionModule from "./modules/ExhibitionModule.js";
import CertificatesModule from "./modules/CertificatesModule.js";
import RangeModule from "./modules/RangeModule.js";
import BannerCtaModule from "./modules/BannerCtaModule.js";
import CatalogSelectsModule from "./modules/CatalogSelectsModule.js";
import CatalogFiltersModule from "./modules/CatalogFiltersModule.js";
import ProductContentModule from "./modules/ProductContentModule.js";
import ProductRelatedModule from "./modules/ProductRelatedModule.js";
import BlogRelatedModule from "./modules/BlogRelatedModule.js";
import ContactModule from "./modules/ContactModule.js";
import BrandPopupModule from "./modules/BrandPopupModule.js";
import AwardsModule from "./modules/AwardsModule.js";
import HistoryModule from "./modules/HistoryModule.js";
import StoryGalleryModule from "./modules/StoryGalleryModule.js";
import TypeCycleModule from "./modules/TypeCycleModule.js";
import PackagingModule from "./modules/PackagingModule.js";
import FaqModule from "./modules/FaqModule.js";
import ContentTableModule from "./modules/ContentTableModule.js";
import BlogTocModule from "./modules/BlogTocModule.js";

const initTemplateUtilities = () => {
  document.querySelector(".backToTopJS")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (window.Fancybox?.bind) {
    window.Fancybox.bind("[data-fancybox]", {
      dragToClose: true,
      placeFocusBack: true,
    });
  }
};

const initHeroSlider = () => {
  const slider = document.querySelector(".heroSliderJS");

  if (!slider || typeof window.Swiper !== "function") {
    return;
  }

  const hero = slider.closest(".hero-banner");
  const slideCount = slider.querySelectorAll(".swiper-slide").length;
  const autoplayDelay = 6000;
  const autoplayEnabled = slideCount > 1;
  const desktopHero = window.matchMedia("(min-width: 1441px)");
  let heroSwiper;
  let heroResizeFrame;

  hero?.style.setProperty("--hero-autoplay-delay", `${autoplayDelay}ms`);
  hero?.classList.toggle("has-autoplay-progress", autoplayEnabled);
  hero?.classList.remove("is-autoplay-paused");

  const updateHeroHeight = () => {
    if (desktopHero.matches) {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      hero?.style.setProperty("--hero-desktop-height", `${Math.round(viewportHeight)}px`);
    } else {
      hero?.style.removeProperty("--hero-desktop-height");
    }

    heroSwiper?.update();
  };

  const requestHeroResize = () => {
    window.cancelAnimationFrame(heroResizeFrame);
    heroResizeFrame = window.requestAnimationFrame(updateHeroHeight);
  };

  updateHeroHeight();

  heroSwiper = new window.Swiper(slider, {
    slidesPerView: 1,
    speed: 700,
    loop: slideCount > 1,
    watchOverflow: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    autoplay: autoplayEnabled
      ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }
      : false,
    navigation: {
      prevEl: hero?.querySelector(".heroPrevJS"),
      nextEl: hero?.querySelector(".heroNextJS"),
    },
    pagination: {
      el: hero?.querySelector(".heroPaginationJS"),
      clickable: true,
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "الشريحة السابقة",
      nextSlideMessage: "الشريحة التالية",
      firstSlideMessage: "هذه هي الشريحة الأولى",
      lastSlideMessage: "هذه هي الشريحة الأخيرة",
      paginationBulletMessage: "الانتقال إلى الشريحة {{index}}",
    },
    on: {
      autoplayStart() {
        hero?.classList.remove("is-autoplay-paused");
      },
      autoplayPause() {
        hero?.classList.add("is-autoplay-paused");
      },
      autoplayResume() {
        hero?.classList.remove("is-autoplay-paused");
      },
      autoplayStop() {
        hero?.classList.add("is-autoplay-paused");
      },
    },
  });

  window.addEventListener("resize", requestHeroResize, { passive: true });
  window.visualViewport?.addEventListener("resize", requestHeroResize, { passive: true });
  desktopHero.addEventListener("change", requestHeroResize);
};

// Run in order but in isolation: the list is long, and one page-specific throw
// used to take down every module queued after it.
const init = () => {
  [
    HeaderModule,
    HeaderActionsModule,
    MobileModule,
    MobileSubModule,
    CountUpModule,
    ExhibitionModule,
    initHeroSlider,
    initTemplateUtilities,
    CertificatesModule,
    RangeModule,
    BannerCtaModule,
    CatalogSelectsModule,
    CatalogFiltersModule,
    ProductContentModule,
    ProductRelatedModule,
    BlogRelatedModule,
    ContactModule,
    BrandPopupModule,
    AwardsModule,
    HistoryModule,
    StoryGalleryModule,
    TypeCycleModule,
    PackagingModule,
    FaqModule,
    ContentTableModule,
    BlogTocModule,
  ].forEach((module) => {
    try {
      module();
    } catch (error) {
      console.error(`${module.name || "module"} failed to start`, error);
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
