/* Rebuilds the lab dataset:
   - members: real PI (Keeheon Lee) + a diverse fictional placeholder team (character avatars)
   - publications: REAL data from Keeheon Lee's Google Scholar / DBLP
   - news + projects: kept consistent with the above
   Writes data/*.json and js/data.js (embedded, works offline).
   Run: node tools/build-data.js */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => JSON.parse(fs.readFileSync(path.join(root, 'data', f + '.json'), 'utf8'));

/* ---------------- Members ---------------- */
const members = [
  {
    id: 'prof-kim', role: 'Professor', name: 'Keeheon Lee', title: 'Full Professor · Principal Investigator',
    country: 'South Korea', flag: '🇰🇷',
    department: 'Underwood International College (UIC), Yonsei University',
    image: 'images/avatars/prof-kim.svg',
    interests: ['Human–AI Interaction & Trust', 'Computational Social Science', 'AI for Social Good'],
    bio: "Keeheon Lee (이기헌) is a Full Professor at Underwood International College and the Department of Innovation, Yonsei Graduate School, who introduces himself as “a data scientist for (social) good.” He devotes himself to finding ways for data and AI to genuinely help people and society, and he enjoys education and new endeavors as much as research. He personally launched the Design Intelligence program at the Graduate School of Communication — which carried over into today's graduate program of the Department of Innovation — and planned Makerspace i7 himself, starting from the proposal.",
    email: 'keeheon@yonsei.ac.kr',
    website: 'https://sites.google.com/yonsei.ac.kr/professor-keeheon/keeheon-lee-yonsei-university',
    scholar: 'https://scholar.google.com/citations?user=DM09eoQAAAAJ&hl=ko&oi=ao',
    cv: {
      specializations: [
        'Professor, Creative Technology Management, Underwood International College (UIC)',
        'Professor, Department of Innovation, Yonsei Graduate School',
        'Professor, Digital Analytics Interdisciplinary Program (M.S.), College of Computing',
        'Adjunct Professor, Graduate School of Information'
      ],
      positions: [
        { text: 'Director, Humanities, Arts, and Social Sciences Division, UIC' },
        { text: 'Program Chair, Department of Innovation, Yonsei Graduate School' },
        { text: 'Associate Dean of Planning, University College', date: '2026.03–' },
        { text: 'Principal Investigator, Institute for AI and Social Innovation' },
        { text: 'Associate Director, Makerspace i7', date: '2025.09–' }
      ],
      career: [
        { text: 'Visiting Professor, Mechanical & Industrial Engineering, University of Toronto', date: '2023.09–2024.08' },
        { text: 'Director, Yonsei Digital Experience Center', date: '2022–2023' },
        { text: 'Associate Director, Veritas Research Institute', date: '2021–2023' },
        { text: 'Associate Director, Makerspace i7', date: '2022.03–2022.08' },
        { text: 'Steering Committee — Design Factory Korea · Makerspace i7 · Global Engagement & Empowerment Forum' },
        { text: 'Sustainable Development Fellow, Institute for Global Engagement & Empowerment' }
      ],
      awards: [
        { text: 'QS Reimagine Education Award — Bronze, Social Science', date: '2021' },
        { text: 'Outstanding Faculty Achievement Award, Yonsei University' }
      ],
      teaching: {
        graduate: [
          { text: 'Computational Linguistics and Innovation in Technology', date: '2024–2026' },
          { text: 'Understanding Sustainable Development (지속가능발전의이해)', date: '2022–2026' },
          { text: 'Business Intelligence', date: '2022–2025' },
          { text: 'AI and Credit Scoring Models (인공지능과 신용평가 모델)', date: '2025' },
          { text: 'Human-Centered Technology Policy (인간중심 기술정책)', date: '2024' },
          { text: 'Advanced Topics in Deep Learning', date: '2023' },
          { text: 'Entrepreneurship: Startup & Management (창업과 경영)', date: '2023' },
          { text: 'Deep Learning Theory and Practice (딥러닝 이론과 실습)', date: '2022' },
          { text: 'Innovation Research 2', date: '2022' },
          { text: 'Methods of Innovation Research: Quantitative Methods', date: '2021–2022' },
          { text: 'Computer Vision (컴퓨터비전)', date: '2021' },
          { text: 'Human–AI Interaction Research Project I–II', date: '2019–2020' },
          { text: 'AI for UX Design (UX디자인을 위한 인공지능)', date: '2019' },
          { text: 'Introduction to Design Intelligence (디자인인텔리전스개론)', date: '2019' },
          { text: 'IoT Foundation I–II (사물인터넷 기초)', date: '2017–2020' },
          { text: 'Data Science 1: Analytics (데이터과학: 분석)', date: '2018' },
          { text: 'R&D and New Product Development Management', date: '2015' }
        ],
        undergraduate: [
          { text: 'Understanding Sustainable Development with Ban Ki-moon (반기문과 함께하는 지속가능발전의 이해)', date: '2021–2026' },
          { text: 'Social Network Analysis', date: '2016–2025' },
          { text: 'Empirical Methods in NLP for Technology Management', date: '2025' },
          { text: 'Network Science for Creative Industry', date: '2024' },
          { text: 'Data Science for Business', date: '2017–2023' },
          { text: 'Programming for Everybody', date: '2018–2023' },
          { text: 'Introduction to Python Programming', date: '2020–2023' },
          { text: 'IT Foundation', date: '2016–2022' },
          { text: 'Techno-Art Capstone Project', date: '2018–2026' },
          { text: 'Sophomore Career Seminar (Creative Technology Management)', date: '2026' },
          { text: 'Operations Research and Management Science for CTM', date: '2022' },
          { text: 'Creative Technology for Social Innovation', date: '2022' },
          { text: 'Social Innovation Capstone Project 2', date: '2017–2018' },
          { text: 'Leadership Seminar in Techno-Art Entrepreneurship', date: '2018–2019' },
          { text: 'Smart Service Systems', date: '2017' },
          { text: 'Everyday Computing and the Internet', date: '2017' },
          { text: 'User Experience Design', date: '2019' },
          { text: 'Undergraduate Directed Study', date: '2020–2022' }
        ]
      }
    }
  },
  {
    id: 'ryu-kunhee', role: 'Lab Manager', title: 'Associate Manager & Lab Manager',
    name: 'Kunhee Ryu', nameKo: '류건희', affil: "CTM '19 · M.S. Innovation '23",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/ryu-kunhee.svg',
    bio: "Kunhee Ryu is the Lab Manager and Associate Manager of HAIR Lab and a graduate researcher in Innovation. He co-authors the lab's work on multi-agent LLM systems, autonomous meta-analysis (AutoMETA), and human–AI interaction & trust."
  },
  {
    id: 'lee-sooyoung', role: 'Ph.D. Student', name: 'Sooyoung Lee', nameKo: '이수영', affil: 'Ph.D. · Science & Technology Policy',
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/lee-sooyoung.svg',
    bio: 'Sooyoung Lee is a Ph.D. student in Science and Technology Policy at HAIR Lab.'
  },
  {
    id: 'park-seongwon', role: 'Ph.D. Student', name: 'Seongwon Park', nameKo: '박성원', affil: 'Ph.D. · Science & Technology Policy',
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/park-seongwon.svg',
    bio: 'Seongwon Park is a Ph.D. student in Science and Technology Policy at HAIR Lab.'
  },
  {
    id: 'kim-minje', role: 'Researcher', name: 'Minje Kim', nameKo: '김민제', affil: "Econ & CTM '19 · M.S. Innovation '23",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/kim-minje.svg',
    bio: 'Minje Kim completed an M.S. in Innovation and is a researcher at HAIR Lab, working on privacy in LLM agents and multi-agent norm dynamics.'
  },
  {
    id: 'svetasheva-arina', role: 'Researcher', name: 'Arina Svetasheva', affil: "M.S. Innovation '23",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/svetasheva-arina.svg',
    bio: 'Arina Svetasheva completed an M.S. in Innovation and is a researcher at HAIR Lab, working on large language models for effective and efficient hate-speech detection.'
  },
  {
    id: 'gasparini-abebe', role: 'Researcher', name: 'Abebe Gasparini', affil: "M.S. Innovation '23",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/gasparini-abebe.svg',
    bio: 'Abebe Gasparini completed an M.S. in Innovation and is a researcher at HAIR Lab.'
  },
  {
    id: 'farias-lucas', role: 'M.S. Student', name: 'Lucas Farias', affil: 'M.S. Innovation',
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/farias-lucas.svg',
    bio: 'Lucas Farias is an M.S. student in Innovation at HAIR Lab.'
  },
  {
    id: 'marry-anne', role: 'M.S. Student', name: 'Marry Anne', affil: 'M.S. Innovation',
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/marry-anne.svg',
    bio: 'Marry Anne is an M.S. student in Innovation at HAIR Lab.'
  },
  {
    id: 'aguilar-daniela', role: 'M.S. Student', name: 'Daniela Rocio Aguilar de La Torre', affil: 'M.S. Innovation',
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/aguilar-daniela.svg',
    bio: 'Daniela Rocio Aguilar de La Torre is an M.S. student in Innovation at HAIR Lab.'
  },
  {
    id: 'lee-jinho', role: 'M.S. Student', name: 'Jinho Lee', nameKo: '이진호', affil: 'M.S. Digital Analytics',
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/lee-jinho.svg',
    bio: 'Jinho Lee is an M.S. student in Digital Analytics at HAIR Lab.'
  },
  {
    id: 'koo-joonhui', role: 'Intern', name: 'Joonhui Koo', nameKo: '구준회', affil: 'Research Intern',
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/koo-joonhui.svg',
    bio: 'Joonhui Koo is a research intern at HAIR Lab.'
  },
  {
    id: 'nemo-chowchuvech', role: 'Undergraduate Researcher', name: 'Wutthipat Chowchuvech', affil: "CTM '24",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/nemo-chowchuvech.svg',
    bio: 'Wutthipat Chowchuvech is an undergraduate researcher (Creative Technology Management) at HAIR Lab.'
  },
  {
    id: 'yoo-hogyun', role: 'Undergraduate Researcher', name: 'Hogyun Yoo', nameKo: '유호균', affil: "CTM '22",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/yoo-hogyun.svg',
    bio: 'Hogyun Yoo is an undergraduate researcher (Creative Technology Management) at HAIR Lab.'
  },
  {
    id: 'hwang-seongjoon', role: 'Undergraduate Researcher', name: 'Seongjoon Hwang', nameKo: '황성준', affil: "CTM '24",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/hwang-seongjoon.svg',
    bio: 'Seongjoon Hwang is an undergraduate researcher (Creative Technology Management) at HAIR Lab.'
  },
  {
    id: 'tae-gayeong', role: 'Undergraduate Researcher', name: 'Gayeong Tae', nameKo: '태가영', affil: "CTM '23",
    department: 'Underwood International College, Yonsei University', image: 'images/avatars/tae-gayeong.svg',
    bio: 'Gayeong Tae is an undergraduate researcher (Creative Technology Management) at HAIR Lab.'
  }
];

