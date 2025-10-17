// === Масштабирование и перетаскивание карты с фиксом ===
const map = document.getElementById("map-image");
const container = document.querySelector(".zoom-container");

let scale = 1;
let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;

// Масштабирование колесиком мыши
map.addEventListener("wheel", (event) => {
  event.preventDefault();

  const zoomSpeed = 0.1;
  scale += event.deltaY < 0 ? zoomSpeed : -zoomSpeed;
  scale = Math.min(Math.max(scale, 1), 3);

  constrainPosition();
  updateTransform();
});

// Нажатие — начинаем перетаскивание
map.addEventListener("mousedown", (event) => {
  event.preventDefault();
  isDragging = true;
  startX = event.clientX - translateX;
  startY = event.clientY - translateY;
  map.style.cursor = "grabbing";
});

// Отпускание — завершаем перетаскивание (в любом месте страницы)
window.addEventListener("mouseup", () => {
  isDragging = false;
  map.style.cursor = "grab";
});

// Двигаем только при зажатой кнопке
window.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  translateX = event.clientX - startX;
  translateY = event.clientY - startY;

  constrainPosition();
  updateTransform();
});

// Обновление позиции и масштаба
function updateTransform() {
  map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// Ограничиваем движение, чтобы карта не выезжала
function constrainPosition() {
  const containerRect = container.getBoundingClientRect();
  const mapWidth = containerRect.width * scale;
  const mapHeight = containerRect.height * scale;

  const maxX = (mapWidth - containerRect.width) / 2;
  const maxY = (mapHeight - containerRect.height) / 2;

  if (scale > 1) {
    translateX = Math.min(Math.max(translateX, -maxX), maxX);
    translateY = Math.min(Math.max(translateY, -maxY), maxY);
  } else {
    translateX = 0;
    translateY = 0;
  }
}
