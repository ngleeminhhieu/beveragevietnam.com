export default function BlogRelatedModule() {
  const sliders = [...document.querySelectorAll(".blogRelatedSliderJS")];
  if (!sliders.length || typeof window.Swiper !== "function") return;

  sliders.forEach((slider) => {
    const slideCount = slider.querySelectorAll(".swiper-slide").length;

    new window.Swiper(slider, {
      slidesPerView: 2,
      spaceBetween: 0,
      loop: slideCount > 5,
      speed: 700,
      grabCursor: true,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      // The heading occupies its own row; the full-width track can show four on
      // desktop while retaining two cards through tablet and mobile.
      breakpoints: {
        1201: {
          slidesPerView: 4,
        },
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "خبر قبلی",
        nextSlideMessage: "خبر بعدی",
        firstSlideMessage: "این نخستین خبر است",
        lastSlideMessage: "این آخرین خبر است",
        slideLabelMessage: "{{index}} از {{slidesLength}}",
      },
    });
  });
}