/* ---------------- Alumni ---------------- */
const alumni = [
  { name: 'Dongkyu Lee', nameKo: '이동규', cohort: "CTM '12", now: 'LG AI Research — Ph.D. in Computer Science, HKUST; previously interned at Amazon' },
  { name: 'Haksong Lim', nameKo: '임학송', cohort: "CTM '12", now: 'Resera Capital — M.S. in Business Analytics, Columbia University' },
  { name: 'Jaekeun Lee', nameKo: '이재근', cohort: "CTM '13", now: 'AI Solution Dept., NH Investment & Securities — M.S. in Data Science, UBC' },
  { name: 'Hayoung Cho', nameKo: '조하영', cohort: "CTM '14", now: 'Freddie Mac — M.S. in Applied Analytics, Columbia University' },
  { name: 'Jeongwon Jo', nameKo: '조정원', cohort: "CTM '15", now: 'Ph.D. candidate, Information Science & Technology, Penn State University (adv. John Carroll)' },
  { name: 'Seokhyun Hong', nameKo: '홍석현', cohort: "CTM '15", now: 'Hyperconnect — previously Flitto' },
  { name: 'Jaeyi Joo', nameKo: '주재이', cohort: "CTM '15", now: 'Yonsei University (adv. Sungjoo Bae)' },
  { name: 'Jiyun Kim', nameKo: '김지윤', cohort: "CTM '15", now: '' },
  { name: 'James Jinwoo Han', nameKo: '한진우', cohort: "CTM '15", now: '' },
  { name: 'Kylie Trinh', nameKo: '', cohort: "CTM '15", now: 'Business Intelligence, Shopee' },
  { name: 'Sooan Han', nameKo: '한수안', cohort: "CTM '16", now: '' },
  { name: 'Hyeyoung Ryu', nameKo: '류혜영', cohort: "CTM '16", now: 'Ph.D. student, Information Science (Biomedical & Health Informatics), University of Washington (adv. Wanda Pratt)' },
  { name: 'Hannes Lohmander', nameKo: '', cohort: "CTM '17", now: 'Entrepreneur, Andas.ai — M.S. in Innovation, Yonsei University' },
  { name: 'Seungjin Lee', nameKo: '이승진', cohort: "CTM '17", now: 'SK On — Manager, EV Battery Marketing (US)' },
  { name: 'Juwon Shin', nameKo: '신주원', cohort: "CTM '17", now: 'UNESCO APCEIU — M.S. in International Education Development, University of Pennsylvania' },
  { name: 'Wonchul Kim', nameKo: '김원철', cohort: "DI '18", now: 'Makerspace i7 — M.S. in Design Intelligence' },
  { name: 'Jaewoo Lee', nameKo: '이재우', cohort: "STP '18", now: 'Ph.D. student, University of Cambridge' },
  { name: 'Hyegang Kim', nameKo: '김혜강', cohort: "CTM '18 · M.S. Innovation", now: 'Ph.D. student, University of Toronto' },
  { name: 'Zahra Namira Daniar', nameKo: '', cohort: 'M.S. Innovation', now: '' },
  { name: 'Galih Mekar Arumsari', nameKo: '', cohort: 'M.S. Innovation', now: '' },
  { name: 'Seoyeon Lee', nameKo: '이서연', cohort: "CTM '21", now: 'Graduate School of Law, Yonsei University' }
];

