const fs = require('fs');
const path = require('path');

const siteUrl = 'https://red-line.com.ua';
const organization = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'Red line',
  alternateName: 'Червона лінія',
  url: `${siteUrl}/`,
  logo: `${siteUrl}/img/logo.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+380501234567',
    contactType: 'Customer Support',
    areaServed: 'UA',
    availableLanguage: ['Ukrainian'],
  },
  sameAs: ['https://t.me/red_line_poligraph'],
};

const professionalService = {
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#professional-service`,
  name: 'Червона лінія',
  url: `${siteUrl}/`,
  logo: `${siteUrl}/img/logo.svg`,
  description: 'Професійні перевірки на поліграфі для бізнесу та приватних клієнтів в Україні.',
  telephone: '+380501234567',
  priceRange: '3000-10000 UAH',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "вул. Сім'ї Ідзиковських, 39",
    addressLocality: 'Київ',
    addressRegion: 'Київська область',
    postalCode: '03153',
    addressCountry: 'UA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 50.4260116365543,
    longitude: 30.45008144417932,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00',
  },
  parentOrganization: { '@id': `${siteUrl}/#organization` },
  areaServed: { '@type': 'Country', name: 'Україна' },
  availableLanguage: 'uk',
};

const servicePages = {
  'biznes_perevirka.html': 'Бізнес-перевірка на поліграфі',
  'konsaltynh.html': 'Організація поліграфічної служби під ключ',
  'perevirka-z-vyizdom.html': 'Перевірка на поліграфі з виїздом',
  'perevirka_ec.html': 'Перевірка на поліграфі в країнах ЄС',
  'perevirka_osobustogo_haraktery.html': 'Перевірка на поліграфі особистого характеру',
  'perevirka_personalu.html': 'Перевірка персоналу на поліграфі',
  'rozsliduvannya_incydentiv.html': 'Розслідування інцидентів на поліграфі',
  'sudova_ekspertyza.html': 'Судова психологічна експертиза на поліграфі',
};

const cityPages = {
  'kyiv-poligraph.html': 'Київ',
  'lviv-poligraph.html': 'Львів',
  'odesa-poligraph.html': 'Одеса',
  'dnipro-poligraph.html': 'Дніпро',
  'kharkiv-poligraph.html': 'Харків',
  'vinnytsia-poligraph.html': 'Вінниця',
};

const pageName = (file) => {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  return source.match(/<title>([^<]+)<\/title>/i)?.[1] || 'Червона лінія';
};

const webPage = (file, type = 'WebPage') => ({
  '@context': 'https://schema.org',
  '@type': type,
  name: pageName(file),
  url: `${siteUrl}/${file === 'index.html' ? '' : file}`,
  inLanguage: 'uk-UA',
  isPartOf: { '@id': `${siteUrl}/#website` },
  publisher: { '@id': `${siteUrl}/#organization` },
});

function schemaFor(file) {
  if (file === 'index.html') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        professionalService,
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          name: 'Червона лінія',
          url: `${siteUrl}/`,
          inLanguage: 'uk-UA',
          publisher: { '@id': `${siteUrl}/#organization` },
        },
        webPage(file),
      ],
    };
  }

  if (file === 'pro_nas.html') {
    return {
      '@context': 'https://schema.org',
      '@graph': [organization, professionalService, webPage(file, 'AboutPage')],
    };
  }

  if (servicePages[file]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: servicePages[file],
      url: `${siteUrl}/${file}`,
      provider: { '@id': `${siteUrl}/#professional-service` },
      areaServed: { '@type': 'Country', name: 'Україна' },
      availableLanguage: 'uk',
    };
  }

  if (cityPages[file]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Перевірка на поліграфі у ${cityPages[file]}`,
      url: `${siteUrl}/${file}`,
      provider: { '@id': `${siteUrl}/#professional-service` },
      areaServed: { '@type': 'City', name: cityPages[file] },
      availableLanguage: 'uk',
    };
  }

  if (file === 'blog.html') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Блог «Червоної лінії»',
      url: `${siteUrl}/blog.html`,
      inLanguage: 'uk-UA',
      publisher: { '@id': `${siteUrl}/#organization` },
    };
  }

  if (file === 'blog/yak-pidhotuvatysia-do-perevirky-na-polihrafi.html') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Як підготуватися до перевірки на поліграфі',
      description: 'Поради щодо підготовки до перевірки на поліграфі, порядку тестування, добровільної згоди та конфіденційності.',
      datePublished: '2026-10-11',
      dateModified: '2026-10-11',
      inLanguage: 'uk-UA',
      mainEntityOfPage: `${siteUrl}/${file}`,
      author: { '@id': `${siteUrl}/#organization` },
      publisher: { '@id': `${siteUrl}/#organization` },
    };
  }

  return webPage(file);
}

const files = [
  'index.html', 'biznes_perevirka.html', 'blog.html',
  'blog/yak-pidhotuvatysia-do-perevirky-na-polihrafi.html',
  'dnipro-poligraph.html', 'kharkiv-poligraph.html', 'konsaltynh.html',
  'kyiv-poligraph.html', 'lviv-poligraph.html', 'odesa-poligraph.html',
  'perevirka-z-vyizdom.html', 'perevirka_ec.html',
  'perevirka_osobustogo_haraktery.html', 'perevirka_personalu.html',
  'polityka_konfidentsinosti.html', 'pro_nas.html',
  'rozsliduvannya_incydentiv.html', 'sudova_ekspertyza.html',
  'vinnytsia-poligraph.html',
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  const block = `<script id="structured-data" type="application/ld+json">\n${JSON.stringify(schemaFor(file), null, 2)}\n  </script>`;
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/\s*<script id="structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i, '');
  html = html.replace(/<\/body>/i, `  ${block}\n</body>`);
  fs.writeFileSync(filePath, html);
}

console.log(`Added Schema.org JSON-LD to ${files.length} pages.`);
