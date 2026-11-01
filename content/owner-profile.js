/* =====================================================================
   KUNAL.EXE OS — ALL WEBSITE CONTENT LIVES IN THIS ONE FILE
   ---------------------------------------------------------------------
   To add projects, services, results, proof, journey, socials or
   articles: edit ONLY this file (or ask GitHub Copilot to do it —
   see COPILOT_GUIDE.md). Do not change the field names.
   Empty lists ( [] ) show a friendly "coming soon" note on the site.
   Never add numbers, clients or reviews that are not real.
   ===================================================================== */
window.ownerProfile = {

  /* ---------- WHO YOU ARE ---------- */
  identity: {
    fullName: "Kunal Lodhi",
    shortName: "Kunal",
    osName: "Kunal.exe OS",
    domain: "kunalexe.in",
    location: "Lucknow, India",
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST",
    roles: ["Web Developer", "Website Designer", "Founder, Kunal.exe"],
    descriptors: ["KUNAL.EXE OS", "WEB DEVELOPER", "WEBSITES THAT CONVERT", "FOUNDER MODE: ACTIVE"],
    headline: "Websites that bring you more customers.",
    intro: "I design and build fast, modern websites for businesses that want to look professional online and win more customers."
  },

  /* ---------- HOW PEOPLE CONTACT YOU ---------- */
  conversion: {
    primaryLabel: "Chat on WhatsApp",
    whatsappUrl: "https://wa.me/919793428152",
    whatsappDisplay: "+91 97934 28152",
    email: "me@kunalexe.in",
    bookingUrl: ""            // paste a Calendly / Cal.com link here later
  },

  /* ---------- SERVICES (Services app) ----------
     { id, name, line (one sentence), points: ["short bullet", ...] }  */

 services: [
  {
    id: "web",
    name: "Premium Website Development",
    line: "High-end websites built to communicate brand value and create memorable digital experiences.",
    points: [
      "Luxury brand websites",
      "Business websites",
      "Responsive design",
      "Interactive user experiences"
    ]
  },
  {
    id: "landing",
    name: "Landing Page Development",
    line: "Conversion-focused landing pages with modern layouts and compelling visual storytelling.",
    points: [
      "Product landing pages",
      "Campaign pages",
      "Lead generation",
      "Modern animations"
    ]
  },
  {
    id: "web-app",
    name: "Web Applications",
    line: "Custom digital solutions designed around business requirements.",
    points: [
      "Custom dashboards",
      "Booking systems",
      "Business tools",
      "Interactive interfaces"
    ]
  }
],


  /* ---------- PROJECTS (Projects, Case Files and KunalNet apps) ----------
     Add one object per real project. Example (copy, fill, remove the // marks):
     {
       id: "salon-demo",
       name: "Glow Salon Website",
       client: "Glow Salon (or 'Demo project')",
       category: "Business Website",         // used as the folder name in Case Files
       dates: "Oct 2026",
       problem: "They had no website and lost bookings to competitors.",
       intervention: "Built a 5-page mobile-first site with a WhatsApp booking button.",
       outcome: "Live site; bookings now arrive on WhatsApp.",
       outcomeStatus: "client-reported",       // verified | client-reported | founder-reported | estimated | illustrative
       url: "https://example.com",             // must start with https://
       image: "assets/projects/glow-salon.jpg", // optional screenshot (put the file in assets/projects/)
       stack: ["HTML", "CSS", "JavaScript"],
       featured: true
     }
  */  
projects: [
  {
    id: "kunal-exe-coffee",
    name: "Kunal Exe Coffee – Premium Coffee Store",
    client: "Kunal Exe Coffee (Demo Project)",
    category: "E-commerce Website",
    dates: "November 2026",

    problem:
      "Small coffee brands need an online store that looks premium and lets customers order easily, without the cost of a complex payment system.",

    intervention:
      "Designed and built a multi-page coffee store with a cinematic hero, product collection, a 'Bean to Cup' storytelling section, a cart, and order sending through WhatsApp or email.",

    outcome:
      "A complete demo storefront with product pages, a blog and a simple WhatsApp/email ordering flow, responsive on desktop and mobile.",

    outcomeStatus: "illustrative",

    url: "https://coffe-kunal-exe-yzjp.vercel.app",

    image: "assets/projects/kunal-exe-coffee.png",

    images: [
      "assets/projects/kunal-exe-coffee.png",
      "assets/projects/kunal-exe-coffee-080841.png",
      "assets/projects/kunal-exe-coffee-080904.png"
    ],

    stack: [
      "HTML",
      "CSS",
      "JavaScript",
      "Vite",
      "Responsive Design",
      "WhatsApp Ordering"
    ],

    featured: true
  },
  {
    id: "luxury-watch-maison",
    name: "Luxury Watches – Brand Experience",
    client: "Lucknowi Nawab (Concept Project)",
    category: "Luxury Website",
    dates: "October 2026",

    problem:
      "A premium watch brand needed a sophisticated digital presence to showcase its luxury collection and communicate its brand identity.",

    intervention:
      "Designed and developed an immersive luxury watch website featuring cinematic visuals, elegant typography, interactive sections, product storytelling and a reservation experience.",

    outcome:
      "Created a premium digital brand experience with a dedicated watch collection showcase and reservation interface.",

    outcomeStatus: "illustrative",

    url: "https://luxurywatches-plum.vercel.app/",

    image: "assets/projects/luxury-watches.png",

    stack: [
      "HTML",
      "CSS",
      "JavaScript",
      "Responsive Design",
      "Animation"
    ],

    featured: true
  },
  {
    id: "lumora-dental",
    name: "Lumora Dental – Premium Dental Website",
    client: "Lumora Dental (Concept Project)",
    category: "Healthcare Website",
    dates: "October 2026",

    problem:
      "Dental clinics need a professional digital presence that builds patient trust, communicates available treatments, and makes appointment booking simple.",

    intervention:
      "Designed and developed a modern dental clinic website with an elegant visual identity, responsive layouts, appointment booking, callback forms, treatment showcases, doctor profiles, FAQs, and patient-focused content.",

    outcome:
      "Delivered a complete healthcare website experience with dedicated service sections, appointment enquiry functionality, and a responsive interface for desktop and mobile visitors.",

    outcomeStatus: "illustrative",

    url: "https://dentist-lumora-website-lucknowi-bjp.vercel.app/",

    images: [
      "assets/projects/lumora-dental-home.png",
      "assets/projects/lumora-dental-services.png"
    ],

    stack: [
      "React",
      "TypeScript",
      "TanStack Start",
      "Vite",
      "Tailwind CSS",
      "Responsive Design"
    ],

    featured: true
  }
],


  /* ---------- RESULTS (Results app) ----------
     Only real, approved outcomes. Example:
     { client: "Glow Salon", metric: "2x", metricLabel: "WhatsApp enquiries in 30 days",
       status: "client-reported", source: "Message from the owner, Oct 2026",
       challenge: "No online presence", delivered: "New website + WhatsApp button", url: "" }
  */
  clientCases: [],

  /* ---------- PROOF (Proof app) ----------
     Show a testimonial ONLY after the client agrees. Example:
     { name: "Client name", role: "Owner, Glow Salon", quote: "Exact words the client wrote or said.",
       youtubeId: "", url: "", approved: true }
  */
  testimonials: [],

  /* ---------- JOURNEY (Journey app) ----------
     journeyStory = your story in paragraphs.
     journey = optional timeline: { year: "2024", title: "First website", text: "..." }  */
  journeyStory: [
    "Hey, I'm Kunal.",
    "My journey into technology started with curiosity. I was always interested in knowing how websites work, how things are built, and what happens behind the screens.",
    "That curiosity slowly turned into something bigger. I started exploring web development, experimenting with different technologies, and building projects of my own. Every project taught me something new, and every challenge pushed me to become better.",
    "Over time, my interests expanded beyond websites. I started exploring AI, building intelligent agents, and creating automations that make everyday tasks easier and smarter.",
    "I'm not someone who believes in waiting until everything is perfect. I believe in learning by building, making mistakes, figuring things out, and improving along the way.",
    "Today, I'm focused on creating meaningful digital experiences, building useful tools, and turning ideas into reality.",
    "I'm still learning. Still experimenting. Still building.",
    "This is just the beginning of my journey."
  ],
  journey: [],

  /* ---------- FOUNDER.TXT (Founder.txt app) ---------- */
  founder: {
    heading: "Founder",
    intro: [
      "Hi, I'm Kunal — a Web Developer and Automation Builder based in Lucknow, Uttar Pradesh, India.",
      "I build modern, responsive websites, intelligent AI agents, and workflow automations that help businesses work smarter and grow faster.",
      "I'm passionate about technology, creative problem-solving, and turning ideas into practical digital solutions."
    ],
    whatIDoTitle: "What I Do",
    whatIDo: ["Web Development", "AI Agents Development", "Workflow Automation", "Modern UI/UX Experiences"],
    visionTitle: "My Vision",
    vision: "To build meaningful digital products, simplify complex processes through automation, and help businesses leverage technology to achieve more."
  },

  /* ---------- SOCIALS (Socials app) ----------
     { name, handle, url, purpose, status: "active" }  */
  socials: [
    { name: "WhatsApp", handle: "+91 97934 28152", url: "https://wa.me/919793428152", purpose: "Fastest way to reach Kunal", status: "active" },
    { name: "Email", handle: "me@kunalexe.in", url: "mailto:me@kunalexe.in", purpose: "For briefs, quotes and longer messages", status: "active" }
  ],

  /* ---------- ARTICLES (AI Field Notes app) ----------
     { title, summary, date: "2026-11-01", url: "https://kunalexe.in/blog/your-article.html" }  */
  articles: [],

  /* ---------- DAILY TRANSMISSION (the motivation card; one per day) ---------- */
  transmissions: [
    "Small systems, built well, beat big plans that never ship.",
    "Build it simple. Make it fast. Make it yours.",
    "A fast website is a polite website.",
    "Ship the sharp edge first. Polish it second.",
    "A good website works quietly while you sleep.",
    "Clear beats clever, every time."
  ],

  legal: {
    copyrightOwner: "Kunal Lodhi",
    metricDisclaimer: "No results or metrics are published until they are verified and approved by the owner."
  }
};