/* ---------------- Publications (REAL — Google Scholar / DBLP) ---------------- */
const raw = [
  ["Can Transparency Help Clinicians Trust AI? Reframing Trust as an Information Foraging and Sensemaking Loop","Kunhee Ryu, Heeyoung Ghang, Sechang Chon, Keeheon Lee (corresponding), Younah Kang","CHI 2026 Extended Abstracts (conference, poster)",2026,null,"https://dblp.org/pid/77/9345.html"],
  ["Your Permission Leaks My Data: Second-Hand Privacy Harms in LLM Agents","Minje Kim, Keeheon Lee (corresponding)","CHI 2026 Extended Abstracts (conference, poster)",2026,null,"https://dblp.org/pid/77/9345.html"],
  ["AutoMETA: A Multi-Agent LLM System for Autonomous Meta-Analysis","Keeheon Lee, Kunhee Ryu","AAMAS 2026 (conference)",2026,null,null],
  ["Manners Maketh MAN: Multi-Agent Norm Dynamics under Cultural Moral Values","Keeheon Lee, Kunhee Ryu, Minje Kim, Hyungjun Gerald Yoo","ACM CHI 2026 Workshop on PoliSim (workshop)",2026,null,null],
  ["Building a consensus: Harmonizing AI ethical guidelines and legal frameworks in Korea for enhanced governance","Jae Woo Lee, Keeheon Lee (corresponding)","Government Information Quarterly (journal)",2025,9,"https://doi.org/10.1016/j.giq.2025.102060"],
  ["Digital Legacy Systems for Young Adults: Emphasizing Relationship-Oriented Perspectives and Physical Artifacts in Death Preparation","Soonho Kwon, Hyunah Jo, Sohee Ryu, Jihwan Ryan Do, HwaJung Lee, JooHyun Lee, Keeheon Lee, Younah Kang","CHI 2025 (conference)",2025,2,"https://dblp.org/pid/77/9345.html"],
  ["“Um, so like, is this how I speak?”: design implications for automated visual feedback systems on speech","Soonho Kwon, Hyojin Lee, Soojeong Park, Yerin Heo, Keeheon Lee, Younah Kang","Behaviour & Information Technology (journal)",2024,null,"https://doi.org/10.1080/0144929X.2023.2256770"],
  ["Harnessing Large Language Models for Effective and Efficient Hate Speech Detection","Arina Svetasheva, Keeheon Lee (corresponding)","HICSS 2024 (conference)",2024,11,"https://hdl.handle.net/10125/107216"],
  ["Measuring Falseness in News Articles based on Concealment and Overstatement","Jiyoung Lee, Keeheon Lee (corresponding)","arXiv preprint (arXiv:2408.00156)",2024,4,"https://arxiv.org/abs/2408.00156"],
  ["The paradigm shift of mass customisation research","Songi Kim, Keeheon Lee (corresponding)","International Journal of Production Research (journal)",2023,59,"https://doi.org/10.1080/00207543.2022.2057256"],
  ["Customization of Roadmap: Human-in-the-Loop Topic Modelling Approach","Jae Young Ho, Keeheon Lee (corresponding)","PICMET 2022 (conference)",2022,4,null],
  ["Counting Pixels for an Effective Axis Detection","Keeheon Lee, Eury Sohn, Kunhee Ryu, Seongmin Oh","IEEE IRI 2022 (conference)",2022,null,"https://doi.org/10.1109/IRI54793.2022.00040"],
  ["A Systematic Review on Social Sustainability of Artificial Intelligence in Product Design","Keeheon Lee","Sustainability (journal)",2021,61,"https://doi.org/10.3390/su13052668"],
  ["Deep Learning's Diminishing Returns: The Cost of Improvement is Becoming Unsustainable","Neil C. Thompson, Kristjan Greenewald, Keeheon Lee, Gabriel F. Manso","IEEE Spectrum (magazine)",2021,256,"https://doi.org/10.1109/MSPEC.2021.9563954"],
  ["The Computational Limits of Deep Learning","Neil C. Thompson, Kristjan Greenewald, Keeheon Lee, Gabriel F. Manso","arXiv preprint (arXiv:2007.05558)",2020,1249,"https://arxiv.org/abs/2007.05558"],
  ["Simple and Steady Interactions Win the Healthy Mentality: Designing a Chatbot Service for the Elderly","Hyeyoung Ryu, Soyeon Kim, Dain Kim, Sooan Han, Keeheon Lee (corresponding), Younah Kang","Proceedings of the ACM on Human-Computer Interaction (CSCW2)",2020,98,"https://doi.org/10.1145/3415223"],
  ["Dynamic semantic network analysis for identifying the concept and scope of social sustainability","Keeheon Lee, Heejun Jung","Journal of Cleaner Production (journal)",2020,97,"https://doi.org/10.1016/j.jclepro.2019.07.060"],
  ["Designing technology entrepreneurship education using computational thinking","Younah Kang, Keeheon Lee","Education and Information Technologies (journal)",2020,48,"https://doi.org/10.1007/s10639-020-10231-2"],
  ["Building Ethical AI from News Articles","Wonjun Kim, Keeheon Lee (corresponding)","IEEE/ITU AI for Good (AI4G) 2020 (conference)",2020,4,null],
  ["Can Chatbots Help Reduce the Workload of Administrative Officers? Implementing and Deploying FAQ Chatbot Service in a University","Keeheon Lee, Jeongmin Jo, Jinwoo Kim, Younah Kang","HCI International 2019 (conference)",2019,71,"https://doi.org/10.1007/978-3-030-23528-4_46"],
  ["A Data-Driven Design Framework for Customer Service Chatbot","Shinhee Hwang, Beomjun Kim, Keeheon Lee (corresponding)","HCI International 2019 (conference)",2019,36,"https://doi.org/10.1007/978-3-030-22577-3_16"],
  ["Agent simulation-based ordinal optimisation for new product design","Hoyeop Lee, Jongsu Lim, Keeheon Lee, Chang Ouk Kim","Journal of the Operational Research Society (journal)",2019,10,"https://doi.org/10.1080/01605682.2018.1447249"],
  ["Factors that influence an individual's intention to adopt a wearable healthcare device: The case of a wearable fitness tracker","Sang Yup Lee, Keeheon Lee (corresponding)","Technological Forecasting and Social Change (journal)",2018,244,"https://doi.org/10.1016/j.techfore.2018.01.022"],
  ["Subject–method topic network analysis in communication studies","Keeheon Lee, Heejun Jung, Min Song","Scientometrics (journal)",2016,49,"https://doi.org/10.1007/s11192-016-2100-5"]
];

