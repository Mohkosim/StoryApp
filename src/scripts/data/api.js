import { getAccessToken } from "../utils/auth";
import { BASE_URL } from "../config";

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  // Stories
  STORIES: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,

  // Notification
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

export async function registerUser({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}

export async function loginUser({ email, password }) {
  const data = JSON.stringify({ email, password });

  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}

export async function getAllStories() {
  const token = getAccessToken();

  const response = await fetch(ENDPOINTS.STORIES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  return {
    ...json,
    list: json.listStory || [],
    ok: response.ok,
  };
}

export async function addStory(formData) {
  const token = getAccessToken();

  const response = await fetch(ENDPOINTS.STORIES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}

export async function getStory(id) {
  const token = getAccessToken();

  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  return {
    ok: response.ok,
    message: json.message,
    data: json.story,
  };
}



export async function subscribePushNotification({
  endpoint,
  keys: { p256dh, auth },
}) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
