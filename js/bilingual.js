/**
 * OpenSky Localization Engine
 * Provides XSS-safe bilingual dictionary and DOM translation for English and Hindi.
 * Zero usage of .innerHTML to guarantee SAST security compliance.
 */

export const translations = {
  en: {
    tagline: "• Smog Defense System",
    status: "NCR • AQI 312 Severe",
    hero_h1_lead: "Clear air starts",
    hero_h1_accent: "at home.",
    hero_p: "Personalized winter smog defense and actionable family protection forecasts for your neighborhood, children, and elderly loved ones.",
    action_h: "Immediate Action for Families",
    action_p: "Keep children indoors until 11 AM. Run HEPA air purifier on medium and seal north-facing balcony doors.",
    plan_btn: "Get my plan",
    ai_btn: "Ask OpenSky AI",
    ai_title: "OpenSky GenAI Smog Advisor",
    ai_desc: "Real-time AI decision support for family defense, low-emission routines, and community safety.",
    transport_title: "Clean Transportation & Route Shield",
    transport_desc: "AI-optimized low-exposure commute windows and public transit alternatives.",
    stadium_title: "Stadium & Crowd Air Protocols",
    stadium_desc: "Air quality management guidelines for high-density public venues and outdoor gatherings."
  },
  hi: {
    tagline: "• शीतकालीन स्मॉग सुरक्षा प्रणाली",
    status: "दिल्ली NCR • AQI 312 गंभीर स्तर",
    hero_h1_lead: "स्वच्छ हवा की शुरुआत",
    hero_h1_accent: "घर से होती है।",
    hero_p: "आपके पड़ोस, बच्चों और बुज़ुर्गों के लिए व्यक्तिगत शीतकालीन स्मॉग सुरक्षा और व्यावहारिक पूर्वानुमान।",
    action_h: "परिवारों के लिए त्वरित सुरक्षा निर्देश",
    action_p: "सुबह 11 बजे तक बच्चों को घर के अंदर रखें। हेपा (HEPA) एयर प्यूरीफायर चलाएं और उत्तर दिशा की बालकनी के दरवाजे बंद रखें।",
    plan_btn: "मेरी योजना देखें",
    ai_btn: "ओपनस्काई AI से पूछें",
    ai_title: "ओपनस्काई GenAI स्मॉग सलाहकार",
    ai_desc: "पारिवारिक सुरक्षा, कम उत्सर्जन दिनचर्या और सामुदायिक सुरक्षा के लिए वास्तविक समय AI निर्णय सहायता।",
    transport_title: "स्वच्छ परिवहन एवं मार्ग सुरक्षा",
    transport_desc: "AI द्वारा अनुकूलित कम प्रदूषण वाले यात्रा समय और सार्वजनिक परिवहन विकल्प।",
    stadium_title: "स्टेडियम एवं जनसमूह सुरक्षा नियम",
    stadium_desc: "सार्वजनिक आयोजनों और बाहरी सभाओं के लिए वायु गुणवत्ता प्रबंधन दिशानिर्देश।"
  }
};

let currentLanguage = "en";

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  currentLanguage = lang === "hi" ? "hi" : "en";
  const t = translations[currentLanguage];

  const enBtn = document.getElementById("lang-btn-en");
  const hiBtn = document.getElementById("lang-btn-hi");

  if (enBtn && hiBtn) {
    if (currentLanguage === "hi") {
      hiBtn.className = "px-2.5 py-1 rounded-full bg-primary text-on-primary transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary";
      hiBtn.setAttribute("aria-pressed", "true");
      enBtn.className = "px-2.5 py-1 rounded-full text-on-surface-variant hover:text-on-surface transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary";
      enBtn.setAttribute("aria-pressed", "false");
    } else {
      enBtn.className = "px-2.5 py-1 rounded-full bg-primary text-on-primary transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary";
      enBtn.setAttribute("aria-pressed", "true");
      hiBtn.className = "px-2.5 py-1 rounded-full text-on-surface-variant hover:text-on-surface transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary";
      hiBtn.setAttribute("aria-pressed", "false");
    }
  }

  // Safe DOM updates (textContent only - zero XSS risk)
  const tagEl = document.getElementById("app-tagline");
  if (tagEl) tagEl.textContent = t.tagline;

  const statEl = document.getElementById("live-status-text");
  if (statEl) statEl.textContent = t.status;

  const heroLead = document.getElementById("hero-title-lead");
  if (heroLead) heroLead.textContent = t.hero_h1_lead;

  const heroAccent = document.getElementById("hero-title-accent");
  if (heroAccent) heroAccent.textContent = t.hero_h1_accent;

  const heroP = document.getElementById("hero-description");
  if (heroP) heroP.textContent = t.hero_p;

  const actH = document.getElementById("home-action-heading");
  if (actH) actH.textContent = t.action_h;

  const actP = document.getElementById("home-action-text");
  if (actP) actP.textContent = t.action_p;

  document.documentElement.setAttribute("lang", currentLanguage);
}
