const restaurants = [
  {
    id: "jeyuk",
    dish: "제육덮밥",
    restaurant: "정문 한식당",
    category: "한식",
    price: 9000,
    distance: 7,
    reason: "든든하게 먹고 싶은 날, 매콤한 한 그릇으로 에너지 충전!",
    tags: ["든든한 한 끼", "매콤한 메뉴"],
    emoji: "🍚",
    color: "#f3e9d7",
    hours: "영업 정보 확인 필요",
    query: "아주대학교 제육덮밥",
  },
  {
    id: "pork-cutlet",
    dish: "등심 돈까스",
    restaurant: "캠퍼스 돈까스",
    category: "일식",
    price: 10500,
    distance: 5,
    reason: "바삭한 튀김옷과 든든한 한 접시가 생각나는 날 추천해요.",
    tags: ["바삭한 식감", "든든한 한 끼"],
    emoji: "🍛",
    color: "#f2e5d9",
    hours: "영업 정보 확인 필요",
    query: "아주대학교 돈까스",
  },
  {
    id: "pho",
    dish: "양지 쌀국수",
    restaurant: "포포 쌀국수",
    category: "아시안",
    price: 11000,
    distance: 8,
    reason: "따뜻하고 깔끔한 국물로 편안하게 한 끼 하고 싶을 때 좋아요.",
    tags: ["따뜻한 국물", "아시안 푸드"],
    emoji: "🍜",
    color: "#e8eee3",
    hours: "영업 정보 확인 필요",
    query: "아주대학교 쌀국수",
  },
  {
    id: "stew",
    dish: "김치찌개 정식",
    restaurant: "한상 찌개집",
    category: "한식",
    price: 9500,
    distance: 6,
    reason: "밥과 반찬까지 든든하게 챙기고 싶은 날의 익숙한 선택!",
    tags: ["따뜻한 국물", "밥 한 끼"],
    emoji: "🥘",
    color: "#f1e6df",
    hours: "영업 정보 확인 필요",
    query: "아주대학교 김치찌개",
  },
  {
    id: "bibimbap",
    dish: "나물 비빔밥",
    restaurant: "초록 한그릇",
    category: "한식",
    price: 9500,
    distance: 10,
    reason: "다양한 재료를 한 그릇에, 가볍고 균형 있게 즐겨보세요.",
    tags: ["채소 듬뿍", "산뜻한 한 끼"],
    emoji: "🥗",
    color: "#e8eee0",
    hours: "영업 정보 확인 필요",
    query: "아주대학교 비빔밥",
  },
  {
    id: "ramen",
    dish: "돈코츠 라멘",
    restaurant: "라멘 한 그릇",
    category: "일식",
    price: 10500,
    distance: 12,
    reason: "진한 국물과 면이 당기는 날, 따끈한 라멘 한 그릇 어때요?",
    tags: ["진한 국물", "면 요리"],
    emoji: "🍜",
    color: "#f2ebd9",
    hours: "영업 정보 확인 필요",
    query: "아주대학교 라멘",
  },
];

const elements = {
  date: document.querySelector("#today-date"),
  dish: document.querySelector("#dish-name"),
  reason: document.querySelector("#dish-reason"),
  tags: document.querySelector("#dish-tags"),
  restaurant: document.querySelector("#restaurant-name"),
  visitRestaurant: document.querySelector("#visit-restaurant"),
  price: document.querySelector("#dish-price"),
  location: document.querySelector("#restaurant-location"),
  hours: document.querySelector("#restaurant-hours"),
  map: document.querySelector("#map-link"),
  grid: document.querySelector("#menu-grid"),
  reroll: document.querySelector("#reroll-button"),
  count: document.querySelector("#reroll-count"),
  toast: document.querySelector("#toast"),
};

let currentIndex = getDailyIndex();
let seenIndexes = new Set([currentIndex]);
let toastTimer;

function getDailyIndex() {
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const dateKey = ["year", "month", "day"]
    .map((type) => dateParts.find((part) => part.type === type)?.value ?? "")
    .join("-");
  let hash = 0;
  for (const char of dateKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % restaurants.length;
}

function formatPrice(price) {
  return `약 ${price.toLocaleString("ko-KR")}원`;
}

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function renderRecommendation(index) {
  const item = restaurants[index];
  currentIndex = index;
  elements.dish.textContent = item.dish;
  elements.reason.textContent = item.reason;
  elements.tags.replaceChildren(...item.tags.map((tag) => {
    const span = document.createElement("span");
    span.className = "dish-tag";
    span.textContent = tag;
    return span;
  }));

  elements.restaurant.innerHTML = `${item.restaurant} <span class="sample-label">예시</span>`;
  elements.visitRestaurant.innerHTML = `${item.restaurant} <span class="sample-label">예시</span>`;
  elements.price.textContent = formatPrice(item.price);
  elements.location.textContent = `아주대학교 정문 주변 · 도보 약 ${item.distance}분 (예시)`;
  elements.hours.textContent = item.hours;
  elements.map.href = mapsUrl(item.query);
  elements.map.setAttribute("aria-label", `${item.restaurant} 예시, 지도에서 검색`);
  elements.count.textContent = `오늘의 추천 ${seenIndexes.size} / ${restaurants.length}`;
  elements.reroll.disabled = seenIndexes.size >= restaurants.length;
  elements.reroll.setAttribute("aria-label", `${item.dish} 대신 다른 메뉴 다시 뽑기`);
  document.title = `${item.dish} 추천 — 아주한끼`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2400);
}

function rerollRecommendation() {
  const available = restaurants
    .map((_, index) => index)
    .filter((index) => !seenIndexes.has(index));

  if (!available.length) {
    showToast("오늘 준비한 메뉴를 모두 확인했어요. 내일 또 만나요!");
    return;
  }

  const nextIndex = available[Math.floor(Math.random() * available.length)];
  seenIndexes.add(nextIndex);
  renderRecommendation(nextIndex);
  showToast(`${restaurants[nextIndex].dish}, 오늘의 새로운 추천이에요!`);
}

function renderMenuGrid() {
  elements.grid.replaceChildren(...restaurants.map((item, index) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.innerHTML = `
      <div class="menu-card-visual" style="--tile-bg:${item.color}" aria-hidden="true">
        <span class="menu-card-emoji">${item.emoji}</span>
      </div>
      <div class="menu-card-copy">
        <span class="menu-card-category">${item.category} · 예시</span>
        <h3>${item.dish}</h3>
        <p class="menu-card-restaurant">${item.restaurant} (예시)</p>
        <div class="menu-card-bottom">
          <span class="menu-card-price">약 ${item.price.toLocaleString("ko-KR")}원</span>
          <span class="menu-card-distance">도보 ${item.distance}분 (예시)</span>
        </div>
        <a class="card-map-link" href="${mapsUrl(item.query)}" target="_blank" rel="noopener noreferrer" aria-label="${item.dish} 주변 식당 지도에서 검색">주변 식당 지도 검색 ↗</a>
      </div>
    `;
    card.dataset.index = String(index);
    return card;
  }));
}

function renderDate() {
  elements.date.textContent = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

elements.reroll.addEventListener("click", rerollRecommendation);
renderDate();
renderRecommendation(currentIndex);
renderMenuGrid();
