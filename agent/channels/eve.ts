import { eveChannel } from "eve/channels/eve";
import { localDev, type AuthFn } from "eve/channels/auth";

const puterAuth: AuthFn<Request> = async (request) => {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return null;

  try {
    const response = await fetch("https://api.puter.com/whoami", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = (await response.json()) as { username?: string; email?: string; uuid?: string };
    const principalId = user.uuid ?? user.username ?? user.email;
    if (!principalId) return null;
    return {
      authenticator: "puter",
      issuer: "https://puter.com",
      principalId,
      principalType: "user",
      subject: principalId,
      attributes: { username: user.username ?? "", email: user.email ?? "" },
    };
  } catch {
    return null;
  }
};

export default eveChannel({
  auth: [puterAuth, localDev()],
});
