console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'Resume/index.html', title: 'Resume' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'https://github.com/edmondjy', title: 'GitHub' },
];

const BASE_PATH = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? '/'
  : `/${location.pathname.split('/')[1] || ''}/`;

function normalizePath(pathname) {
  return pathname.replace(/index\.html$/, '');
}

function initColorSchemeSwitcher() {
  const label = document.createElement('label');
  label.className = 'color-scheme';
  label.textContent = 'Theme: ';

  const select = document.createElement('select');
  const options = [
    { value: 'light dark', text: 'Automatic' },
    { value: 'light', text: 'Light' },
    { value: 'dark', text: 'Dark' },
  ];

  for (let optionData of options) {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    select.append(option);
  }

  label.append(select);
  document.body.prepend(label);

  const savedScheme = 'colorScheme' in localStorage ? localStorage.colorScheme : 'light dark';
  select.value = savedScheme;
  document.documentElement.style.setProperty('color-scheme', select.value);

  select.addEventListener('input', (event) => {
    const scheme = event.target.value;
    document.documentElement.style.setProperty('color-scheme', scheme);
    localStorage.colorScheme = scheme;
  });
}

initColorSchemeSwitcher();

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  a.classList.toggle(
    'current',
    a.host === location.host && normalizePath(a.pathname) === normalizePath(location.pathname),
  );

  if (a.host !== location.host) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  nav.append(a);
}
