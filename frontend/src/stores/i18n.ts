import { defineStore } from 'pinia';

const translations = {
  de: {
    nav: {
      check: "Check",
      admin: "Admin",
      brand: "Anspruchs-Check"
    },
    assess: {
      next: "Weiter",
      back: "Zurück",
      start: "Starten",
      result: "Ergebnis"
    },
    ending: {
      good: {
        title: "Glückwunsch!",
        desc: "Basierend auf Ihren Angaben haben Sie sehr wahrscheinlich Anspruch auf Sozialhilfe. Sie können nun das offizielle Antragsformular ausfüllen.",
        btn: "Antrag starten"
      },
      bad: {
        title: "Kein Anspruch",
        desc: "Basierend auf Ihren aktuellen Angaben besteht kein Anspruch auf Sozialhilfe. Sollten sich Ihre Umstände ändern, können Sie die Prüfung jederzeit erneut durchführen.",
        btn: "Zurück zur Übersicht"
      },
      maybe: {
        title: "Ungeklärte Situation",
        desc: "Es konnte nicht abschliessend geklärt werden, ob ein Anspruch besteht. Wir empfehlen eine persönliche Beratung bei Ihrer zuständigen Stelle.",
        btn: "Beratungsstelle finden"
      }
    }
  },
  en: {
    nav: {
      check: "Check",
      admin: "Admin",
      brand: "Eligibility Check"
    },
    assess: {
      next: "Next",
      back: "Back",
      start: "Start",
      result: "Result"
    },
    ending: {
      good: {
        title: "Congratulations!",
        desc: "Based on your information, you are very likely eligible for social assistance. You can now fill out the official application form.",
        btn: "Start Application"
      },
      bad: {
        title: "No Eligibility",
        desc: "Based on your current information, there is no eligibility for social assistance. If your circumstances change, you can repeat the check at any time.",
        btn: "Back to Overview"
      },
      maybe: {
        title: "Unclear Situation",
        desc: "It could not be conclusively determined whether eligibility exists. We recommend a personal consultation at your responsible office.",
        btn: "Find Advisory Center"
      }
    }
  }
};

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: 'de' as 'de' | 'en'
  }),
  actions: {
    setLocale(lang: 'de' | 'en') {
      this.locale = lang;
    },
    t(keyPath: string): string {
      const keys = keyPath.split('.');
      let current: any = translations[this.locale];
      for (const key of keys) {
        if (current[key]) {
          current = current[key];
        } else {
          return keyPath; // Fallback to key if not found
        }
      }
      return current;
    }
  }
});
