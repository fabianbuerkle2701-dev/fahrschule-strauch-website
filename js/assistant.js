/* =========================================================
   Viktor — der digitale Assistent der Fahrschule Viktor Strauch
   Spricht in Viktors Stimme, antwortet automatisch.

   Zwei Betriebsarten:
   1. Ohne API — Antworten aus der eingebauten Wissensbasis.
      Läuft komplett im Browser, keine Daten verlassen das Gerät.
   2. Mit API — <script src="js/assistant.js" data-api="https://…"></script>
      Dann übernimmt ein echter KI-Agent. Fällt der aus, greift
      automatisch wieder die Wissensbasis.
   ========================================================= */
(function () {
  "use strict";

  var SELF = document.currentScript;
  var API_URL = (SELF && SELF.getAttribute("data-api")) || window.VIKTOR_API_URL || null;

  var PHONE_HUMAN = "+49 155 60 41 04 13";
  var PHONE_LINK = "+4915560410413";
  var MAIL = "service@fahrschule-strauch.de";

  /* ---------- Wissensbasis, in Viktors Stimme ---------- */
  var KB = {
    de: {
      openLabel: "Frag Viktor",
      title: "Viktor",
      subtitle: "antwortet automatisch",
      badge: "KI",
      disclaimer:
        "Kurz vorweg: Hier antwortet nicht Viktor persönlich, sondern sein digitaler Assistent. Bei Preisen und allem Rechtlichen melde ich mich lieber mit dem echten Team.",
      greeting:
        "Hallo, ich bin Viktor von der Fahrschule Strauch in Lahr.\nSchön, dass du da bist — womit kann ich dir helfen?",
      inputLabel: "Deine Frage",
      placeholder: "Schreib mir …",
      send: "Senden",
      close: "Schließen",
      typing: "Viktor schreibt …",
      suggestionsLabel: "Das werde ich oft gefragt",
      moreLabel: "Was dich noch interessieren könnte",
      fallback:
        "Da bin ich mir gerade nicht sicher, ob ich dich richtig verstanden habe — und dann rate ich lieber nicht.\n\nSchau, ob unten etwas Passendes dabei ist. Oder ruf mich einfach kurz an, das geht meistens schneller als jedes Formular.",
      handoffTitle: "Lieber direkt sprechen?",
      callLabel: "Anrufen",
      mailLabel: "E-Mail",
      privacy: "Dieses Gespräch bleibt in deinem Browser. Ich speichere nichts.",
      privacyApi: "Deine Nachrichten werden zur Beantwortung verarbeitet. Bitte keine sensiblen Daten senden.",
      topics: [
        {
          id: "preis",
          label: "Was kostet der Führerschein?",
          keywords: ["preis", "preise", "kosten", "kostet", "teuer", "gebuhr", "gebuehr", "euro", "zahlen", "bezahlen", "guenstig", "gunstig", "tarif", "pauschale"],
          answer:
            "Ehrlich gesagt: Eine Pauschale zu nennen, ohne dich zu kennen, wäre unseriös. Der größte Posten sind die Fahrstunden — und wie viele jemand braucht, ist wirklich von Mensch zu Mensch verschieden.\n\nRuf mich kurz an, dann gehen wir das gemeinsam durch. Ich sage dir lieber eine ehrliche Zahl als eine schöne.",
          handoff: true
        },
        {
          id: "kurs",
          label: "Wann startet der nächste Theoriekurs?",
          keywords: ["kurs", "theoriekurs", "theorie", "schnellkurs", "start", "startet", "beginn", "beginnt", "termin", "termine", "wann", "naechste", "nachste", "intensiv"],
          answer:
            "Der nächste Theorieschnellkurs für Klasse B läuft vom 24. bis 31. August 2026.\n\nMontag bis Freitag von 17:15 bis 20:30 Uhr, samstags von 9:00 bis 12:15 Uhr. In einer Woche hast du die ganze Theorie durch — das ist gerade für Berufstätige und Schüler in den Ferien die entspannteste Lösung.\n\nDie Plätze sind begrenzt. Wenn du dabei sein willst, sag mir früh Bescheid.",
          handoff: true
        },
        {
          id: "unterlagen",
          label: "Welche Unterlagen brauche ich?",
          keywords: ["unterlagen", "papiere", "dokumente", "mitbringen", "brauche", "benoetige", "benotige", "sehtest", "foto", "passbild", "erste hilfe", "ersthelfer", "antrag", "ausweis"],
          answer:
            "Das ist schnell erzählt. Du brauchst:\n\n• deinen Personalausweis oder Reisepass\n• ein biometrisches Passfoto\n• eine Sehtestbescheinigung, nicht älter als zwei Jahre\n• den Nachweis über den Erste-Hilfe-Kurs\n\nBeim Begleiteten Fahren ab 17 kommt pro Begleitperson ein Formular dazu, mit Kopie von Ausweis und Führerschein.\n\nDen Antrag stellst du bei der Führerscheinstelle. Keine Sorge, wenn dir das kompliziert vorkommt — wir setzen uns zusammen und füllen das gemeinsam aus. Auf Deutsch oder auf Russisch, ganz wie du magst."
        },
        {
          id: "bf17",
          label: "Wie funktioniert BF17?",
          keywords: ["bf17", "bf 17", "begleitetes", "begleitet", "17", "16", "jung", "fruh", "frueh", "begleitperson", "eltern", "mutter", "vater"],
          answer:
            "BF17 ist eine der besten Regelungen, die wir haben — du sammelst ein ganzes Jahr Erfahrung, bevor du allein fährst. Das merkt man später am Fahrstil.\n\nDu machst den Führerschein für Klasse B oder BE mit 17 und fährst dann zusammen mit einer Begleitperson, die in deiner Prüfungsbescheinigung eingetragen ist.\n\nDen Antrag kannst du schon mit 16½ stellen. Wer mit 16 anfängt, ist pünktlich zum 17. Geburtstag fertig — das planen wir gern so.\n\nDie Begleitperson braucht keine Ausbildung, nur ein paar Voraussetzungen. Was genau, erkläre ich dir in Ruhe."
        },
        {
          id: "klassen",
          label: "Welche Klassen bildet ihr aus?",
          keywords: ["klasse", "klassen", "kategorie", "be", "anhaenger", "anhanger", "wohnwagen", "pkw", "auto", "welche", "angebot"],
          answer:
            "Wir bilden in Klasse B und BE aus.\n\nKlasse B ist der klassische Autoführerschein für Fahrzeuge bis 3.500 kg — L und AM sind mit drin. Ab 18, mit BF17 schon ab 17.\n\nKlasse BE brauchst du für größere Anhänger, den Wohnwagen oder das Boot. Dafür musst du Klasse B schon haben.\n\nDazu kommen Auffrischungsstunden und die Weiterbildung für Berufskraftfahrer."
        },
        {
          id: "schaltung",
          label: "Schaltung oder Automatik?",
          keywords: ["schaltung", "schalter", "automatik", "automat", "handschaltung", "getriebe", "b197", "beides"],
          answer:
            "Beides — du entscheidest, womit du dich wohler fühlst. Ich dränge dich in keine Richtung.\n\nWer auf Automatik lernt, kann unter bestimmten Voraussetzungen trotzdem einen Führerschein ohne Automatik-Beschränkung machen. Was für dich sinnvoller ist, hängt davon ab, was du später fahren willst. Sag mir das, dann berate ich dich konkret."
        },
        {
          id: "anmeldung",
          label: "Wie melde ich mich an?",
          keywords: ["anmelden", "anmeldung", "registrieren", "einschreiben", "maxi", "online", "buchen", "starten", "anfangen", "loslegen", "dabei sein"],
          answer:
            "Ganz unkompliziert. Such dir aus, was dir am liebsten ist:\n\n• Ruf an: " + PHONE_HUMAN + "\n• Schreib eine E-Mail: " + MAIL + "\n• Oder komm einfach in der Schwarzwaldstr. 93 vorbei\n\nDie Anmeldung selbst läuft dann digital über MAXI, das dauert ein paar Minuten. Danach lernst du die Theorie mit der App „Fahren Lernen Max“ — auf dem Sofa, in der Bahn, wann du willst.",
          handoff: true
        },
        {
          id: "zeiten",
          label: "Wann ist Unterricht?",
          keywords: ["zeiten", "uhrzeit", "unterricht", "unterrichtszeiten", "oeffnung", "offnung", "geoeffnet", "geoffnet", "montag", "mittwoch", "abends", "wann offen"],
          answer:
            "Theorieunterricht ist montags von 19:00 bis 20:30 Uhr. Mittwochs nach Vereinbarung.\n\nWährend eines Schnellkurses sieht das anders aus — beim aktuellen Kurs Montag bis Freitag von 17:15 bis 20:30 Uhr und samstags von 9:00 bis 12:15 Uhr.\n\nFahrstunden machen wir individuell aus. Sag mir, wann du kannst, dann finden wir was."
        },
        {
          id: "adresse",
          label: "Wo finde ich euch?",
          keywords: ["adresse", "wo", "anfahrt", "standort", "finden", "strasse", "strase", "lahr", "parken", "karte", "hinkommen"],
          answer:
            "Schwarzwaldstr. 93 in 77933 Lahr — da stehen meistens auch unsere Fahrzeuge vor der Tür, du erkennst uns sofort.\n\nAuf der Kontaktseite ist eine Karte eingebunden, die dir den Weg zeigt."
        },
        {
          id: "sprache",
          label: "Sprecht ihr Russisch?",
          keywords: ["russisch", "russland", "sprache", "sprechen", "russki", "englisch", "english", "ukrainisch", "ukraine", "deutsch", "dolmetsch", "uebersetzen", "ubersetzen"],
          answer:
            "Ja, selbstverständlich. Говорим по-русски.\n\nUnd damit meine ich nicht nur ein kurzes Gespräch zwischendurch: Ich erkläre dir auch die Behördenformulare und die Fachbegriffe aus der Theorieprüfung auf Russisch. Genau daran scheitern nämlich viele — nicht am Verstehen der Verkehrsregel, sondern an Wörtern wie „Wartepflicht“ oder „Sichtfahrgebot“.\n\nWenn du magst, gehen wir die zusammen durch. Diese Seite gibt es außerdem auf Englisch und Russisch."
        },
        {
          id: "bkf",
          label: "Weiterbildung für Berufskraftfahrer",
          keywords: ["bkf", "berufskraftfahrer", "modul", "module", "schluesselzahl", "schlusselzahl", "95", "weiterbildung", "lkw", "bus", "spedition", "firma", "betrieb", "fahrer"],
          answer:
            "Wir sind amtlich anerkannte BKF-Ausbildungsstätte und machen alle fünf Module nach Schlüsselzahl 95:\n\n• Eco-Training und Assistenzsysteme\n• Sozialvorschriften und Fahrtenschreiber\n• Gefahrenwahrnehmung\n• Schadensprävention\n• Sicherheit für Ladung und Fahrgast\n\nWenn Sie für einen Betrieb anfragen: Termine stimmen wir individuell ab, auch am Wochenende, damit Ihr Fahrbetrieb weiterläuft. Rufen Sie mich an, dann finden wir eine Lösung.",
          handoff: true
        },
        {
          id: "auffrischung",
          label: "Ich habe Angst vorm Fahren",
          keywords: ["angst", "aengstlich", "furcht", "unsicher", "auffrischung", "auffrischen", "lange nicht", "wieder fahren", "einparken", "dunkelheit", "nervoes", "nervos", "panik", "trauen", "verlernt", "eingerostet"],
          answer:
            "Das höre ich öfter, als du denkst — und es ist überhaupt nichts, wofür man sich schämen müsste.\n\nWir machen Auffrischungsstunden für Klasse B und BE, ganz nach deinem Bedarf: Einparken, Fahren bei Dunkelheit, schwierige Kreuzungen, oder eben gezielt die Angst hinterm Steuer.\n\nDu bestimmst das Tempo. Keine Prüfung, kein Druck, niemand schaut auf die Uhr. Wir fangen da an, wo du dich sicher fühlst.",
          handoff: true
        },
        {
          id: "team",
          label: "Wer unterrichtet bei euch?",
          keywords: ["fahrlehrer", "lehrer", "team", "wer", "personen", "mitarbeiter", "viktor", "peter", "gerold", "nadine", "ihr"],
          answer:
            "Wir sind zu viert:\n\n• Ich, Viktor Strauch — Fahrlehrer seit 2007\n• Peter Harter — Fahrlehrer aller Klassen seit 1984\n• Gerold Remmele — Fahrlehrer aller Klassen seit 1988\n• Nadine Dürr — Fahrlehrerin seit 2000\n\nBei uns wechselst du nicht ständig den Fahrlehrer wie in großen Betrieben. Du bekommst einen festen Ansprechpartner und bleibst bei ihm. Auf der Seite „Über uns“ stellen wir uns mit Foto vor."
        },
        {
          id: "dauer",
          label: "Wie lange dauert das?",
          keywords: ["dauer", "lange", "wie lang", "schnell", "zeit", "monate", "wochen", "fertig", "geschwindigkeit"],
          answer:
            "Das liegt vor allem an dir.\n\nDie Theorie schaffst du im Schnellkurs in einer Woche. Bei der Praxis ist es sehr unterschiedlich — manche brauchen wenige Stunden, andere mehr. Beides ist völlig in Ordnung, ich setze niemanden unter Druck.\n\nWenn du auf einen bestimmten Termin hinarbeitest, den achtzehnten Geburtstag zum Beispiel, dann sag mir das früh. Dann planen wir rückwärts."
        },
        {
          id: "umschreibung",
          label: "Ausländischen Führerschein umschreiben",
          keywords: ["umschreiben", "umschreibung", "auslaendisch", "auslandisch", "ausland", "anerkennen", "anerkennung", "russischer fuehrerschein", "ukrainisch", "kasachstan", "umtausch"],
          answer:
            "Das kommt ganz auf das Ausstellungsland an — und die Regeln ändern sich immer wieder.\n\nDeshalb sage ich dir hier bewusst nichts, worauf du dich am Ende nicht verlassen kannst. Ruf mich kurz an oder komm vorbei, bring den Führerschein mit. Dann schauen wir uns deinen konkreten Fall an und ich sage dir, was tatsächlich gilt. Auf Russisch, wenn dir das lieber ist.",
          handoff: true
        }
      ]
    },

    en: {
      openLabel: "Ask Viktor",
      title: "Viktor",
      subtitle: "replies automatically",
      badge: "AI",
      disclaimer:
        "One thing first: this is not Viktor in person, it is his digital assistant. For prices and anything legal I will point you to the real team.",
      greeting:
        "Hello, I am Viktor from Fahrschule Strauch in Lahr.\nGood to have you here — how can I help?",
      inputLabel: "Your question",
      placeholder: "Write to me …",
      send: "Send",
      close: "Close",
      typing: "Viktor is typing …",
      suggestionsLabel: "People often ask me",
      moreLabel: "You might also want to know",
      handoffTitle: "Rather talk to someone?",
      fallback:
        "I am not sure I understood that correctly — and I would rather not guess.\n\nHave a look whether something below fits. Or just give me a call, that is usually quicker than any form.",
      callLabel: "Call",
      mailLabel: "E-mail",
      privacy: "This conversation stays in your browser. I store nothing.",
      privacyApi: "Your messages are processed to generate an answer. Please do not send sensitive data.",
      topics: [
        {
          id: "preis",
          label: "What does the licence cost?",
          keywords: ["price", "prices", "cost", "costs", "expensive", "fee", "fees", "euro", "pay", "cheap", "how much"],
          answer:
            "Honestly: quoting a flat price without knowing you would not be serious. The biggest item is the driving lessons, and how many someone needs really does differ from person to person.\n\nGive me a call and we will go through it together. I would rather give you an honest number than a pretty one.",
          handoff: true
        },
        {
          id: "kurs",
          label: "When does the next theory course start?",
          keywords: ["course", "theory", "intensive", "start", "starts", "begin", "next", "when", "date", "dates", "schedule"],
          answer:
            "The next intensive theory course for category B runs from 24 to 31 August 2026.\n\nMonday to Friday from 5:15 to 8:30 pm, Saturdays from 9:00 am to 12:15 pm. One week and the whole theory is behind you — for people with a job, or students during the holidays, that is by far the most relaxed way.\n\nPlaces are limited, so let me know early if you want one.",
          handoff: true
        },
        {
          id: "unterlagen",
          label: "Which documents do I need?",
          keywords: ["documents", "papers", "need", "bring", "eye test", "photo", "first aid", "application", "id", "passport"],
          answer:
            "Quickly listed. You need:\n\n• your ID card or passport\n• a biometric passport photo\n• an eye test certificate, no older than two years\n• proof of a first-aid course\n\nFor accompanied driving from 17 there is one more form per accompanying person, with copies of their ID and licence.\n\nThe application goes to the licensing authority. If that sounds complicated, do not worry — we sit down and fill it in together. In German or Russian, whichever you prefer."
        },
        {
          id: "bf17",
          label: "How does BF17 work?",
          keywords: ["bf17", "bf 17", "accompanied", "17", "16", "young", "early", "parent", "companion"],
          answer:
            "BF17 is one of the best rules we have — you gather a whole year of experience before driving alone. You can tell later from the way someone drives.\n\nYou get your category B or BE licence at 17 and then drive together with an accompanying person named in your certificate.\n\nYou can apply from the age of 16½. Start at 16 and you will be ready right on your 17th birthday — we plan it that way gladly.\n\nThe accompanying person needs no training, only a few conditions. I will explain them properly when we talk."
        },
        {
          id: "klassen",
          label: "Which categories do you teach?",
          keywords: ["category", "categories", "class", "classes", "be", "trailer", "caravan", "car", "which", "offer"],
          answer:
            "We train for category B and BE.\n\nCategory B is the classic car licence for vehicles up to 3,500 kg — L and AM are included. From 18, or from 17 with BF17.\n\nCategory BE is what you need for larger trailers, a caravan or a boat. For that you must already hold category B.\n\nOn top of that we offer refresher lessons and professional driver training."
        },
        {
          id: "schaltung",
          label: "Manual or automatic?",
          keywords: ["manual", "automatic", "gearbox", "transmission", "stick", "both"],
          answer:
            "Both — you decide what feels better. I will not push you either way.\n\nIf you learn on an automatic, under certain conditions you can still get a licence without the automatic restriction. Which makes more sense depends on what you want to drive later. Tell me that and I will advise you properly."
        },
        {
          id: "anmeldung",
          label: "How do I sign up?",
          keywords: ["register", "registration", "sign up", "enrol", "enroll", "book", "start", "join", "maxi", "online"],
          answer:
            "Nice and simple. Pick whatever suits you:\n\n• Call: " + PHONE_HUMAN + "\n• Write an e-mail: " + MAIL + "\n• Or just drop by at Schwarzwaldstr. 93\n\nThe registration itself runs digitally through MAXI and takes a few minutes. After that you study the theory with the “Fahren Lernen Max” app — on the sofa, on the train, whenever you like.",
          handoff: true
        },
        {
          id: "zeiten",
          label: "When are the lessons?",
          keywords: ["hours", "times", "opening", "open", "lesson", "monday", "wednesday", "evening", "when open"],
          answer:
            "Theory lessons are on Mondays from 7:00 to 8:30 pm, Wednesdays by arrangement.\n\nDuring an intensive course it looks different — for the current one Monday to Friday from 5:15 to 8:30 pm and Saturdays from 9:00 am to 12:15 pm.\n\nDriving lessons we arrange individually. Tell me when you can, and we will find something."
        },
        {
          id: "adresse",
          label: "Where can I find you?",
          keywords: ["address", "where", "location", "find", "street", "lahr", "parking", "map", "directions"],
          answer:
            "Schwarzwaldstr. 93 in 77933 Lahr — our cars are usually parked right outside, so you will spot us straight away.\n\nThere is a map on the contact page to guide you."
        },
        {
          id: "sprache",
          label: "Do you speak English or Russian?",
          keywords: ["english", "russian", "language", "speak", "german", "ukrainian", "translate", "interpreter"],
          answer:
            "Yes, of course. Говорим по-русски, and this website is available in English too.\n\nAnd I do not just mean small talk: I also explain the official forms and the technical terms from the theory exam. That is where many learners actually struggle — not with understanding the traffic rule, but with words like „Wartepflicht“ or „Sichtfahrgebot“.\n\nIf you like, we go through them together."
        },
        {
          id: "bkf",
          label: "Professional driver training",
          keywords: ["bkf", "professional", "module", "modules", "code 95", "95", "training", "truck", "lorry", "bus", "company", "fleet", "driver"],
          answer:
            "We are an officially certified BKF training centre and run all five modules under code 95:\n\n• Eco training and assistance systems\n• Social regulations and tachograph\n• Hazard perception\n• Damage prevention\n• Cargo and passenger safety\n\nIf you are asking for a company: we arrange dates individually, weekends included, so your operations keep running. Call me and we will find a solution.",
          handoff: true
        },
        {
          id: "auffrischung",
          label: "I am afraid of driving",
          keywords: ["afraid", "scared", "scary", "worried", "panic", "fear", "anxiety", "nervous", "refresher", "refresh", "long time", "parking", "night", "confidence", "rusty"],
          answer:
            "I hear that more often than you would think — and it is nothing to be embarrassed about.\n\nWe offer refresher lessons for categories B and BE, exactly as you need them: parking, driving at night, difficult junctions, or specifically the fear behind the wheel.\n\nYou set the pace. No exam, no pressure, nobody watching the clock. We start where you feel safe.",
          handoff: true
        },
        {
          id: "team",
          label: "Who teaches at your school?",
          keywords: ["instructor", "instructors", "teacher", "team", "who", "staff", "viktor", "peter", "gerold", "nadine"],
          answer:
            "There are four of us:\n\n• Me, Viktor Strauch — instructor since 2007\n• Peter Harter — instructor for all categories since 1984\n• Gerold Remmele — instructor for all categories since 1988\n• Nadine Dürr — instructor since 2000\n\nWith us you do not keep changing instructor the way you do at big schools. You get one contact person and stay with them. We introduce ourselves with photos on the “About us” page."
        },
        {
          id: "dauer",
          label: "How long does it take?",
          keywords: ["how long", "duration", "time", "fast", "quick", "months", "weeks", "ready", "finish"],
          answer:
            "That is mostly up to you.\n\nThe theory you finish in a week with the intensive course. The practical side varies a lot — some need few lessons, others more. Both are perfectly fine, I put nobody under pressure.\n\nIf you are working towards a particular date, an eighteenth birthday for instance, tell me early. Then we plan backwards from there."
        },
        {
          id: "umschreibung",
          label: "Converting a foreign licence",
          keywords: ["convert", "conversion", "foreign", "exchange", "abroad", "recognise", "recognize", "ukrainian", "russian licence", "kazakhstan"],
          answer:
            "That depends entirely on the country that issued it — and the rules keep changing.\n\nSo I deliberately will not tell you something here that you cannot rely on. Give me a call or drop by and bring the licence. Then we look at your specific case and I tell you what actually applies. In Russian if you prefer.",
          handoff: true
        }
      ]
    },

    ru: {
      openLabel: "Спросить Виктора",
      title: "Виктор",
      subtitle: "отвечает автоматически",
      badge: "ИИ",
      disclaimer:
        "Сразу оговорюсь: здесь отвечает не Виктор лично, а его цифровой ассистент. По ценам и юридическим вопросам я направлю вас к живой команде.",
      greeting:
        "Здравствуйте, я Виктор из автошколы Штрауха в Ларе.\nРад, что вы заглянули — чем могу помочь?",
      inputLabel: "Ваш вопрос",
      placeholder: "Напишите мне …",
      send: "Отправить",
      close: "Закрыть",
      typing: "Виктор печатает …",
      suggestionsLabel: "Меня часто спрашивают",
      moreLabel: "Что ещё может быть интересно",
      handoffTitle: "Хотите поговорить лично?",
      fallback:
        "Не уверен, что правильно вас понял — а гадать не хочу.\n\nПосмотрите, может, подойдёт что-то из вариантов ниже. Или просто позвоните, так обычно быстрее любой переписки.",
      callLabel: "Позвонить",
      mailLabel: "E-mail",
      privacy: "Этот разговор остаётся в вашем браузере. Я ничего не сохраняю.",
      privacyApi: "Ваши сообщения обрабатываются для формирования ответа. Пожалуйста, не отправляйте чувствительные данные.",
      topics: [
        {
          id: "preis",
          label: "Сколько стоят права?",
          keywords: ["цена", "цены", "стоимость", "стоит", "сколько", "дорого", "дёшево", "дешево", "евро", "платить", "оплата"],
          answer:
            "Скажу честно: называть фиксированную сумму, не зная вас, было бы несерьёзно. Основная часть — практические занятия, а сколько их нужно, у всех по-разному.\n\nПозвоните, и мы посчитаем вместе. Лучше я назову честную цифру, чем красивую.",
          handoff: true
        },
        {
          id: "kurs",
          label: "Когда начинается курс теории?",
          keywords: ["курс", "теория", "экспресс", "начало", "начинается", "старт", "когда", "дата", "даты", "расписание", "интенсив"],
          answer:
            "Ближайший экспресс-курс теории по категории B пройдёт с 24 по 31 августа 2026 года.\n\nС понедельника по пятницу с 17:15 до 20:30, в субботу с 9:00 до 12:15. За одну неделю вся теория позади — для работающих и для школьников на каникулах это самый спокойный вариант.\n\nМест немного, так что сообщите заранее, если хотите записаться.",
          handoff: true
        },
        {
          id: "unterlagen",
          label: "Какие документы нужны?",
          keywords: ["документы", "бумаги", "нужно", "принести", "зрение", "фото", "первая помощь", "заявление", "паспорт"],
          answer:
            "Список короткий. Понадобятся:\n\n• паспорт или удостоверение личности\n• биометрическое фото\n• справка о проверке зрения, не старше двух лет\n• справка о курсах первой помощи\n\nПри сопровождаемом вождении с 17 лет добавляется анкета на каждого сопровождающего с копией паспорта и прав.\n\nЗаявление подаётся в ведомство. Если это кажется сложным — не переживайте, сядем и заполним вместе. На немецком или на русском, как вам удобнее."
        },
        {
          id: "bf17",
          label: "Как работает BF17?",
          keywords: ["bf17", "bf 17", "сопровожд", "17", "16", "рано", "молод", "родители", "сопровождающий"],
          answer:
            "BF17 — одно из лучших правил, что у нас есть: вы набираете целый год опыта, прежде чем поедете один. Потом это заметно по манере вождения.\n\nВы получаете права категории B или BE в 17 лет и ездите вместе с сопровождающим, вписанным в ваше свидетельство.\n\nЗаявление можно подать уже с 16,5 лет. Если начать в 16, права будут готовы точно к 17-летию — мы с радостью так и планируем.\n\nСопровождающему обучение не нужно, только несколько условий. Расскажу подробно при встрече."
        },
        {
          id: "klassen",
          label: "Какие категории вы обучаете?",
          keywords: ["категория", "категории", "класс", "be", "прицеп", "караван", "машина", "какие", "предложение"],
          answer:
            "Мы обучаем на категории B и BE.\n\nКатегория B — классические права на автомобиль до 3 500 кг, категории L и AM входят. С 18 лет, с BF17 — уже с 17.\n\nКатегория BE нужна для больших прицепов, каравана или лодки. Для неё уже требуется категория B.\n\nКроме того, у нас есть освежающие занятия и курсы для профессиональных водителей."
        },
        {
          id: "schaltung",
          label: "Механика или автомат?",
          keywords: ["механика", "автомат", "коробка", "передач", "ручная", "оба"],
          answer:
            "И то, и другое — решаете вы, что вам комфортнее. Я никуда не подталкиваю.\n\nЕсли учиться на автомате, при определённых условиях всё равно можно получить права без ограничения. Что разумнее именно вам, зависит от того, на чём вы планируете ездить. Скажите — и я подскажу конкретно."
        },
        {
          id: "anmeldung",
          label: "Как записаться?",
          keywords: ["записаться", "запись", "регистрация", "начать", "поступить", "maxi", "онлайн", "забронировать"],
          answer:
            "Всё просто. Выбирайте, как удобнее:\n\n• Позвоните: " + PHONE_HUMAN + "\n• Напишите: " + MAIL + "\n• Или просто зайдите на Schwarzwaldstr. 93\n\nСама запись оформляется онлайн через MAXI, это пара минут. Дальше теорию учите в приложении «Fahren Lernen Max» — на диване, в поезде, когда захотите.",
          handoff: true
        },
        {
          id: "zeiten",
          label: "Когда проходят занятия?",
          keywords: ["время", "часы", "занятия", "работаете", "открыто", "понедельник", "среда", "вечер", "график"],
          answer:
            "Теория — по понедельникам с 19:00 до 20:30, по средам по договорённости.\n\nВо время экспресс-курса иначе: с понедельника по пятницу с 17:15 до 20:30 и в субботу с 9:00 до 12:15.\n\nПрактику согласовываем индивидуально. Скажите, когда вам удобно, и мы что-нибудь найдём."
        },
        {
          id: "adresse",
          label: "Где вы находитесь?",
          keywords: ["адрес", "где", "находитесь", "найти", "улица", "лар", "lahr", "парковка", "карта", "как доехать"],
          answer:
            "Schwarzwaldstr. 93, 77933 Lahr — наши машины обычно стоят прямо у входа, так что нас сразу видно.\n\nНа странице контактов есть карта с маршрутом."
        },
        {
          id: "sprache",
          label: "Вы говорите по-русски?",
          keywords: ["русск", "язык", "говорите", "немецк", "английск", "украинск", "перевод", "переводчик"],
          answer:
            "Да, конечно. Говорим по-русски.\n\nИ речь не про пару фраз между делом: я объясняю на русском и формуляры ведомств, и специальные термины из теоретического экзамена. Именно на них многие и спотыкаются — не на понимании правила, а на словах вроде «Wartepflicht» или «Sichtfahrgebot».\n\nЕсли хотите, разберём их вместе. Сайт есть также на немецком и английском."
        },
        {
          id: "bkf",
          label: "Курсы для профессиональных водителей",
          keywords: ["bkf", "профессион", "модуль", "модули", "код 95", "95", "повышение", "грузовик", "автобус", "фирма", "предприятие", "водител"],
          answer:
            "Мы официально признанный учебный центр BKF и проводим все пять модулей по коду 95:\n\n• Эко-вождение и системы помощи\n• Социальные нормы и тахограф\n• Восприятие опасности\n• Предотвращение ущерба\n• Безопасность груза и пассажиров\n\nЕсли вы обращаетесь от предприятия: сроки согласуем индивидуально, в том числе на выходных, чтобы работа не останавливалась. Позвоните — найдём решение.",
          handoff: true
        },
        {
          id: "auffrischung",
          label: "Я боюсь водить",
          keywords: ["боюсь", "боязнь", "страшно", "страх", "неуверен", "нервнич", "освежить", "давно не", "парковка", "темнот", "паника"],
          answer:
            "Я слышу это чаще, чем вы думаете — и стесняться тут совершенно нечего.\n\nМы проводим освежающие занятия для категорий B и BE, ровно под ваш запрос: парковка, езда в темноте, сложные перекрёстки или именно работа со страхом за рулём.\n\nТемп задаёте вы. Никакого экзамена, никакого давления, никто не смотрит на часы. Начинаем оттуда, где вам спокойно.",
          handoff: true
        },
        {
          id: "team",
          label: "Кто у вас преподаёт?",
          keywords: ["инструктор", "инструкторы", "преподават", "команда", "кто", "сотрудник", "виктор", "петер", "герольд", "надин"],
          answer:
            "Нас четверо:\n\n• Я, Виктор Штраух — инструктор с 2007 года\n• Петер Хартер — инструктор всех категорий с 1984 года\n• Герольд Реммеле — инструктор всех категорий с 1988 года\n• Надин Дюрр — инструктор с 2000 года\n\nУ нас не меняют инструктора постоянно, как в больших школах. У вас будет один человек, с которым вы и останетесь. На странице «О нас» мы представлены с фотографиями."
        },
        {
          id: "dauer",
          label: "Сколько длится обучение?",
          keywords: ["длится", "долго", "время обучения", "быстро", "месяц", "недел", "готов"],
          answer:
            "Это зависит прежде всего от вас.\n\nТеорию вы закрываете за неделю на экспресс-курсе. С практикой очень по-разному — кому-то хватает нескольких занятий, кому-то нужно больше. И то, и другое совершенно нормально, я никого не тороплю.\n\nЕсли ориентируетесь на конкретную дату, например на восемнадцатилетие, скажите заранее. Тогда спланируем в обратном порядке."
        },
        {
          id: "umschreibung",
          label: "Обмен иностранных прав",
          keywords: ["обмен", "обменять", "иностранн", "переоформ", "признание", "украинск", "российск права", "казахстан"],
          answer:
            "Всё зависит от страны выдачи — и правила регулярно меняются.\n\nПоэтому я сознательно не стану говорить здесь то, на что вы потом не сможете опереться. Позвоните или зайдите к нам и возьмите права с собой. Разберём ваш конкретный случай, и я скажу, что действует на самом деле. На русском, если вам так удобнее.",
          handoff: true
        }
      ]
    }
  };

  /* ---------- Hilfsfunktionen ---------- */
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/ё/g, "е")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function pickLang() {
    var l = (document.documentElement.lang || "de").slice(0, 2).toLowerCase();
    return KB[l] ? l : "de";
  }

  function matchTopic(input, pack) {
    var q = normalize(input);
    if (q.length < 2) return null;
    var words = q.split(" ").filter(function (w) { return w.length > 1; });
    var best = null, bestScore = 0;

    pack.topics.forEach(function (topic) {
      var score = 0;
      topic.keywords.forEach(function (kw) {
        var k = normalize(kw);
        if (!k) return;

        // Mehrwortbegriffe: als zusammenhängende Folge suchen, zählen am stärksten
        if (k.indexOf(" ") !== -1) {
          if (q.indexOf(k) !== -1) score += 5;
          return;
        }
        // Einzelwort: exakte Wortgrenze schlägt Wortfragment.
        // Verhindert, dass "auto" in "autofahren" ein falsches Thema gewinnt.
        var hit = false;
        for (var i = 0; i < words.length; i++) {
          var w = words[i];
          if (w === k) { score += 3.5; hit = true; break; }
        }
        if (hit) return;
        // Wortanfang nur bei ausreichend langen, damit spezifischen Stichwörtern
        if (k.length >= 5) {
          for (var j = 0; j < words.length; j++) {
            if (words[j].indexOf(k) === 0 || (words[j].length >= 5 && k.indexOf(words[j]) === 0)) {
              score += 2.5;
              break;
            }
          }
        }
      });
      if (normalize(topic.label).indexOf(q) !== -1) score += 2;
      if (score > bestScore) { bestScore = score; best = topic; }
    });

    return bestScore >= 2.5 ? best : null;
  }

  /* ---------- Aufbau ---------- */
  function build() {
    var lang = pickLang();
    var pack = KB[lang];
    var asked = [];
    var history = [];

    var root = document.createElement("div");
    root.className = "vk-root";
    root.innerHTML =
      '<button class="vk-launcher" type="button" aria-expanded="false" aria-controls="vkPanel">' +
        '<span class="vk-launcher-icon" aria-hidden="true">' +
          '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.8L3 21l1.9-5a8.4 8.4 0 0 1-.8-3.6 8.4 8.4 0 0 1 8.4-8.4 8.4 8.4 0 0 1 8.5 8.5z"/></svg>' +
        '</span>' +
        '<span class="vk-launcher-text">' + pack.openLabel + '</span>' +
      '</button>' +
      '<div class="vk-panel" id="vkPanel" role="dialog" aria-labelledby="vkTitle" hidden>' +
        '<header class="vk-head">' +
          '<span class="vk-avatar" aria-hidden="true">V</span>' +
          '<span class="vk-headtext">' +
            '<strong id="vkTitle">' + pack.title + ' <span class="vk-badge">' + pack.badge + '</span></strong>' +
            '<span>' + pack.subtitle + '</span>' +
          '</span>' +
          '<button class="vk-close" type="button" aria-label="' + pack.close + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
          '</button>' +
        '</header>' +
        '<div class="vk-log" id="vkLog" role="log" aria-live="polite"></div>' +
        '<div class="vk-suggest" id="vkSuggest"></div>' +
        '<form class="vk-form" id="vkForm">' +
          '<label class="vk-sr" for="vkInput">' + pack.inputLabel + '</label>' +
          '<input class="vk-input" id="vkInput" type="text" autocomplete="off" placeholder="' + pack.placeholder + '">' +
          '<button class="vk-send" type="submit" aria-label="' + pack.send + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          '</button>' +
        '</form>' +
        '<p class="vk-privacy">' + (API_URL ? pack.privacyApi : pack.privacy) + '</p>' +
      '</div>';

    document.body.appendChild(root);

    var launcher = root.querySelector(".vk-launcher");
    var panel = root.querySelector(".vk-panel");
    var closeBtn = root.querySelector(".vk-close");
    var log = root.querySelector("#vkLog");
    var suggest = root.querySelector("#vkSuggest");
    var form = root.querySelector("#vkForm");
    var input = root.querySelector("#vkInput");

    function scrollLog() { log.scrollTop = log.scrollHeight; }

    // Wie lange Viktor "tippt": kurze Antwort kurz, lange Antwort laenger.
    // Wirkt ruhiger als eine feste Verzoegerung.
    function thinkTime(text) {
      var n = String(text || "").length;
      return Math.min(2000, 520 + n * 8);
    }

    function addMsg(who, text, extraNode) {
      var wrap = document.createElement("div");
      wrap.className = "vk-msg vk-msg-" + who;
      var bubble = document.createElement("div");
      bubble.className = "vk-bubble";
      String(text).split("\n").forEach(function (line) {
        if (line === "") { bubble.appendChild(document.createElement("br")); return; }
        var p = document.createElement("p");
        p.textContent = line;
        bubble.appendChild(p);
      });
      if (extraNode) bubble.appendChild(extraNode);
      wrap.appendChild(bubble);
      log.appendChild(wrap);
      scrollLog();
      return wrap;
    }

    function showTyping() {
      var wrap = document.createElement("div");
      wrap.className = "vk-msg vk-msg-bot vk-typing";
      wrap.innerHTML = '<div class="vk-bubble"><span class="vk-dots"><i></i><i></i><i></i></span></div>';
      wrap.setAttribute("aria-label", pack.typing);
      log.appendChild(wrap);
      scrollLog();
      return wrap;
    }

    function handoffNode() {
      var box = document.createElement("div");
      box.className = "vk-handoff";
      var t = document.createElement("span");
      t.className = "vk-handoff-title";
      t.textContent = pack.handoffTitle;
      box.appendChild(t);
      var row = document.createElement("div");
      row.className = "vk-handoff-row";
      var call = document.createElement("a");
      call.className = "vk-hbtn vk-hbtn-primary";
      call.href = "tel:" + PHONE_LINK;
      call.textContent = pack.callLabel;
      var mail = document.createElement("a");
      mail.className = "vk-hbtn";
      mail.href = "mailto:" + MAIL;
      mail.textContent = pack.mailLabel;
      row.appendChild(call);
      row.appendChild(mail);
      box.appendChild(row);
      return box;
    }

    function renderSuggestions() {
      suggest.textContent = "";
      var remaining = pack.topics.filter(function (t) { return asked.indexOf(t.id) === -1; });
      if (!remaining.length) { asked = []; remaining = pack.topics.slice(); }
      var label = document.createElement("span");
      label.className = "vk-suggest-label";
      label.textContent = asked.length ? pack.moreLabel : pack.suggestionsLabel;
      suggest.appendChild(label);
      var row = document.createElement("div");
      row.className = "vk-chips";
      remaining.slice(0, 4).forEach(function (topic) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "vk-chip";
        b.textContent = topic.label;
        b.addEventListener("click", function () {
          addMsg("user", topic.label);
          history.push({ role: "user", content: topic.label });
          answerTopic(topic);
        });
        row.appendChild(b);
      });
      suggest.appendChild(row);
    }

    function answerTopic(topic) {
      if (asked.indexOf(topic.id) === -1) asked.push(topic.id);
      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        addMsg("bot", topic.answer, topic.handoff ? handoffNode() : null);
        history.push({ role: "assistant", content: topic.answer });
        renderSuggestions();
      }, thinkTime(topic.answer));
    }

    function answerLocal(value) {
      var topic = matchTopic(value, pack);
      if (topic) { answerTopic(topic); return; }
      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        addMsg("bot", pack.fallback, handoffNode());
        renderSuggestions();
      }, thinkTime(pack.fallback));
    }

    function answerViaApi(value) {
      var t = showTyping();
      var ctrl = new AbortController();
      var timer = window.setTimeout(function () { ctrl.abort(); }, 20000);

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: lang, messages: history.slice(-12) }),
        signal: ctrl.signal
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (data) {
          window.clearTimeout(timer);
          t.remove();
          var reply = (data && (data.reply || data.text)) || "";
          if (!reply) throw new Error("leere Antwort");
          addMsg("bot", reply, /handoff|kontakt|anruf|call|позвон/i.test(reply) ? handoffNode() : null);
          history.push({ role: "assistant", content: reply });
          renderSuggestions();
        })
        .catch(function () {
          window.clearTimeout(timer);
          t.remove();
          answerLocal(value);
        });
    }

    var started = false;
    function start() {
      if (started) return;
      started = true;
      var t = showTyping();
      window.setTimeout(function () {
        t.remove();
        addMsg("bot", pack.greeting);
        var note = document.createElement("p");
        note.className = "vk-disclaimer";
        note.textContent = pack.disclaimer;
        log.appendChild(note);
        renderSuggestions();
        scrollLog();
      }, 620);
    }

    function open() {
      panel.hidden = false;
      root.classList.add("vk-open");
      launcher.setAttribute("aria-expanded", "true");
      start();
      window.setTimeout(function () { input.focus(); }, 60);
    }

    function close() {
      panel.hidden = true;
      root.classList.remove("vk-open");
      launcher.setAttribute("aria-expanded", "false");
      launcher.focus();
    }

    launcher.addEventListener("click", function () { panel.hidden ? open() : close(); });
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) close();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      addMsg("user", v);
      history.push({ role: "user", content: v });
      input.value = "";
      if (API_URL) answerViaApi(v); else answerLocal(v);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
