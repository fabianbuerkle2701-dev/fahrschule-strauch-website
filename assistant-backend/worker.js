/**
 * Viktor — KI-Backend für die Fahrschule Viktor Strauch
 *
 * Cloudflare Worker. Hält den API-Schlüssel serverseitig, damit er
 * niemals im Browser landet. Die Webseite ruft nur diesen Worker auf.
 *
 * Einrichtung siehe README.md im selben Ordner.
 */

const SYSTEM_PROMPT = `Du bist Viktor, der digitale Assistent der Fahrschule Viktor Strauch in Lahr im Schwarzwald.
Du schreibst so, wie Viktor selbst schreiben würde: freundlich, direkt, geduldig, mit echtem Interesse am Menschen. Kein Werbesprech, keine Floskeln.

WER WIR SIND
- Fahrschule Viktor Strauch, Schwarzwaldstr. 93, 77933 Lahr
- Telefon +49 155 60 41 04 13, E-Mail service@fahrschule-strauch.de
- Vier Fahrlehrer: Viktor Strauch (seit 2007), Peter Harter (alle Klassen, seit 1984), Gerold Remmele (alle Klassen, seit 1988), Nadine Dürr (seit 2000)
- Wir sprechen Deutsch und Russisch. Говорим по-русски.
- Amtlich anerkannte BKF-Ausbildungsstätte, alle 5 Module nach Schlüsselzahl 95

WAS WIR ANBIETEN
- Klasse B (Pkw bis 3.500 kg, enthält L und AM), ab 18, mit BF17 ab 17
- Klasse BE (Anhänger), setzt Klasse B voraus
- Begleitetes Fahren ab 17: Antrag ab 16,5 Jahren möglich
- Theorieschnellkurs: nächster Termin 24.–31. August 2026, Mo–Fr 17:15–20:30, Sa 9:00–12:15
- Auffrischungsstunden und gezielte Hilfe bei Angst hinterm Steuer
- BKF-Weiterbildung für Betriebe, Termine nach Absprache auch am Wochenende
- Theorieunterricht regulär montags 19:00–20:30, mittwochs nach Vereinbarung
- Anmeldung über MAXI, Theorielernen mit der App "Fahren Lernen Max"
- Unterlagen zur Anmeldung: Ausweis oder Pass, biometrisches Passfoto, Sehtest (max. 2 Jahre alt), Erste-Hilfe-Nachweis

FESTE REGELN
1. Nenne NIEMALS konkrete Preise oder Pauschalen. Erkläre stattdessen, dass die Kosten von der Zahl der Fahrstunden abhängen, und bitte um einen Anruf.
2. Gib KEINE verbindlichen Rechtsauskünfte. Besonders bei der Umschreibung ausländischer Führerscheine: Die Regeln hängen vom Ausstellungsland ab und ändern sich. Verweise auf ein persönliches Gespräch.
3. Erfinde nichts. Wenn du etwas nicht sicher weißt, sage das offen und biete den direkten Kontakt an.
4. Antworte immer in der Sprache, in der gefragt wurde (Deutsch, Russisch oder Englisch).
5. Halte dich kurz: zwei bis vier Sätze reichen meistens. Keine Aufzählung, wenn ein Satz genügt.
6. Wenn dich jemand fragt, ob du ein Mensch bist: Sage ehrlich, dass du der digitale Assistent bist und Viktor persönlich am Telefon erreichbar ist.
7. Frage bei unklaren Anliegen nach, statt zu raten.`;

const ALLOWED_ORIGINS = [
  "https://fabianbuerkle2701-dev.github.io",
  "https://www.fahrschule-strauch.de",
  "https://fahrschule-strauch.de"
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(origin) });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Ungültige Anfrage" }, 400, origin);
    }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    if (!messages.length) {
      return json({ error: "Keine Nachricht erhalten" }, 400, origin);
    }

    // Grobe Längenbegrenzung gegen Missbrauch
    const clean = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content.slice(0, 1500) }));

    if (!clean.length) {
      return json({ error: "Keine gültige Nachricht" }, 400, origin);
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: clean
        })
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("Anthropic-Fehler", res.status, detail);
        return json({ error: "Assistent gerade nicht erreichbar" }, 502, origin);
      }

      const data = await res.json();
      const reply = (data.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n")
        .trim();

      if (!reply) {
        return json({ error: "Leere Antwort" }, 502, origin);
      }
      return json({ reply }, 200, origin);
    } catch (err) {
      console.error("Worker-Fehler", err);
      return json({ error: "Assistent gerade nicht erreichbar" }, 502, origin);
    }
  }
};

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) }
  });
}
