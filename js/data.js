/* All site content lives here. The components in js/components/ render it. */
export const portfolio = {
  name: {
    first: "Michał",
    last: "Malinowski",
    handle: "michal.malinowski", // ASCII version used in the terminal-style logo
  },
  jobTitle: "Data Scientist",
  location: "Gdańsk, Poland",

  contact: {
    email: "michalmalinowski29@gmail.com",
    phone: "+48512250794",
    phoneDisplay: "+48 512 250 794",
    github: "https://github.com/MichalM31252",
    linkedin: "https://www.linkedin.com/in/michalmalinowski29/",
  },

  nav: [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "activity", label: "Activity" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ],

  hero: {
    // <strong> renders in white.
    lede: `I turn raw, messy data into decisions — building <strong>pipelines,
           models, and BI dashboards</strong> as a Data Scientist at Ergo Hestia
           while completing a Data Engineering degree at Gdańsk University of
           Technology.`,
    primaryButton: "Get in touch",
  },

  // The animated SQL console in the hero. Keywords and 'quoted strings'
  // are highlighted automatically while the query types itself out.
  queryCard: {
    filename: "candidate.sql",
    query: [
      "SELECT role, company, focus",
      "FROM data_scientists",
      "WHERE city = 'Gdańsk'",
      "  AND open_to = 'new challenges';",
    ].join("\n"),
    resultColumns: ["role", "company", "focus"],
    resultRow: ["Data Scientist", "Ergo Hestia", "ML · BI · Pipelines"],
    resultMeta: "<em>1 row</em> returned in 0.042 s",
  },

  about: {
    heading: "A data engineer's rigor, an analyst's curiosity",
    paragraphs: [
      `I'm a 6th-semester <strong>Data Engineering</strong> student at Gdańsk
       University of Technology and a Data Scientist at <strong>Ergo
       Hestia</strong>, one of Poland's largest insurers. My work sits where
       engineering meets analysis: designing and optimizing databases,
       processing large datasets, and turning them into models and dashboards
       that people actually use.`,
      `I'm particularly interested in <strong>data science, database design
       optimization, and Business Intelligence</strong>. I learn quickly, enjoy
       working in a team, carry out my duties diligently — and I'm always eager
       to take on a new challenge.`,
    ],
    facts: [
      { label: "location", value: "Gdańsk, Poland" },
      { label: "currently_at", value: "Ergo Hestia" },
      { label: "studying", value: "Data Engineering, GUT" },
      { label: "core_stack", value: "Python · SQL · Power BI" },
      { label: "status", value: "Open to opportunities" },
    ],
  },

  experience: {
    heading: "Where I've worked",
    jobs: [
      {
        date: "06.2025 — Present",
        role: "Data Scientist (Internship)",
        company: "Ergo Hestia",
        companyUrl: "https://www.ergohestia.pl",
        location: "Gdańsk",
        bullets: [
          "Apply advanced Python and its data-analysis ecosystem to large, real-world insurance datasets",
          "Build and evaluate machine learning models using industry-standard modelling algorithms",
          "Develop data workflows with Databricks, Azure Data Factory, and GitHub",
          "Create reports and dashboards in Power BI and write production SQL queries",
          "Work with Microsoft Copilot Studio and collaborate through Jira and the Atlassian suite",
        ],
        tags: ["Python", "Machine Learning", "Databricks", "Azure Data Factory", "Power BI", "SQL"],
      },
    ],
  },

  projects: {
    heading: "Selected work",
    items: [
      {
        name: "School Data Warehouse",
        url: "https://github.com/MichalM31252/School-Data-Warehouse",
        desc: "A functional data warehouse designed end-to-end for the needs of a school — from schema design to loading and querying, built in T-SQL.",
        tags: ["T-SQL", "Data Warehousing", "ETL"],
      },
      {
        name: "Polish Speech Recognizer",
        url: "https://github.com/MichalM31252/Polish-Speech-Recognizer",
        desc: "An artificial neural network trained to recognize spoken Polish sentences — deep learning applied to a language with famously hard phonetics.",
        tags: ["Python", "Neural Networks", "Speech"],
      },
      {
        name: "Steam Inventory Advertiser",
        url: "https://github.com/MichalM31252/Counter-Strike-Inventory-Advertiser",
        desc: "An automated, configurable tool that promotes Counter-Strike items across Reddit and Steam — multi-platform scraping and posting at scale.",
        tags: ["Python", "Selenium", "MySQL"],
      },
      {
        name: "Red Cross Document Scanner",
        url: null,
        desc: "A document scanner built for the Polish Pomeranian Red Cross, digitizing paperwork for a nonprofit that runs on volunteers' time.",
        tags: ["Python", "OCR", "Pro bono"],
      },
      {
        name: "Wulkanizacja Website",
        url: "https://github.com/MichalM31252/Wulkanizacja-Website",
        desc: "A fully responsive website built from scratch for a paying client — my first freelance project, delivered polished and on time.",
        tags: ["HTML/CSS/JS", "Bulma", "Freelance"],
      },
      {
        name: "More on GitHub",
        url: "https://github.com/MichalM31252",
        desc: "Twelve public repositories and counting — experiments, coursework, and tools, all in the open.",
        tags: ["github.com/MichalM31252"],
      },
    ],
  },

  activity: {
    heading: "Always shipping",
    githubUsername: "MichalM31252",
    leetcodeUsername: "MM02",
  },

  skills: {
    heading: "What I work with",
    groups: [
      {
        title: "languages & libraries",
        items: ["Python", "Pandas", "Spark", "SQL / PL/SQL / T-SQL"],
      },
      {
        title: "data platform",
        items: ["Databricks", "Azure Data Factory", "Databases & Data Warehouses", "Big Data processing"],
      },
      {
        title: "analytics & ML",
        items: ["Machine Learning", "Power BI", "Data visualization", "Exploratory data analysis"],
      },
      {
        title: "ways of working",
        items: ["Git & GitHub", "Jira / Atlassian", "Clear communication", "Independent & team work"],
      },
    ],
  },

  education: {
    heading: "Education & certificates",
    schools: [
      {
        date: "2023 — Present",
        degree: "BSc, Data Engineering",
        school: "Gdańsk University of Technology",
        bullets: [
          "Exploratory analysis of financial data",
          "Design and optimization of financial data analysis scripts in PL/SQL",
          "Big Data processing and integration of data from various sources",
        ],
      },
      {
        date: "2019 — 2023",
        degree: "Technician Programmer",
        school: "Technical Secondary School of Electrical Engineering, Białystok",
        bullets: [
          "Creating and administering web applications",
          "Creating and administering databases",
        ],
      },
    ],
    certificates: [
      { name: "Big Data with PySpark", org: "DataCamp", date: "06.2026" },
      { name: "Data Analyst in Power BI", org: "DataCamp", date: "03.2026" },
      { name: "Databricks Fundamentals", org: "Databricks", date: "01.2025" },
      { name: "Fundamentals of Deep Learning", org: "NVIDIA", date: "09.2024" },
      { name: "Technician Programmer INF.03 / INF.04", org: "ZSE Białystok", date: "07.2023" },
    ],
  },

  contactSection: {
    heading: "Let's talk data",
    blurb: `Whether it's an internship, a junior data role, or an interesting
            problem with a large dataset behind it — my inbox is open.`,
  },

  footer: {
    rightNote: "designed & built with care",
  },
};
