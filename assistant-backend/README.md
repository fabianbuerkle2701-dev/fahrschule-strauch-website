# Viktor als echter KI-Agent

Der Assistent auf der Webseite läuft standardmäßig **ohne** KI-Modell: Er beantwortet
die häufigsten Fragen aus einer eingebauten Wissensbasis. Das kostet nichts, funktioniert
sofort und es verlassen keine Daten den Browser.

Wenn Viktor frei formulierte Antworten geben soll, braucht es ein Sprachmodell —
und damit einen API-Schlüssel. Dieser Ordner enthält alles dafür.

## Warum der Schlüssel nicht auf die Webseite darf

Die Seite liegt als statische Seite auf GitHub Pages. Alles, was dort im HTML oder
JavaScript steht, kann jeder Besucher im Browser lesen — auch ein API-Schlüssel.
Er wäre binnen Stunden von automatisierten Scannern gefunden und auf fremde Rechnung
verbraucht.

Deshalb der Umweg über einen kleinen Server, der den Schlüssel hält:

```
Browser  →  Cloudflare Worker  →  Anthropic API
            (Schlüssel liegt hier)
```

Der Browser sieht nur die Adresse des Workers, nie den Schlüssel.

## Einrichtung in etwa 20 Minuten

### 1. Konto anlegen

Kostenloses Konto bei [Cloudflare](https://dash.cloudflare.com/sign-up) erstellen.
Das kostenlose Kontingent liegt bei 100.000 Anfragen pro Tag — für eine Fahrschule
um Größenordnungen mehr als nötig.

### 2. API-Schlüssel besorgen

Unter [console.anthropic.com](https://console.anthropic.com) ein Konto anlegen,
Guthaben aufladen und unter *API Keys* einen Schlüssel erzeugen.
Den Schlüssel gut aufbewahren — er wird nur einmal angezeigt.

### 3. Worker anlegen

Im Cloudflare-Dashboard: **Workers & Pages → Create → Worker**.
Einen Namen vergeben, zum Beispiel `viktor-assistent`, und anlegen.
Danach **Edit Code** öffnen, den gesamten Inhalt von `worker.js` einfügen
und **Deploy** klicken.

### 4. Schlüssel hinterlegen

Im Worker: **Settings → Variables and Secrets → Add**

| Feld  | Wert                          |
|-------|-------------------------------|
| Typ   | Secret                        |
| Name  | `ANTHROPIC_API_KEY`           |
| Wert  | der Schlüssel aus Schritt 2   |

Als *Secret* hinterlegt ist der Wert danach auch im Dashboard nicht mehr lesbar.

### 5. Erlaubte Domains prüfen

In `worker.js` steht oben die Liste `ALLOWED_ORIGINS`. Dort müssen die Adressen
stehen, unter denen die Webseite erreichbar ist. Nur von diesen Adressen nimmt
der Worker Anfragen an — das verhindert, dass Fremde den Worker auf eure Kosten nutzen.

### 6. Webseite umstellen

Cloudflare zeigt nach dem Deploy eine Adresse an, etwa
`https://viktor-assistent.DEIN-NAME.workers.dev`.

Diese Adresse im Build-Skript eintragen, dort wo der Assistent eingebunden wird:

```html
<script src="js/assistant.js?v=1" data-api="https://viktor-assistent.DEIN-NAME.workers.dev"></script>
```

Sobald das Attribut `data-api` gesetzt ist, fragt Viktor das Sprachmodell.
Ohne das Attribut bleibt er bei der eingebauten Wissensbasis.

**Wichtig:** Fällt der Worker aus oder antwortet er nicht innerhalb von 20 Sekunden,
schaltet die Webseite automatisch auf die eingebaute Wissensbasis zurück. Der
Assistent fällt also nie komplett aus.

## Was das kostet

Bei Haiku 4.5 und typischen Anfragen liegen die Kosten im Bereich weniger Cent
pro hundert Gespräche. Für eine Fahrschule sind das erfahrungsgemäß wenige Euro
im Monat. In der Anthropic-Konsole lässt sich ein monatliches Limit setzen,
damit es keine Überraschungen gibt — das ist dringend zu empfehlen.

## Vor dem Livegang bedenken

- **Datenschutz:** Sobald der Worker aktiv ist, werden Chat-Nachrichten an einen
  Dienstleister übertragen. Die Datenschutzerklärung muss das benennen, und mit
  Anthropic sowie Cloudflare ist jeweils ein Auftragsverarbeitungsvertrag zu schließen.
- **Transparenz:** Der Assistent weist sich bereits als solcher aus. Das muss so bleiben.
- **Missbrauchsschutz:** Der Worker begrenzt Nachrichtenlänge und Verlauf. Bei
  auffälliger Nutzung lässt sich in Cloudflare zusätzlich eine Rate-Limit-Regel setzen.
- **Systemprompt pflegen:** Kurstermine und Angaben im Systemprompt oben in `worker.js`
  aktuell halten — sonst nennt Viktor veraltete Termine.
