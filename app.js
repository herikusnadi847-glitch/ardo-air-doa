export const PRICE_PER_GALON = 10000;
export const WHATSAPP_NUMBER = "6287839523930";

const numberFormat = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const rupiah = (amount) => `Rp${numberFormat.format(amount)}`;

export function buildOrderMessage(order) {
  const lines = [
    "Halo ARDO, saya ingin memesan air galon:",
    "",
    `Nama: ${order.name.trim()}`,
    `Alamat: ${order.address.trim()}`,
    `Jumlah: ${order.quantity} galon`,
    `Hari pengantaran: ${order.deliveryDay}`,
    `Total: ${rupiah(order.quantity * PRICE_PER_GALON)}`,
    `Langganan mingguan: ${order.weeklySubscription ? "Ya" : "Tidak"}`,
  ];

  if (order.note.trim()) {
    lines.push(`Catatan: ${order.note.trim()}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(order) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage(order))}`;
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#order-form");
  const quantityOutput = document.querySelector("#quantity-value");
  const totalOutput = document.querySelector("#order-total");
  const quantityMinimum = 1;
  const quantityMaximum = 99;
  let quantity = quantityMinimum;

  const renderQuantity = () => {
    quantityOutput.textContent = String(quantity);
    totalOutput.textContent = rupiah(quantity * PRICE_PER_GALON);
  };

  document.querySelector("#quantity-minus").addEventListener("click", () => {
    quantity = Math.max(quantityMinimum, quantity - 1);
    renderQuantity();
  });

  document.querySelector("#quantity-plus").addEventListener("click", () => {
    quantity = Math.min(quantityMaximum, quantity + 1);
    renderQuantity();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const url = buildWhatsAppUrl({
      name: String(data.get("name") ?? ""),
      address: String(data.get("address") ?? ""),
      quantity,
      deliveryDay: String(data.get("deliveryDay") ?? ""),
      note: String(data.get("note") ?? ""),
      weeklySubscription: data.has("weeklySubscription"),
    });

    window.open(url, "_blank", "noopener,noreferrer");
  });

  document.querySelector("#current-year").textContent = String(new Date().getFullYear());
  renderQuantity();
}
