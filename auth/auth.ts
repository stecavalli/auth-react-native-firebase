// auth/auth.ts
export type LoggedInUser = {
  username: string;
  email: string;
};

export async function getLoggedInUser(): Promise<LoggedInUser | null> {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user as LoggedInUser;
  } catch (err) {
    console.error("Errore nel recupero utente:", err);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Errore nel logout:", err);
  }
}
