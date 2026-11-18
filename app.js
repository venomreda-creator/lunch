const MAX_CANDIDATES = 12;

const demoRecommendations = [
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
  recommendationLabel: document.querySelector("#recommendation-label"),
  restaurant: document.querySelector("#restaurant-name"),
  visitRestaurant: document.querySelector("#visit-restaurant"),
  summaryLabel: document.querySelector("#summary-label"),
  priceLabel: document.querySelector("#price-label"),
  price: document.querySelector("#dish-price"),
  location: document.querySelector("#restaurant-location"),
  hours: document.querySelector("#restaurant-hours"),
  map: document.querySelector("#map-link"),
  checkedDate: document.querySelector("#checked-date"),
  grid: document.querySelector("#menu-grid"),
  nearbyTitle: document.querySelector("#nearby-title"),
  nearbyDescription: document.querySelector("#nearby-description"),
  notice: document.querySelector("#data-notice-copy"),
  footerNote: document.querySelector("#footer-note"),
  reroll: document.querySelector("#reroll-button"),
  count: document.querySelector("#reroll-count"),
  toast: document.querySelector("#toast"),
};

let recommendations = demoRecommendations;
let dataMode = "demo";
let currentIndex = getDailyIndex(recommendations.length);
let seenIds = new Set([recommendations[currentIndex].id]);
let toastTimer;

function getDailyIndex(length) {
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
  return length ? hash % length : 0;
}

function formatPrice(price) {
  return `약 ${price.toLocaleString("ko-KR")}원`;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "거리 정보 없음";
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
}

function mapsUrl(query) {
  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}

function categoryLabel(category = "음식점") {
  return category.split(">").at(-1)?.trim() || "음식점";
}

function setNotice(mode) {
  if (mode === "live") {
    elements.notice.innerHTML = "<strong>카카오 장소 정보 연결됨</strong> — 식당명·주소·업종·직선거리를 표시합니다. 메뉴·가격·영업시간은 API에서 제공되지 않아 별도 확인이 필요해요.";
    elements.footerNote.textContent = "식당 위치는 카카오 Local API, 메뉴·가격·영업시간은 별도 확인이 필요합니다.";
    elements.nearbyTitle.innerHTML = "아주대 주변 <span>음식점</span>";
    elements.nearbyDescription.textContent = "카카오 장소 검색 결과를 거리순으로 보여드려요. 거리는 직선거리 기준입니다.";
    return;
  }

  elements.notice.innerHTML = "<strong>미리보기 데이터</strong> — 아직 API 주소가 설정되지 않았습니다. 아래 메뉴·식당 정보는 화면 확인용 예시입니다.";
  elements.footerNote.textContent = "현재 메뉴·식당 정보는 예시 데이터입니다.";
  elements.nearbyTitle.innerHTML = "오늘의 추천 후보 <span>둘러보기</span>";
  elements.nearbyDescription.innerHTML = "아주대 주변에서 만날 수 있는<br />다양한 한 끼를 준비했어요.";
}

function renderTags(tags) {
  elements.tags.replaceChildren(...tags.map((tag) => {
    const span = document.createElement("span");
    span.className = "dish-tag";
    span.textContent = tag;
    return span;
  }));
}

function renderRecommendation(index) {
  const item = recommendations[index];
  currentIndex = index;

  if (dataMode === "live") {
    const category = categoryLabel(item.category);
    elements.recommendationLabel.textContent = "오늘의 식당 추천 · 메뉴 정보 미제공";
    elements.dish.textContent = item.name;
    elements.reason.textContent = `${category} · 아주대학교 기준 ${formatDistance(item.distanceMeters)} 직선거리. 가까운 음식점 중 하나를 골랐어요.`;
    renderTags([category, `${formatDistance(item.distanceMeters)} 직선거리`]);
    elements.restaurant.textContent = category;
    elements.visitRestaurant.textContent = item.name;
    elements.summaryLabel.textContent = "업종";
    elements.priceLabel.textContent = "메뉴·가격";
    elements.price.textContent = "별도 확인 필요";
    elements.location.textContent = item.roadAddress || item.address || "주소 정보 없음";
    elements.hours.textContent = item.phone ? `전화 ${item.phone} · 영업시간 미제공` : "영업시간 정보 미제공";
    elements.map.href = item.placeUrl || mapsUrl(item.name);
    elements.map.setAttribute("aria-label", `${item.name} 카카오맵에서 보기`);
    elements.checkedDate.textContent = "카카오 장소 검색 결과";
    elements.count.textContent = `오늘의 추천 ${seenIds.size} / ${recommendations.length}`;
    elements.reroll.disabled = seenIds.size >= recommendations.length;
    elements.reroll.setAttribute("aria-label", `${item.name} 대신 다른 식당 다시 추천`);
    document.title = `${item.name} 추천 — 아주한끼`;
    return;
  }

  elements.recommendationLabel.textContent = "오늘의 추천 메뉴";
  elements.dish.textContent = item.dish;
  elements.reason.textContent = item.reason;
  renderTags(item.tags);
  elements.restaurant.innerHTML = `${item.restaurant} <span class="sample-label">예시</span>`;
  elements.visitRestaurant.innerHTML = `${item.restaurant} <span class="sample-label">예시</span>`;
  elements.summaryLabel.textContent = "추천 식당";
  elements.priceLabel.textContent = "가격대";
  elements.price.textContent = formatPrice(item.price);
  elements.location.textContent = `아주대학교 정문 주변 · 도보 약 ${item.distance}분 (예시)`;
  elements.hours.textContent = item.hours;
  elements.map.href = mapsUrl(item.query);
  elements.map.setAttribute("aria-label", `${item.restaurant} 예시, 지도에서 검색`);
  elements.checkedDate.textContent = "정보 확인일: 예시";
  elements.count.textContent = `오늘의 추천 ${seenIds.size} / ${recommendations.length}`;
  elements.reroll.disabled = seenIds.size >= recommendations.length;
  elements.reroll.setAttribute("aria-label", `${item.dish} 대신 다른 메뉴 다시 뽑기`);
  document.title = `${item.dish} 추천 — 아주한끼`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2800);
}

