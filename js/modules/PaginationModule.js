// 29-32 entries is too many for a bare <select>, so the page picker goes through
// select2 like the catalogue filters do -- same framed dropdown, same capped
// scroll. Each option's value is the whole href, so jumping is just following it,
// and the native change listener is wired first: select2 re-fires change, and if
// the library never loads the control still works on its own.
export default function PaginationModule() {
  const selects = [...document.querySelectorAll(".paginationJumpJS")];
  if (!selects.length) return;

  const jquery = window.jQuery;

  selects.forEach((select) => {
    select.addEventListener("change", () => {
      if (select.value) window.location.href = select.value;
    });

    if (!jquery?.fn?.select2) return;
    if (select.classList.contains("select2-hidden-accessible")) return;

    const field = select.closest(".catalog-pagination__jump");
    if (!field) return;

    const selectElement = jquery(select);

    selectElement.select2({
      width: "auto",
      dir: "ltr",
      minimumResultsForSearch: Infinity,
      dropdownCssClass: "pagination-dropdown",
    });

    field.classList.add("is-select2-ready");

    selectElement.on("select2:open.pagination", () => {
      field.classList.add("is-select2-open");
    });

    selectElement.on("select2:close.pagination", () => {
      field.classList.remove("is-select2-open");
    });
  });
}
