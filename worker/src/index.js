const AJOU_CENTER = Object.freeze({
  longitude: 127.04607,
  latitude: 37.282913,
});

const DEFAULT_ALLOWED_ORIGINS = [
  "https://venomreda-creator.github.io",
  "http://localhost:8000",
];

function allowedOrigins(env) {
  const configured = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const headers = new Headers({
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });

  if (origin && allowedOrigins(env).includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  return headers;
}

function jsonResponse(request, env, body, status = 200, extraHeaders = {}) {
  const headers = corsHeaders(request, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  for (const [name, value] of Object.entries(extraHeaders)) headers.set(name, value);
  return new Response(JSON.stringify(body), { status, headers });
}

function normalizePlace(place) {
  return {
    id: String(place.id),
    name: place.place_name,
    category: place.category_name,
    phone: place.phone || "",
    address: place.address_name || "",
    roadAddress: place.road_address_name || "",
    longitude: Number(place.x),
    latitude: Number(place.y),
    distanceMeters: Number(place.distance) || null,
    placeUrl: String(place.place_url || "").replace(/^http:\/\//, "https://"),
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    const origin = request.headers.get("Origin");

    if (origin && !allowedOrigins(env).includes(origin)) {
      return jsonResponse(request, env, { error: "origin_not_allowed" }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "GET") {
      return jsonResponse(request, env, { error: "not_found" }, 404);
    }

    if (url.pathname === "/api/health") {
      return jsonResponse(request, env, { ok: true, kakaoConfigured: Boolean(env.KAKAO_REST_API_KEY) });
    }

    if (url.pathname !== "/api/places") {
      return jsonResponse(request, env, { error: "not_found" }, 404);
    }

    if (!env.KAKAO_REST_API_KEY) {
      return jsonResponse(request, env, { error: "api_not_configured" }, 503);
    }

    const kakaoUrl = new URL("https://dapi.kakao.com/v2/local/search/category.json");
    kakaoUrl.searchParams.set("category_group_code", "FD6");
    kakaoUrl.searchParams.set("x", String(AJOU_CENTER.longitude));
    kakaoUrl.searchParams.set("y", String(AJOU_CENTER.latitude));
    kakaoUrl.searchParams.set("radius", "1600");
    kakaoUrl.searchParams.set("sort", "distance");
    kakaoUrl.searchParams.set("size", "15");

    async function fetchPage(page) {
      const pageUrl = new URL(kakaoUrl.toString());
      pageUrl.searchParams.set("page", String(page));
      const response = await fetch(pageUrl, {
        headers: { Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}` },
        cf: { cacheTtl: 600, cacheEverything: true },
      });
      if (!response.ok) throw new Error(`upstream ${response.status}`);
      const body = await response.json();
      return Array.isArray(body.documents) ? body.documents : [];
    }

    let documents;
    try {
      const pages = await Promise.all([1, 2, 3, 4].map(fetchPage));
      documents = pages.flat();
    } catch {
      return jsonResponse(request, env, { error: "place_search_failed" }, 502);
    }

    const unique = Array.from(new Map(documents.map((place) => [place.id, place])).values());

    const response = jsonResponse(request, env, {
      source: "kakao-local",
      center: AJOU_CENTER,
      radiusMeters: 1600,
      distanceType: "straight-line",
      places: unique.map(normalizePlace),
    }, 200, { "Cache-Control": "public, max-age=600" });
    return response;
  },
};