function cleanVenue(v) {
  return v.replace(/\s*\((?:[^()]*\b(?:conference|journal|workshop|magazine|poster)\b[^()]*)\)/gi, '').trim();
}
function toLinks(url) {
  if (!url) return {};
  if (url.includes('arxiv.org')) return { arxiv: url };
  if (url.includes('dblp')) return {};                 // profile page, not paper-specific
  if (url.includes('doi.org') || url.includes('/10.')) return { doi: url };
  if (url.includes('hdl.handle.net')) return { pdf: url };
  return { link: url };
}
const AUTHOR_IDS = {
  'keeheon lee': 'prof-kim',
  'kunhee ryu': 'ryu-kunhee',
  'minje kim': 'kim-minje',
  'arina svetasheva': 'svetasheva-arina'
};
function toAuthors(str) {
  return str.split(',').map(s => s.replace(/\(corresponding\)/i, '').trim()).filter(Boolean).map(name => {
    const id = AUTHOR_IDS[name.toLowerCase()];
    return id ? { name, isMember: true, memberId: id } : { name, isMember: false };
  });
}
/* Classify venue: Journal · International Conference · Domestic Conference · Workshop · Preprint · Magazine */
function venueType(venue) {
  const v = venue.toLowerCase();
  if (v.includes('arxiv') || v.includes('preprint')) return 'Preprint';
  if (v.includes('ieee spectrum') || v.includes('magazine')) return 'Magazine';
  if (v.includes('workshop')) return 'Workshop';
  // Korean / domestic conferences
  if (/한국|국내|대한|춘계|추계|학술대회|학회/.test(venue) && !/journal|trans/.test(v)) return 'Domestic Conference';
  // Journals (incl. ACM PACM proceedings, which are journal-indexed)
  if (/journal|quarterly|sustainability|scientometrics|behaviour & information|forecasting|production research|education and information|proceedings of the acm|transactions|\bplos\b/.test(v)) return 'Journal';
  // International conferences
  if (/chi|aamas|hicss|picmet|\biri\b|hci international|cscw|ai4g|ai for good|neurips|\bacl\b|emnlp|naacl|aaai|conference|symposium|proc\./.test(v)) return 'International Conference';
  return 'Journal';
}

