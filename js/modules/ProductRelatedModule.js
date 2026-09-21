export default function ProductRelatedModule() {
  const sliders = [...document.querySelectorAll(".productRelatedSliderJS")];
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
      // 1441 drops back to three: the slider gives a quarter of the row to the
      // heading there, so three in view is the same card width as four across
      // the full width below it.
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
        901: {
          slidesPerView: 4,
        },
        1441: {
          slidesPerView: 3,
        },
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "المنتج السابق",
        nextSlideMessage: "المنتج التالي",
        firstSlideMessage: "هذا هو المنتج الأول",
        lastSlideMessage: "هذا هو المنتج الأخير",
        slideLabelMessage: "{{index}} من {{slidesLength}}",
      },
    });
  });
}
