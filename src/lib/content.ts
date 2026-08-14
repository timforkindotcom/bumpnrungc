/**
 * Site copy defaults. When you’re ready to launch, replace the strings below
 * (or edit the same fields in Sanity Studio at /studio).
 */
export type ServiceItem = {
  title: string;
  description: string;
};

export type QuipGroup = {
  faultType: string;
  quips: string[];
};

export type SiteContent = {
  businessName: string;
  subheader: string;
  tagline: string;
  ctaHeadline: string;
  ctaServicesLabel: string;
  ctaContactLabel: string;
  freePlayBadge: string;
  seoTitle: string;
  seoDescription: string;
  location: {
    title: string;
    body: string;
    serviceArea: string;
  };
  about: {
    title: string;
    body: string;
    closer: string;
  };
  services: ServiceItem[];
  contact: {
    intro: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
  };
  merch: {
    headline: string;
    body: string;
    comingSoon: string;
  };
  quips: QuipGroup[];
};

export const defaultContent: SiteContent = {
  businessName: "Bump N Run Golf Club",
  subheader: "MI Mobile Golf Repair Trailer",
  tagline: "It's The Club's Fault.",
  ctaHeadline: "Need your clubs fixed?",
  ctaServicesLabel: "See Services",
  ctaContactLabel: "Get in Touch",
  freePlayBadge: "Free Play",
  seoTitle: "Golf Club Repair in Brighton, MI | Bump N Run",
  seoDescription:
    "Mobile golf club repair and regripping in Brighton, Michigan and Southeast Michigan. We come to your course, range, or driveway. It's The Club's Fault — we fix it.",
  location: {
    title: "Location",
    body: "Based in Brighton, Michigan. Our mobile golf club repair trailer comes to you — courses, ranges, tournaments, and events across Southeast Michigan.",
    serviceArea: "Serving Livingston County, Washtenaw County, and beyond.",
  },
  about: {
    title: "About",
    body: "Bump N Run Golf Club is a mobile golf repair trailer based in Brighton, MI.\n\nWe come to your course, range, outing, or driveway — regrips, repairs, and tune-ups so you can stop blaming yourself and start blaming the club (then let us fix it).\n\nIt's The Club's Fault. We make that a temporary problem.",
    closer: "Local. Mobile. Built for golfers who'd rather be playing than waiting on a shop.",
  },
  services: [
    {
      title: "Club Repair",
      description:
        "Golf club repair: lofts, lies, shaft work, epoxy, and grip replacement. We get your clubs back in spec.",
    },
    {
      title: "Regripping",
      description:
        "Golf club regripping — standard and jumbo grips, same-day at your location.",
    },
    {
      title: "Mobile Fitting Consultation",
      description:
        "On-site fitting advice at your course, range, or event.",
    },
    {
      title: "Tournament & Event Support",
      description:
        "On-site repair and regripping during outings and charity events.",
    },
    {
      title: "General Tune-Up",
      description:
        "Clean, inspect, and refresh your set so everything feels right again.",
    },
  ],
  contact: {
    intro:
      "Reach out for mobile repair, regripping, or event support. We'll come to you.",
    phone: "248-534-5735",
    email: "bumpnrungc@gmail.com",
    instagram: "https://www.instagram.com/bumpnrungc/",
    facebook: "",
  },
  merch: {
    headline: "Merch",
    body: "Bump N Run gear is on the way — vintage golf vibes, mobile shop pride.",
    comingSoon: "Coming Soon",
  },
  quips: [
    {
      faultType: "slice",
      quips: [
        "That's a slice and a half.",
        "Perfect aim. Imperfect club.",
        "The ball had other plans.",
      ],
    },
    {
      faultType: "hook",
      quips: [
        "Did you mean to aim at the trees?",
        "The club had other plans.",
        "That hook came out of nowhere.",
      ],
    },
    {
      faultType: "chunk",
      quips: [
        "Fat shot. It's not you.",
        "Barely made it off the tee.",
        "The turf won that exchange.",
      ],
    },
    {
      faultType: "shank",
      quips: [
        "Let's call that the club's fault.",
        "Wrong part of the club. Classic.",
        "That's a conversation for the repair trailer.",
      ],
    },
    {
      faultType: "pull",
      quips: [
        "So close. Still the club's fault.",
        "Keep your head down... or don't.",
        "Pulled it like the lie was lying.",
      ],
    },
    {
      faultType: "push",
      quips: [
        "Pushed it right into trouble.",
        "The club opened up on its own.",
        "Aim was pure. Club was not.",
      ],
    },
    {
      faultType: "short",
      quips: [
        "Barely made it off the tee.",
        "Needs more club... or a better club.",
        "That one ran out of enthusiasm.",
      ],
    },
    {
      faultType: "skull",
      quips: [
        "Keep your head down... or don't.",
        "Line drive! Wrong sport.",
        "Top spin wasn't the plan.",
      ],
    },
  ],
};
