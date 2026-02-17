import requests
from urllib.parse import urlencode, quote


from .config import (
    DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI,
    DISCORD_BOT_TOKEN, DISCORD_GUILD_ID,
    ROLE_FREE_ID, ROLE_PRO_ID, ROLE_ELITE_ID
)

print("DISCORD_CLIENT_ID:", DISCORD_CLIENT_ID)



DISCORD_API = "https://discord.com/api"

def oauth_url(state: str) -> str:
    if not DISCORD_CLIENT_ID:
        raise RuntimeError("DISCORD_CLIENT_ID is missing")
    if not DISCORD_REDIRECT_URI:
        raise RuntimeError("DISCORD_REDIRECT_URI is missing")

    params = {
    "client_id": str(DISCORD_CLIENT_ID),
    "redirect_uri": DISCORD_REDIRECT_URI,
    "response_type": "code",
    "scope": "identify guilds.join",
    "state": state,
    "prompt": "consent",
}

    return "https://discord.com/api/oauth2/authorize?" + urlencode(params, quote_via=quote)

def exchange_code(code: str) -> dict:
    if not DISCORD_CLIENT_ID:
        raise RuntimeError("DISCORD_CLIENT_ID missing")
    if not DISCORD_CLIENT_SECRET:
        raise RuntimeError("DISCORD_CLIENT_SECRET missing")
    if not DISCORD_REDIRECT_URI:
        raise RuntimeError("DISCORD_REDIRECT_URI missing")

    data = {
        "client_id": str(DISCORD_CLIENT_ID),
        "client_secret": DISCORD_CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": DISCORD_REDIRECT_URI,
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Chaistreet/1.0",
    }

    r = requests.post(f"{DISCORD_API}/oauth2/token", data=data, headers=headers, timeout=20)

    # Helpful debug if it fails
    if r.status_code != 200:
        raise RuntimeError(f"Discord token exchange failed: {r.status_code} {r.text}")

    return r.json()

def get_user(access_token: str) -> dict:
    r = requests.get(
        f"{DISCORD_API}/users/@me",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )
    r.raise_for_status()
    return r.json()

def role_for_tier(tier: str) -> str:
    t = (tier or "FREE").upper()
    if t == "ELITE":
        return ROLE_ELITE_ID
    if t == "PRO":
        return ROLE_PRO_ID
    return ROLE_FREE_ID

def add_role(discord_user_id: str, role_id: str) -> None:
    """
    Requires:
    - Bot added to your server (guild)
    - Bot permission: Manage Roles
    - User must be a member of the server already
    """
    if not (DISCORD_BOT_TOKEN and DISCORD_GUILD_ID and role_id):
        return  # silently skip in dev if not configured

    url = f"{DISCORD_API}/guilds/{DISCORD_GUILD_ID}/members/{discord_user_id}/roles/{role_id}"
    r = requests.put(
        url,
        headers={"Authorization": f"Bot {DISCORD_BOT_TOKEN}"},
        timeout=20,
    )
    # 204 = success
    if r.status_code not in (204, 201, 200):
        raise RuntimeError(f"Discord role assign failed: {r.status_code} {r.text}")
    

def add_to_guild(discord_user_id: str, access_token: str):
    if not (DISCORD_BOT_TOKEN and DISCORD_GUILD_ID):
        return

    url = f"{DISCORD_API}/guilds/{DISCORD_GUILD_ID}/members/{discord_user_id}"

    r = requests.put(
        url,
        headers={
            "Authorization": f"Bot {DISCORD_BOT_TOKEN}",
            "Content-Type": "application/json",
        },
        json={"access_token": access_token},
        timeout=20,
    )

    if r.status_code not in (201, 204):
        raise RuntimeError(
            f"Guild join failed: {r.status_code} {r.text}"
        )