// Additional publications (incl. Korean/domestic) from a separate input file
const extra = JSON.parse(fs.readFileSync(path.join(root, 'tools', 'extra-pubs.json'), 'utf8'));
const allRaw = raw.concat(extra.map(p => [p.title, p.authors, p.venue, p.year, p.citations, p.url, p.venueType]));

const publications = allRaw.map((r, i) => {
  const [title, authors, venue, year, citations, url, vtype] = r; // vtype optional override
  const cv = cleanVenue(venue);
  return { id: 'pub-' + (i + 1), year, title, venue: cv, venueType: vtype || venueType(venue), authors: toAuthors(authors), citations, links: toLinks(url) };
});

/* ---------------- Projects (REAL — all 2017+ records from NTIS export + lab list) ----------------
   Division/type uses common Korean research-funding classifications.
   leadPI = actual principal investigator; leadPIId links to a profile only for lab members. */
const tryout = (year, status) => ({
  id: 'tryout-' + year,
  title: 'Incheon Startup Park TRYOUT — Global Demonstration (Scale-up Challenge Lab), ' + year,
  titleKo: year + ' 인천스타트업파크 TRYOUT 대학 실증사업 — 글로벌 실증(스케일업 챌린지랩)',
  status, type: 'Public Demonstration',
  funder: 'Incheon Economic Free Zone (IFEZ) · Incheon Technopark',
  leadPI: 'Keeheon Lee', leadPIId: 'prof-kim',
  startYear: year, endYear: year,
  categories: ['Public Demonstration'],
  description: 'A public proof-of-concept and scale-up support program (Incheon Startup Park “TRYOUT” — Scale-up Challenge Lab). The lab leads the Global track, drawing on Yonsei International Campus’ global network to help startups validate their products and expand overseas.',
  members: ['prof-kim'], image: 'images/default_project.svg', website: '#', publications: []
});

