import api from "../api/api";
import { firebaseUserToken } from "../firebase/auth";

async function getGoogleTokenWithAuthCode(code) {
  const data = { code };
  const token = await firebaseUserToken();
  const response = await api.post("/google/auth", data, {
    headers: { Authorization: token },
  });
  return response.data;
}

function getGoogleClassroomAuthUrl() {
  const clientId =
    "509264289385-ghng06ld79ith85khod9j9ot6v9njb69.apps.googleusercontent.com";
  const redirectUri = encodeURIComponent(
    "https://co-prof-5f18e.web.app/authorization"
  );
  const scopes = encodeURIComponent(
    [
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.students",
      "https://www.googleapis.com/auth/classroom.rosters.readonly",
    ].join(" ")
  );
  const responseType = "code";
  const accessType = "offline";
  const prompt = "consent";

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=${scopes}&` +
    `response_type=${responseType}&` +
    `access_type=${accessType}&` +
    `prompt=${prompt}`;

  return authUrl;
}

export { getGoogleTokenWithAuthCode, getGoogleClassroomAuthUrl };
