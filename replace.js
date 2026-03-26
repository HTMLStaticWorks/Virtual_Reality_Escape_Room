const fs = require('fs');

const files = [
  'about.html',
  'collections.html',
  'contact.html',
  'home-2.html',
  'index.html',
  'leaderboards.html',
  'rooms.html',
  'services.html',
  'signup.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace desktop
  content = content.replace(
    /(<button id="theme-toggle"(?: |\n|\r|.)*?aria-label="Toggle theme"><\/button>)/i,
    '\n          <button id="rtl-toggle" class="ml-2 dark:text-gray-300 text-gray-600 hover:text-green-400 transition-colors font-bold text-xs" aria-label="Toggle RTL">RTL</button>'
  );
  
  // Replace mobile
  content = content.replace(
    /(<button id="theme-toggle-mobile"(?: |\n|\r|.)*?aria-label="Toggle theme"><\/button>)/i,
    '\n          <button id="rtl-toggle-mobile" class="dark:text-gray-300 text-gray-600 hover:text-green-400 transition-colors font-bold text-xs" aria-label="Toggle RTL">RTL</button>'
  );

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});

// Update dashboard
const dbFile = 'dashboard.html';
let dbContent = fs.readFileSync(dbFile, 'utf8');
dbContent = dbContent.replace(
  '<a href="#avatar" class="text-xs font-mono dark:text-gray-400 text-gray-600 hover:text-green-400 transition-colors py-2">AVATAR</a>',
  '<a href="#avatar" class="text-xs font-mono dark:text-gray-400 text-gray-600 hover:text-green-400 transition-colors py-2">AVATAR</a>\n        <button id="rtl-toggle" class="text-xs font-mono dark:text-gray-400 text-gray-600 hover:text-green-400 transition-colors py-2 font-bold" aria-label="Toggle RTL">RTL</button>'
);
fs.writeFileSync(dbFile, dbContent);
console.log('Updated dashboard.html');