const projects = [
  {
    id: 'decision-intelligence',
    title: 'Decision Intelligence: Computational Linguistic Modeling and Evaluation',
    titleKo: '의사결정 지능: 전산언어적 모델링과 평가',
    status: 'active', type: 'National R&D',
    funder: 'Ministry of Science and ICT (MSIT) · NRF Individual Basic Research',
    leadPI: 'Keeheon Lee', leadPIId: 'prof-kim',
    startYear: 2024, endYear: 2027, categories: ['National R&D'],
    description: 'A national basic-research program (MSIT/NRF) developing computational-linguistic models and evaluation methods for decision intelligence — how language-based AI can model, support, and assess human and collective decision-making.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#',
    publications: ['pub-1', 'pub-8', 'pub-9']
  },
  {
    id: 'visual-understanding-smart-work',
    title: 'Human–Object Interaction-based Visual Understanding for Smart Work',
    titleKo: '스마트 업무수행을 위한 인간-사물 상호작용 기반 시각 정보 이해',
    status: 'completed', type: 'National R&D',
    funder: 'Ministry of Science and ICT (MSIT) · NRF Individual Basic Research',
    leadPI: 'Keeheon Lee', leadPIId: 'prof-kim',
    startYear: 2021, endYear: 2024, categories: ['National R&D'],
    description: 'A national basic-research program (MSIT/NRF) on visual information understanding grounded in human–object interaction, toward AI that supports smart work and everyday tasks.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#',
    publications: ['pub-12']
  },
  {
    id: 'tech-society-data-science',
    title: 'Technology–Society Interaction Data Science: A Generative Adversarial Scenario Model for Strategic Learning',
    titleKo: '기술-사회 상호작용 데이터 사이언스: 전략적 학습을 위한 제너레이티브 대립 시나리오 모형',
    status: 'completed', type: 'National R&D',
    funder: 'Ministry of Science and ICT (MSIT) · NRF Young Researcher',
    leadPI: 'Keeheon Lee', leadPIId: 'prof-kim',
    startYear: 2017, endYear: 2020, categories: ['National R&D'],
    description: 'An early-career national research program (MSIT/NRF) modeling technology–society interaction with generative adversarial scenario models for strategic learning.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#', publications: []
  },
  {
    id: 'bio-knowledge-hypothesis',
    title: 'Big-Knowledge-Driven Automatic Hypothesis Inference for New Bio-Knowledge Discovery',
    titleKo: '거대 지식 그래프 기반 생의학 지식 발견을 위한 자동 가설 추론',
    status: 'completed', type: 'National R&D',
    funder: 'Ministry of Science and ICT (MSIT) · NRF Mid-career Research',
    leadPI: 'Min Song', leadPIId: null,
    startYear: 2019, endYear: 2022, categories: ['National R&D'],
    description: 'A national mid-career research program (MSIT/NRF) on automatic hypothesis inference over large knowledge graphs to discover new biomedical knowledge.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#', publications: []
  },
  {
    id: 'urban-disaster-evacuation',
    title: 'Urban Disaster Evacuation Management and Simulation Program Development',
    titleKo: '도시 재난 대피 관리 시뮬레이션 프로그램 개발',
    status: 'completed', type: 'National R&D',
    funder: 'Ministry of Science and ICT (MSIT) · STEAM Research (EDISON)',
    leadPI: 'Sangwon Lee', leadPIId: null,
    startYear: 2017, endYear: 2022, categories: ['National R&D'],
    description: 'A national STEAM/EDISON research program developing a simulation program for managing urban disaster evacuation.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#', publications: []
  },
  {
    id: 'medical-doc-extraction',
    title: 'Algorithms and Software for Raw-Data Extraction and Sensitivity Analysis from Medical Documents',
    titleKo: '의학 관련 문서로부터 원자료 추출 및 민감도 분석 알고리즘과 소프트웨어 개발',
    status: 'completed', type: 'SME R&D',
    funder: 'Ministry of SMEs and Startups · Startup Growth Technology Development (Didimdol)',
    leadPI: 'Seongmin Oh', leadPIId: null,
    startYear: 2021, endYear: 2022, categories: ['SME R&D'],
    description: 'An SME technology-development program (Ministry of SMEs and Startups, Didimdol) building algorithms and software to extract raw data and run sensitivity analysis from medical documents.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#', publications: []
  },
  {
    id: 'kosits-2022-conference',
    title: '2022 Spring Conference of the Korea Society of IT Services',
    titleKo: '한국IT서비스학회 2022년 춘계학술대회',
    status: 'completed', type: 'Academic Event',
    funder: 'Ministry of Science and ICT (MSIT) · ICT Advancement',
    leadPI: 'Heonyoung Kwon', leadPIId: null,
    startYear: 2022, endYear: 2022, categories: ['Academic Event'],
    description: 'Hosting of the 2022 Spring Conference of the Korea Society of IT Services, supported under an MSIT ICT-advancement program.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#', publications: []
  },
  {
    id: 'governance-digital-twin',
    title: 'Governance Digital Twin: Agentic Communication Model and Simulation for Democratic Governance',
    titleKo: '거버넌스 디지털 트윈: 민주적 거버넌스 실험과 평가를 위한 에이전틱 커뮤니케이션 모델 및 시뮬레이션',
    status: 'active', type: 'Institutional Research',
    funder: 'Yonsei Institute for AI Innovation (연세AI혁신연구원)',
    leadPI: 'Keeheon Lee', leadPIId: 'prof-kim',
    startYear: null, endYear: null, categories: ['Institutional Research'],
    description: 'An institute project at the Yonsei Institute for AI Innovation building an agentic communication model and simulation — a “digital twin” for experimenting with, and evaluating, democratic governance.',
    members: ['prof-kim'], image: 'images/default_project.svg', website: '#',
    publications: ['pub-3', 'pub-4', 'pub-5']
  },
  tryout(2026, 'active'),
  tryout(2025, 'completed'),
  tryout(2024, 'completed'),
  tryout(2023, 'completed')
];

