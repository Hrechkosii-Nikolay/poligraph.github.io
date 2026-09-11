const fs = require('fs');
const path = require('path');

const siteUrl = 'https://red-line.com.ua';
const defaultSocialImage = { path: '/img/main-hero-bg.jpg', width: 1720, height: 914 };
const socialImages = {
  'biznes_perevirka.html': { path: '/img/biznes-perevirka-bg.jpg', width: 1717, height: 916 },
  'blog.html': { path: '/img/poligraph-news_bg.jpg', width: 1717, height: 916 },
  'blog/yak-pidhotuvatysia-do-perevirky-na-polihrafi.html': { path: '/img/poligraph-news_bg.jpg', width: 1717, height: 916 },
  'konsaltynh.html': { path: '/img/konsaltynh-bg.jpg', width: 1718, height: 916 },
  'perevirka-z-vyizdom.html': { path: '/img/perevirka-z-vyizdom-bg.jpg', width: 1717, height: 916 },
  'perevirka_ec.html': { path: '/img/perevirka_ec_bg.jpg', width: 1717, height: 916 },
  'perevirka_osobustogo_haraktery.html': { path: '/img/perevirka_osobustogo_haraktery-bg.jpg', width: 1720, height: 914 },
  'perevirka_personalu.html': { path: '/img/perevirka_personalu-bg.jpg', width: 1721, height: 914 },
  'pro_nas.html': { path: '/img/pro_nas-bg.jpg', width: 1718, height: 916 },
  'rozsliduvannya_incydentiv.html': { path: '/img/rozsliduvannya_incydentiv-bg.jpg', width: 1721, height: 914 },
  'kyiv-poligraph.html': { path: '/img/city-kyiv-hero.jpg', width: 1920, height: 1080 },
  'lviv-poligraph.html': { path: '/img/city-lviv-hero.jpg', width: 1920, height: 1080 },
  'odesa-poligraph.html': { path: '/img/city-odesa-hero.jpg', width: 1920, height: 1080 },
  'dnipro-poligraph.html': { path: '/img/city-dnipro-hero.jpg', width: 1920, height: 1080 },
  'kharkiv-poligraph.html': { path: '/img/city-kharkiv-hero.jpg', width: 1920, height: 1080 },
  'vinnytsia-poligraph.html': { path: '/img/city-vinnytsia-hero.jpg', width: 1920, height: 1080 },
};
const pages = {
  'index.html': {
    title: 'Перевірка на поліграфі в Україні | Червона лінія',
    description: 'Професійна перевірка на поліграфі для бізнесу та приватних клієнтів. Перевірка персоналу, розслідування інцидентів, виїзд по Україні.',
    keywords: 'перевірка на поліграфі, поліграфолог Україна, перевірка персоналу, поліграф для бізнесу, детектор брехні',
  },
  'biznes_perevirka.html': {
    title: 'Перевірка бізнесу на поліграфі | Червона лінія',
    description: 'Поліграф для бізнесу: перевірка співробітників, кандидатів і партнерів на доброчесність, лояльність та ризики. Конфіденційно по Україні.',
    keywords: 'поліграф для бізнесу, перевірка співробітників, перевірка кандидатів, перевірка доброчесності, поліграфолог',
  },
  'konsaltynh.html': {
    title: 'Організація поліграфічної служби під ключ | Червона лінія',
    description: 'Консалтинг та організація внутрішньої поліграфічної служби під ключ: процеси, обладнання, навчання та стандарти перевірки персоналу.',
    keywords: 'поліграфічна служба, консалтинг поліграф, поліграф для компанії, організація перевірок, перевірка персоналу',
  },
  'perevirka-z-vyizdom.html': {
    title: 'Перевірка на поліграфі з виїздом | Червона лінія',
    description: 'Виїзна перевірка на поліграфі у вашому місті, офісі або іншій погодженій локації. Професійне обладнання та конфіденційний підхід.',
    keywords: 'виїзна перевірка на поліграфі, поліграф з виїздом, поліграфолог на виїзд, перевірка в офісі',
  },
  'perevirka_ec.html': {
    title: 'Перевірка на поліграфі в країнах ЄС | Червона лінія',
    description: 'Перевірка на поліграфі з виїздом до країн Європейського Союзу для приватних клієнтів і бізнесу. Узгоджуємо локацію та формат дослідження.',
    keywords: 'поліграф ЄС, перевірка на поліграфі в Європі, виїзд поліграфолога за кордон, поліграф у країнах ЄС',
  },
  'perevirka_osobustogo_haraktery.html': {
    title: 'Перевірка на поліграфі особистого характеру | Червона лінія',
    description: 'Приватна перевірка на поліграфі для з’ясування важливих обставин. Добровільно, конфіденційно та з поясненням результатів дослідження.',
    keywords: 'приватна перевірка на поліграфі, поліграф особистого характеру, детектор брехні, конфіденційна перевірка',
  },
  'perevirka_personalu.html': {
    title: 'Перевірка персоналу на поліграфі | Червона лінія',
    description: 'Перевірка персоналу та кандидатів на поліграфі: доброчесність, лояльність, ризики й безпека бізнесу. Працюємо по всій Україні.',
    keywords: 'перевірка персоналу на поліграфі, поліграф кандидатів, перевірка працівників, поліграф для HR',
  },
  'rozsliduvannya_incydentiv.html': {
    title: 'Розслідування інцидентів на поліграфі | Червона лінія',
    description: 'Поліграфологічне розслідування інцидентів для бізнесу: крадіжки, витоки інформації, конфлікти та інші внутрішні ризики.',
    keywords: 'розслідування інцидентів, поліграф розслідування, службове розслідування, перевірка на крадіжку',
  },
  'sudova_ekspertyza.html': {
    title: 'Судова психологічна експертиза на поліграфі | Червона лінія',
    description: 'Судова та позасудова психологічна експертиза із застосуванням поліграфа. Професійний підхід, структурований висновок і конфіденційність.',
    keywords: 'судова експертиза поліграф, психологічна експертиза, поліграфологічна експертиза, висновок поліграфолога',
  },
  'pro_nas.html': {
    title: 'Про компанію Червона лінія | Поліграф в Україні',
    description: '«Червона лінія» — команда поліграфологів для перевірок персоналу, приватних досліджень та бізнес-завдань по всій Україні.',
    keywords: 'Червона лінія, поліграфологи Україна, послуги поліграфолога, перевірка на поліграфі',
  },
  'blog.html': {
    title: 'Блог про поліграф і перевірки | Червона лінія',
    description: 'Корисні статті про перевірку на поліграфі: підготовка до тестування, конфіденційність, перевірка персоналу та робота поліграфолога.',
    keywords: 'блог про поліграф, підготовка до поліграфа, перевірка персоналу, поради поліграфолога',
  },
  'blog/yak-pidhotuvatysia-do-perevirky-na-polihrafi.html': {
    title: 'Як підготуватися до перевірки на поліграфі | Червона лінія',
    description: 'Як підготуватися до перевірки на поліграфі: поради поліграфолога, порядок тестування, добровільна згода та конфіденційність дослідження.',
    keywords: 'як підготуватися до поліграфа, підготовка до перевірки на поліграфі, тест на поліграфі, поради поліграфолога',
    type: 'article',
  },
  'polityka_konfidentsinosti.html': {
    title: 'Політика конфіденційності | Червона лінія',
    description: 'Політика конфіденційності сайту «Червона лінія»: порядок обробки, зберігання та захисту персональних даних відвідувачів і клієнтів.',
    keywords: 'політика конфіденційності, захист персональних даних, обробка персональних даних',
  },
  'kyiv-poligraph.html': {
    title: 'Поліграф у Києві — перевірка на поліграфі | Червона лінія',
    description: 'Перевірка на поліграфі в Києві для бізнесу та приватних клієнтів. Власні фахівці в місті, конфіденційний підхід і професійне обладнання.',
    keywords: 'поліграф Київ, поліграфолог Київ, перевірка на поліграфі Київ, перевірка персоналу Київ',
  },
  'lviv-poligraph.html': {
    title: 'Поліграф у Львові — перевірка на поліграфі | Червона лінія',
    description: 'Перевірка на поліграфі у Львові для приватних клієнтів і бізнесу. Власні спеціалісти у місті, перевірка персоналу та консультація.',
    keywords: 'поліграф Львів, поліграфолог Львів, перевірка на поліграфі Львів, перевірка персоналу Львів',
  },
  'odesa-poligraph.html': {
    title: 'Поліграф в Одесі — перевірка на поліграфі | Червона лінія',
    description: 'Перевірка на поліграфі в Одесі для бізнесу та приватних клієнтів. Власні фахівці у місті, професійне обладнання та конфіденційність.',
    keywords: 'поліграф Одеса, поліграфолог Одеса, перевірка на поліграфі Одеса, перевірка персоналу Одеса',
  },
  'dnipro-poligraph.html': {
    title: 'Поліграф у Дніпрі — перевірка на поліграфі | Червона лінія',
    description: 'Перевірка на поліграфі у Дніпрі для приватних клієнтів і компаній. Власні спеціалісти у місті, перевірка персоналу та виїзні послуги.',
    keywords: 'поліграф Дніпро, поліграфолог Дніпро, перевірка на поліграфі Дніпро, перевірка персоналу Дніпро',
  },
  'kharkiv-poligraph.html': {
    title: 'Поліграф у Харкові — перевірка на поліграфі | Червона лінія',
    description: 'Перевірка на поліграфі в Харкові для бізнесу та приватних клієнтів. Власні фахівці у місті, сучасне обладнання й конфіденційний підхід.',
    keywords: 'поліграф Харків, поліграфолог Харків, перевірка на поліграфі Харків, перевірка персоналу Харків',
  },
  'vinnytsia-poligraph.html': {
    title: 'Поліграф у Вінниці — перевірка на поліграфі | Червона лінія',
    description: 'Перевірка на поліграфі у Вінниці для бізнесу та приватних клієнтів. Власні спеціалісти у місті, перевірка персоналу та консультація.',
    keywords: 'поліграф Вінниця, поліграфолог Вінниця, перевірка на поліграфі Вінниця, перевірка персоналу Вінниця',
  },
};

