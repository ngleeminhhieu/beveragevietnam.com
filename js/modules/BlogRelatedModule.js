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
      // Two cards hold all the way to 1440, matching the two columns blog.html's
      // own grid runs over the same range. Above that the heading takes a quarter
      // of the row, so three in the track are each a quarter of the page too.
      breakpoints: {
        1441: {
          slidesPerView: 3,
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