function rerollRecommendation() {
  const available = recommendations
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !seenIds.has(item.id));

  if (!available.length) {
    showToast("오늘 준비한 추천을 모두 확인했어요. 내일 또 만나요!");
    return;
  }

  const next = available[Math.floor(Math.random() * available.length)];
  seenIds.add(next.item.id);
  renderRecommendation(next.index);
  showToast(dataMode === "live" ? `${next.item.name}을(를) 추천해요.` : `${next.item.dish}, 오늘의 새로운 추천이에요!`);
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderDemoGrid() {
  elements.grid.replaceChildren(...recommendations.map((item, index) => {
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

function renderLiveGrid(places) {
  elements.grid.replaceChildren(...places.map((place) => {
    const card = document.createElement("article");
    card.className = "menu-card live-place-card";

    const visual = createTextElement("div", "menu-card-visual", "🍽️");
    visual.style.setProperty("--tile-bg", "#edf0e6");
    visual.setAttribute("aria-hidden", "true");

    const copy = createTextElement("div", "menu-card-copy", "");
    const category = createTextElement("span", "menu-card-category", `${categoryLabel(place.category)} · 카카오 장소`);
    const name = createTextElement("h3", "", place.name);
    const address = createTextElement("p", "menu-card-restaurant", place.roadAddress || place.address || "주소 정보 없음");
    const bottom = createTextElement("div", "menu-card-bottom", "");
    bottom.append(
      createTextElement("span", "menu-card-distance", `${formatDistance(place.distanceMeters)} · 직선거리`),
      createTextElement("span", "menu-card-price", "메뉴·가격 별도 확인"),
    );

    const link = createTextElement("a", "card-map-link", "카카오맵에서 보기 ↗");
    link.href = place.placeUrl || mapsUrl(place.name);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${place.name}, 카카오맵에서 보기`);

    copy.append(category, name, address, bottom, link);
    card.append(visual, copy);
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

function normalizePlace(place) {
  return {
    id: String(place.id),
    name: String(place.name || "이름 미상 식당"),
    category: String(place.category || "음식점"),
    address: String(place.address || ""),
    roadAddress: String(place.roadAddress || ""),
    phone: String(place.phone || ""),
    placeUrl: String(place.placeUrl || ""),
    distanceMeters: Number(place.distanceMeters) || 0,
  };
}

async function loadLivePlaces() {
  const base = String(window.AJOU_PLACES_API_BASE || "").trim().replace(/\/$/, "");
  if (!base) return;

  try {
    const response = await fetch(`${base}/api/places`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`API returned ${response.status}`);

    const payload = await response.json();
    const places = Array.isArray(payload.places)
      ? payload.places.slice(0, MAX_CANDIDATES).map(normalizePlace)
      : [];
    if (!places.length) throw new Error("No nearby places returned");

    dataMode = "live";
    recommendations = places;
    currentIndex = getDailyIndex(recommendations.length);
    seenIds = new Set([recommendations[currentIndex].id]);
    setNotice("live");
    renderRecommendation(currentIndex);
    renderLiveGrid(places);
  } catch (error) {
    console.error("Nearby restaurant lookup failed.", error);
    setNotice("demo");
    showToast("실제 식당 정보를 불러오지 못해 예시 화면을 표시합니다.");
  }
}

elements.reroll.addEventListener("click", rerollRecommendation);
renderDate();
setNotice("demo");
renderRecommendation(currentIndex);
renderDemoGrid();
loadLivePlaces();