for (const [file, seo] of Object.entries(pages)) {
  const filePath = path.join(__dirname, '..', file);
  const canonical = `${siteUrl}/${file === 'index.html' ? '' : file}`;
  const socialImage = socialImages[file] || defaultSocialImage;
  const meta = [
    `<meta name="description" content="${seo.description}">`,
    `<meta name="keywords" content="${seo.keywords}">`,
    '<meta name="robots" content="index, follow">',
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:locale" content="uk_UA">`,
    `<meta property="og:type" content="${seo.type || 'website'}">`,
    `<meta property="og:title" content="${seo.title}">`,
    `<meta property="og:description" content="${seo.description}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${siteUrl}${socialImage.path}">`,
    '<meta property="og:image:type" content="image/jpeg">',
    `<meta property="og:image:width" content="${socialImage.width}">`,
    `<meta property="og:image:height" content="${socialImage.height}">`,
    '<meta property="og:site_name" content="Red line">',
    '<meta name="twitter:card" content="summary">',
    '<meta name="theme-color" content="#0b0b0b">',
  ].join('\n  ');

  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/<html\b[^>]*>/i, '<html lang="uk">');
  html = html
    .replace(/^\s*<meta\s+(?:name|property)=["'](?:description|keywords|robots|theme-color|twitter:card|og:[^"']+)["'][^>]*>\s*\n?/gim, '')
    .replace(/^\s*<link\s+rel=["']canonical["'][^>]*>\s*\n?/gim, '');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>\n  ${meta}`);
  fs.writeFileSync(filePath, html);
}

console.log(`Updated SEO metadata for ${Object.keys(pages).length} pages.`);
