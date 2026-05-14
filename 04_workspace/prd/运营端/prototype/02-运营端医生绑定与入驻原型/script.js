const tabs = document.querySelectorAll("[data-status]");
const orders = document.querySelectorAll("[data-order-status]");
const scanButton = document.querySelector("[data-scan]");
const toast = document.querySelector(".toast");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const status = tab.dataset.status;

    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    orders.forEach((order) => {
      const visible = status === "all" || order.dataset.orderStatus === status;
      order.hidden = !visible;
    });
  });
});

scanButton?.addEventListener("click", () => {
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
});
