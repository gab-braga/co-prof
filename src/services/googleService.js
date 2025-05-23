function getGoogleClassroomAuthUrl() {
  const client_id = "509264289385-ghng06ld79ith85khod9j9ot6v9njb69.apps.googleusercontent.com";
  const redirect_uri = encodeURIComponent("https://co-prof-5f18e.web.app/authorization");
  const scopes = encodeURIComponent([
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
  ].join(" "));
  const response_type = "code";
  const access_type = "offline";
  const prompt = "consent";
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${client_id}&` +
    `redirect_uri=${redirect_uri}&` +
    `scope=${scopes}&` +
    `response_type=${response_type}&` +
    `access_type=${access_type}&` +
    `prompt=${prompt}`;
    
    return authUrl;
}

export { getGoogleClassroomAuthUrl };