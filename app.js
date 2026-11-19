const MAX_CANDIDATES = 52;

// Extra real places near Ajou University, merged with the API results so
// the nearby table can show more than the 15 places Kakao returns per call.
const SUPPLEMENTARY_PLACES = [
  { id: "extra-songrim", name: "송림식당", category: "음식점 > 한식 > 백반", roadAddress: "경기 수원시 영통구 월드컵로193번길 21", phone: "031-213-6116", distanceMeters: 600 },
  { id: "extra-hosikdang", name: "호식당 아주대점", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주로 20", phone: "031-507-1370-5524", distanceMeters: 520 },
  { id: "extra-jipsin", name: "짚신매운갈비찜 아주대점", category: "음식점 > 한식 > 육류,고기요리", roadAddress: "경기 수원시 영통구 아주로 14-5", phone: "", distanceMeters: 540 },
  { id: "extra-sogo", name: "소고 아주대점", category: "음식점 > 일식 > 돈까스,우동", roadAddress: "경기 수원시 영통구 아주대 정문 골목", phone: "", distanceMeters: 350 },
  { id: "extra-eggmon", name: "에그몬 수원아주대병원점", category: "음식점 > 간식", roadAddress: "경기 수원시 영통구 월드컵로 164", phone: "", distanceMeters: 480 },
  { id: "extra-ttungbo", name: "뚱보돈까스", category: "음식점 > 일식 > 돈까스,우동", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 400 },
  { id: "extra-poke", name: "포케웨이타코웨이 아주대점", category: "음식점 > 양식 > 멕시칸", roadAddress: "경기 수원시 영통구 월드컵로193번길 7", phone: "", distanceMeters: 620 },
  { id: "extra-ajudon", name: "아주돈", category: "음식점 > 한식 > 육류,고기요리", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 700 },
  { id: "extra-kkungnyao", name: "꿍냐우", category: "음식점 > 아시안 > 쌀국수", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 680 },
  { id: "extra-eommatang", name: "엄마동태", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 750 },
  { id: "extra-dongari", name: "동아리즉석떡볶이", category: "음식점 > 분식 > 떡볶이", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 300 },
  { id: "extra-ttungbo-ajussi", name: "뚱보아저씨수제돈까스 아주대점", category: "음식점 > 일식 > 돈까스,우동", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 320 },
  { id: "extra-umanjokbal", name: "우만동족발집 아주대점", category: "음식점 > 한식 > 족발,보쌈", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 760 },
  { id: "extra-keunjip", name: "큰집멸치국수", category: "음식점 > 한식 > 국수", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 520 },
  { id: "extra-gyudongjip", name: "규동집 아주대점", category: "음식점 > 일식 > 덮밥", roadAddress: "경기 수원시 팔달구 아주로47번길 23", phone: "", distanceMeters: 560 },
  { id: "extra-ajukalsu", name: "아주칼국수", category: "음식점 > 한식 > 국수", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 300 },
  { id: "extra-jjokjjo", name: "쪼쪼", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 410 },
  { id: "extra-madamhao", name: "마담하오", category: "음식점 > 중식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 480 },
  { id: "extra-sarangjip", name: "사랑집", category: "음식점 > 한식 > 육류,고기요리", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 390 },
  { id: "extra-jeil", name: "제일참개백반", category: "음식점 > 한식 > 백반", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 440 },
  { id: "extra-ssammara", name: "쌈마라 아주대직영점", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 360 },
  { id: "extra-hanjogak", name: "한조각", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 500 },
  { id: "extra-umanjumeok", name: "우만주먹", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 740 },
  { id: "extra-halmeoni", name: "할머니부대찌개", category: "음식점 > 한식 > 찌개", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 450 },
  { id: "extra-harupoke", name: "하루포케 수원아주대점", category: "음식점 > 양식 > 샐러드", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 380 },
  { id: "extra-gateun", name: "같은 아주대점", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 470 },
  { id: "extra-bonuri", name: "본우리반상 아주대병원점", category: "음식점 > 한식 > 반상", roadAddress: "경기 수원시 영통구 아주대학교병원 인근", phone: "", distanceMeters: 490 },
  { id: "extra-doiramen", name: "도이라멘", category: "음식점 > 일식 > 라멘", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 530 },
  { id: "extra-kkulmul", name: "꿀우물", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 610 },
  { id: "extra-saengsamgyeop", name: "생삼겹살 연어 원천점", category: "음식점 > 한식 > 육류,고기요리", roadAddress: "경기 수원시 영통구 원천동 인근", phone: "", distanceMeters: 690 },
  { id: "extra-machai", name: "마차이짬뽕 아주대점", category: "음식점 > 중식 > 짬뽕", roadAddress: "경기 수원시 팔달구 우만동 573-6", phone: "", distanceMeters: 760 },
  { id: "extra-sandeomi", name: "산더미 미성돈지국밥 아주대점", category: "음식점 > 한식 > 국밥", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 640 },
  { id: "extra-jiopasta", name: "지오파스타", category: "음식점 > 양식 > 파스타", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 570 },
  { id: "extra-dalgumasil", name: "김종근의달구마실", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 710 },
  { id: "extra-mugyo", name: "무교동일품순두부", category: "음식점 > 한식 > 순두부", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 660 },
  { id: "extra-gaya", name: "가야지양평해장국 광교점", category: "음식점 > 한식 > 해장국", roadAddress: "경기 수원시 영통구 광교 인근", phone: "", distanceMeters: 820 },
  { id: "extra-giul", name: "기울어진배기", category: "음식점 > 한식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 540 },
  { id: "extra-byeolmi", name: "별미분식", category: "음식점 > 분식", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 340 },
  { id: "extra-hankkeut", name: "한끗셀프덮밥 아주대병원점", category: "음식점 > 한식 > 덮밥", roadAddress: "경기 수원시 영통구 아주대학교병원 인근", phone: "", distanceMeters: 510 },
  { id: "extra-mageutteum", name: "맑으뜸회연어", category: "음식점 > 일식 > 회", roadAddress: "경기 수원시 영통구 아주대학교 인근", phone: "", distanceMeters: 780 },
];

// The fallback list uses real places returned by the Kakao Local API.
const demoRecommendations = [
  {
    id: "1935664028",
    dish: "떡볶이",
    restaurant: "감탄떡볶이 아주대학교점",
    category: "분식",
    price: 9000,
    distance: 104,
    reason: "아주대 정문 근처에서 매콤한 분식이 생각날 때 좋아요.",
    tags: ["분식", "매콤한 메뉴"],
    emoji: "🍢",
    color: "#f6e3d5",
    hours: "영업 정보 확인 필요",
    query: "감탄떡볶이 아주대학교점",
  },
  {
    id: "955122915",
    dish: "수제버거",
    restaurant: "바겟버거 수원아주대점",
    category: "햄버거",
    price: 10500,
    distance: 108,
    reason: "든든한 버거 한 끼를 찾는 날 추천해요.",
    tags: ["양식", "든든한 한 끼"],
    emoji: "🍔",
    color: "#f9e6c9",
    hours: "영업 정보 확인 필요",
    query: "바겟버거 수원아주대점",
  },
  {
    id: "161342189",
    dish: "양식 요리",
    restaurant: "코너스톤",
    category: "양식",
    price: 12000,
    distance: 156,
    reason: "교내에서 양식 요리를 즐기고 싶을 때 좋아요.",
    tags: ["양식", "교내 식당"],
    emoji: "🍝",
    color: "#f2e5d9",
    hours: "031-219-2287",
    query: "코너스톤 아주대학교",
  },
  {
    id: "9211061",
    dish: "간식",
    restaurant: "다산관스넥",
    category: "간식",
    price: 4000,
    distance: 157,
    reason: "가볍게 먹을 간식을 찾을 때 들르기 좋아요.",
    tags: ["간식", "가벼운 한 끼"],
    emoji: "🍪",
    color: "#f6eccf",
    hours: "영업 정보 확인 필요",
    query: "다산관스넥 아주대학교",
  },
  {
    id: "11103969",
    dish: "학생식당 한 끼",
    restaurant: "아주대학교 기숙사식당",
    category: "구내식당",
    price: 7000,
    distance: 193,
    reason: "가성비 있는 한 끼를 찾는 학생에게 좋아요.",
    tags: ["구내식당", "가성비"],
    emoji: "🍱",
    color: "#e8eee0",
    hours: "영업 정보 확인 필요",
    query: "아주대학교 기숙사식당",
  },
  {
    id: "2050956794",
    dish: "분식 한 끼",
    restaurant: "팔달관스넥",
    category: "분식",
    price: 6000,
    distance: 216,
    reason: "교내에서 간편하게 분식을 즐기기 좋아요.",
    tags: ["분식", "교내 식당"],
    emoji: "🍢",
    color: "#f6e3d5",
    hours: "영업 정보 확인 필요",
    query: "팔달관스넥 아주대학교",
  },
  {
    id: "2041247700",
    dish: "베이커리",
    restaurant: "파리바게뜨 아주대병원점",
    category: "제과·베이커리",
    price: 8000,
    distance: 397,
    reason: "빵과 커피로 가볍게 한 끼를 해결하고 싶을 때 좋아요.",
    tags: ["베이커리", "간식"],
    emoji: "🥐",
    color: "#f6eccf",
    hours: "031-212-8215",
    query: "파리바게뜨 아주대병원점",
  },
  {
    id: "1854907049",
    dish: "설렁탕",
    restaurant: "한촌설렁탕 아주대병원점",
    category: "한식",
    price: 11000,
    distance: 406,
    reason: "따뜻한 국물 한 그릇이 생각나는 날 추천해요.",
    tags: ["한식", "따뜻한 국물"],
    emoji: "🍲",
    color: "#f3e4d9",
    hours: "031-219-4203",
    query: "한촌설렁탕 아주대병원점",
  },
  {
    id: "1345424704",
    dish: "김밥·분식",
    restaurant: "바르다김선생 아주대병원점",
    category: "분식",
    price: 9000,
    distance: 415,
    reason: "김밥과 분식을 간편하게 즐기고 싶을 때 좋아요.",
    tags: ["분식", "김밥"],
    emoji: "🍙",
    color: "#f6e3d5",
    hours: "031-212-8213",
    query: "바르다김선생 아주대병원점",
  },
  {
    id: "2100868842",
    dish: "간식",
    restaurant: "유신고매점",
    category: "간식",
    price: 4000,
    distance: 422,
    reason: "작은 간식으로 배를 채우고 싶을 때 좋아요.",
    tags: ["간식", "편의"],
    emoji: "🍬",
    color: "#f6eccf",
    hours: "영업 정보 확인 필요",
    query: "유신고매점 아주대학교",
  },
  {
    id: "964867646",
    dish: "돈까스·우동",
    restaurant: "카츠후유",
    category: "일식",
    price: 10500,
    distance: 426,
    reason: "바삭한 돈까스와 따뜻한 우동이 당기는 날 추천해요.",
    tags: ["일식", "돈까스"],
    emoji: "🍛",
    color: "#f2e7d8",
    hours: "031-546-1550",
    query: "카츠후유 아주대학교",
  },
  {
    id: "1160577190",
    dish: "햄버거",
    restaurant: "버거킹 아주대병원점",
    category: "패스트푸드",
    price: 9500,
    distance: 430,
    reason: "빠르고 든든한 버거 한 끼를 찾을 때 좋아요.",
    tags: ["패스트푸드", "버거"],
    emoji: "🍔",
    color: "#f9e6c9",
    hours: "031-215-2256",
    query: "버거킹 아주대병원점",
  },
];

// First photo from each place's Kakao Map detail page (og:image).
const DEMO_PLACE_PHOTOS = {
  "1935664028": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyMzEyMDNfMjUz%2FMDAxNzAxNTc4NDY3ODg3.dl3IoV_bt3BaPQghumvO_Yx9_EYfyb0IhTa3IWGmQDgg.HlM50xzad72qh4F0Efpr2vhInbgW_djUnr7cFq5R_vEg.PNG.kalista25%2Fimage.png%3Ftype%3Dw773",
  "955122915": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fa075bfd43b4ba73e67e0cdd824d837de9e10b166%3Foriginal",
  "161342189": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fa3bc1cb21a33e5b5723a6c1f3b41f54fd2007940%3Foriginal",
  "9211061": "https://staticmap.kakao.com/staticmap/og?type=place&srs=wgs84&size=400x200&service=placeweb&m=127.0478300989488%2C37.28312026970783",
  "11103969": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNjAzMzBfMjA3%2FMDAxNzc0ODc0MDM4Njg1.f2EKPJXUme_fJYKdnJeXQOe46azz8wCxnUf9c-rA3Akg.kHbxFKv3Ag9cV9yabNhw291bOebZ2-GYrEq9BTaI5Isg.JPEG%2FIMG%25EF%25BC%25BF6874.jpg%3Ftype%3Dw580",
  "2050956794": "https://staticmap.kakao.com/staticmap/og?type=place&srs=wgs84&size=400x200&service=placeweb&m=127.04442985795622%2C37.284361424561716",
  "2041247700": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNDA3MTVfMjQ5%2FMDAxNzIxMDQwMjQ1MjUz.A_QVfxTDSa2pwVmYkxBJZIe-QmCDdDoZ6We6uQ3U43Ig.4o3RyTVXifCHwo7bd6eILfp6N9hxrmsPgLiUZWzwqucg.JPEG%2FIMG_4766.jpg%3Ftype%3Dw966",
  "1854907049": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNjA1MjBfMTU1%2FMDAxNzc5Mjg3MDE0NDA3.45eHdP4KgaL2VSFsuXUNB9g1I2TDgw3o2-SWc0qASIQg.3eKXgSARIqj3Ab1bDcOyxoaKcJeNlLx6aYdyTW1yxBgg.JPEG%2FSE-4E8C0FF7-7E7D-4DB7-8406-9CAFD2499E23.jpg%3Ftype%3Dw773",
  "1345424704": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F825afdb1a10c4d7a372d2d3f6d3210e2aa06a2fa%3Foriginal",
  "2100868842": "https://staticmap.kakao.com/staticmap/og?type=place&srs=wgs84&size=400x200&service=placeweb&m=127.04134803095272%2C37.28243071324337",
  "964867646": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2FB7562C3B2A1D4E0F80EF8A9865CFBE7B",
  "1160577190": "https://img1.kakaocdn.net/cthumb/local/C800x400.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNjA2MTFfMTcg%2FMDAxNzgxMTM0ODEyMTY3.cCHFlrRwGRY3rz3DHTFv7StohJf6o0t7KVjh3bVwcC8g.E4XCZeCPsWx7_PX4HyRd7E8SqwIlGyvHeNBW0BAwx4gg.JPEG%2F900_1781134590234.jpg%3Ftype%3Dw386",
};

// Kakao uses a static map image as og:image when a place has no real photo.
// Only treat non-map images as food photos; otherwise fall back to the emoji.
function isFoodPhoto(url) {
  if (!url) return false;
  if (url.includes("staticmap.kakao.com")) return false;
  return url.includes("kakaocdn.net") || url.includes("pstatic.net");
}

// Match a food illustration to the place category/name for the nearby cards.
const FOOD_PICTURES = [
  { pattern: /떡볶이|분식|김밥|스넥/, emoji: "🍢", color: "#f6e3d5" },
  { pattern: /버거|패스트푸드|햄버거/, emoji: "🍔", color: "#f9e6c9" },
  { pattern: /돈까스|우동|일식/, emoji: "🍛", color: "#f2e7d8" },
  { pattern: /쌀국수|아시안|라멘|면/, emoji: "🍜", color: "#e8eee3" },
  { pattern: /설렁탕|한식|국밥|찌개|고기/, emoji: "🍲", color: "#f3e4d9" },
  { pattern: /제과|베이커리|카페|간식|커피/, emoji: "🥐", color: "#f6eccf" },
  { pattern: /구내식당|학생식당|식당/, emoji: "🍱", color: "#e8eee0" },
  { pattern: /양식|스테이크|피자/, emoji: "🍝", color: "#f2e5d9" },
];

function foodPicture(category = "", name = "") {
  const text = `${category} ${name}`;
  const match = FOOD_PICTURES.find((item) => item.pattern.test(text));
  return match ? { emoji: match.emoji, color: match.color } : { emoji: "🍽️", color: "#edf0e6" };
}

const demoSupplements = SUPPLEMENTARY_PLACES.map((place) => {
  const label = categoryLabel(place.category);
  const picture = foodPicture(place.category, place.name);
  return {
    id: place.id,
    dish: label,
    restaurant: place.name,
    category: label,
    price: 9000,
    distance: Math.round(place.distanceMeters / 100) * 100,
    reason: `${place.roadAddress}에 위치한 ${label} 식당이에요.`,
    tags: [label, "아주대 주변"],
    emoji: picture.emoji,
    color: picture.color,
    hours: place.phone || "영업 정보 확인 필요",
    query: place.name,
  };
});

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

let recommendations = [...demoRecommendations, ...demoSupplements];
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

// Kakao place-detail page (the screen shown after tapping 상세보기 in Kakao Map).
// Uses the numeric place ID when available; otherwise falls back to a name search.
function placeDetailUrl(place) {
  const placeUrl = String(place?.placeUrl || "");
  if (placeUrl.includes("place.map.kakao.com") || placeUrl.includes("place/search/detail")) {
    return placeUrl;
  }
  const id = String(place?.id || "");
  if (/^\d+$/.test(id)) {
    return `https://place.map.kakao.com/${id}`;
  }
  return mapsUrl(place?.name || place?.restaurant || place?.query || "");
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
    elements.map.href = placeDetailUrl(item);
    elements.map.setAttribute("aria-label", `${item.name} 카카오맵 상세보기`);
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
  elements.map.href = placeDetailUrl({ id: item.id, name: item.restaurant, query: item.query, placeUrl: item.placeUrl });
  elements.map.setAttribute("aria-label", `${item.restaurant} 예시, 카카오맵 상세보기`);
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
        ${isFoodPhoto(DEMO_PLACE_PHOTOS[item.id])
          ? `<img src="${DEMO_PLACE_PHOTOS[item.id]}" alt="" loading="lazy" onerror="this.onerror=null;this.outerHTML='<span class=&quot;menu-card-emoji&quot;>${item.emoji}</span>'" />`
          : `<span class="menu-card-emoji">${item.emoji}</span>`}
      </div>
      <div class="menu-card-copy">
        <span class="menu-card-category">${item.category} · 예시</span>
        <h3>${item.dish}</h3>
        <p class="menu-card-restaurant">${item.restaurant} (예시)</p>
        <div class="menu-card-bottom">
          <span class="menu-card-price">약 ${item.price.toLocaleString("ko-KR")}원</span>
          <span class="menu-card-distance">도보 ${item.distance}분 (예시)</span>
        </div>
        <a class="card-map-link" href="${placeDetailUrl({ id: item.id, name: item.restaurant, query: item.query, placeUrl: item.placeUrl })}" target="_blank" rel="noopener noreferrer" aria-label="${item.restaurant} 카카오맵 상세보기">카카오맵 상세보기 ↗</a>
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

    const picture = foodPicture(place.category, place.name);
    const visual = createTextElement("div", "menu-card-visual", "");
    visual.style.setProperty("--tile-bg", picture.color);
    visual.setAttribute("aria-hidden", "true");

    if (isFoodPhoto(place.photoUrl)) {
      const photo = document.createElement("img");
      photo.src = place.photoUrl;
      photo.alt = "";
      photo.loading = "lazy";
      photo.onerror = () => {
        photo.replaceWith(createTextElement("span", "menu-card-emoji", picture.emoji));
      };
      visual.append(photo);
    } else {
      visual.append(createTextElement("span", "menu-card-emoji", picture.emoji));
    }

    const copy = createTextElement("div", "menu-card-copy", "");
    const category = createTextElement("span", "menu-card-category", `${categoryLabel(place.category)} · 카카오 장소`);
    const name = createTextElement("h3", "", place.name);
    const address = createTextElement("p", "menu-card-restaurant", place.roadAddress || place.address || "주소 정보 없음");
    const bottom = createTextElement("div", "menu-card-bottom", "");
    bottom.append(
      createTextElement("span", "menu-card-distance", `${formatDistance(place.distanceMeters)} · 직선거리`),
    );

    const link = createTextElement("a", "card-map-link", "카카오맵에서 보기 ↗");
    link.href = placeDetailUrl(place);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${place.name}, 카카오맵 상세보기`);

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
    photoUrl: String(place.photoUrl || ""),
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
    const apiPlaces = Array.isArray(payload.places) ? payload.places.map(normalizePlace) : [];
    // Use only real Kakao places so every card opens a place-detail page.
    const places = apiPlaces.slice(0, MAX_CANDIDATES);
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