/* ---------------- News (rewritten around real publications) ---------------- */
const news = [
  {
    id: 'news-1', slug: 'chi-2026-accepted',
    title: 'Two HAIR Lab papers accepted at CHI 2026',
    date: '2026-01-20', author: 'Keeheon Lee', authorId: 'prof-kim',
    summary: 'Work on reframing clinician trust in AI and on second-hand privacy harms in LLM agents will appear at CHI 2026.',
    content: 'We are delighted to share that two papers from HAIR Lab have been accepted to the ACM CHI Conference on Human Factors in Computing Systems (CHI 2026). “Can Transparency Help Clinicians Trust AI? Reframing Trust as an Information Foraging and Sensemaking Loop” reconsiders how transparency shapes trust, while “Your Permission Leaks My Data: Second-Hand Privacy Harms in LLM Agents” examines emerging privacy risks in agentic systems. Congratulations to everyone involved!',
    image: 'images/default_news.svg', relatedMembers: ['prof-kim', 'ryu-kunhee', 'kim-minje'], relatedProjects: ['decision-intelligence']
  },
  {
    id: 'news-2', slug: 'autometa-aamas-2026',
    title: 'AutoMETA accepted at AAMAS 2026',
    date: '2026-01-10', author: 'Keeheon Lee', authorId: 'prof-kim',
    summary: 'Our multi-agent LLM system for autonomous meta-analysis will be presented at AAMAS 2026.',
    content: 'Our paper “AutoMETA: A Multi-Agent LLM System for Autonomous Meta-Analysis” has been accepted at the International Conference on Autonomous Agents and Multiagent Systems (AAMAS 2026). AutoMETA coordinates multiple LLM agents to carry out the stages of a meta-analysis with minimal human intervention — part of the lab’s broader work on AI for science and meta-research.',
    image: 'images/default_news.svg', relatedMembers: ['prof-kim', 'ryu-kunhee'], relatedProjects: ['governance-digital-twin']
  },
  {
    id: 'news-3', slug: 'giq-ai-governance-2025',
    title: 'AI-governance paper published in Government Information Quarterly',
    date: '2025-09-05', author: 'Keeheon Lee', authorId: 'prof-kim',
    summary: 'A study on harmonizing AI ethics guidelines with legal frameworks in Korea appears in Government Information Quarterly.',
    content: 'Our paper “Building a consensus: Harmonizing AI ethical guidelines and legal frameworks in Korea for enhanced governance” has been published in Government Information Quarterly, a leading journal in digital government. The work proposes how AI ethics principles can be reconciled with existing legal systems to enable more effective governance.',
    image: 'images/default_news.svg', relatedMembers: ['prof-kim'], relatedProjects: ['decision-intelligence']
  },
  {
    id: 'news-4', slug: 'hate-speech-llm-hicss-2024',
    title: 'LLMs for hate-speech detection presented at HICSS 2024',
    date: '2024-01-08', author: 'Keeheon Lee', authorId: 'prof-kim',
    summary: 'Our study on harnessing large language models for effective and efficient hate-speech detection was presented at HICSS 2024.',
    content: 'At the Hawaii International Conference on System Sciences (HICSS 2024), we presented “Harnessing Large Language Models for Effective and Efficient Hate Speech Detection,” showing how LLMs can improve both the accuracy and the efficiency of detecting hate speech — part of our NLP-for-social-good agenda.',
    image: 'images/default_news.svg', relatedMembers: ['prof-kim', 'svetasheva-arina'], relatedProjects: ['decision-intelligence']
  },
  {
    id: 'news-5', slug: 'welcome-international-team',
    title: 'HAIR Lab welcomes a growing international team',
    date: '2025-03-02', author: 'Keeheon Lee', authorId: 'prof-kim',
    summary: 'Researchers from across the world have joined HAIR Lab to work on human–AI collaboration for social good.',
    content: 'HAIR Lab continues to grow into a truly international team, with members joining from around the world to study human–AI interaction, multi-agent systems, computational social science, and AI ethics. We remain committed to research that creates value beneficial to society.',
    image: 'images/default_news.svg', relatedMembers: ['ryu-kunhee', 'kim-minje', 'svetasheva-arina', 'lee-jinho']
  }
];

/* ---------------- Write ---------------- */
fs.writeFileSync(path.join(root, 'data', 'members.json'), JSON.stringify(members, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'data', 'publications.json'), JSON.stringify(publications, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'data', 'projects.json'), JSON.stringify(projects, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'data', 'news.json'), JSON.stringify(news, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'data', 'alumni.json'), JSON.stringify(alumni, null, 2) + '\n');

const banner = '/* ======================================================\n   HAIR Lab — Embedded dataset\n   Lets the site run by double-click (file://) without a server,\n   since browsers block fetch() of local JSON files.\n   common.js fetchJSON() reads from here first.\n   Generated by tools/build-data.js — edit there, not here.\n   ====================================================== */\n';
const out = banner + 'window.HAIR_DATA = ' + JSON.stringify({ members, news, projects, publications, alumni }, null, 2) + ';\n';
fs.writeFileSync(path.join(root, 'js', 'data.js'), out);

console.log('Wrote members(' + members.length + '), alumni(' + alumni.length + '), publications(' + publications.length + '), news(' + news.length + '), projects(' + projects.length + ') → data/*.json + js/data.js');
