const fs = require('fs');
const files = ['about.html', 'collections.html', 'contact.html', 'dashboard.html', 'rooms.html', 'signup.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Mobile Nav Replacement (handles optional newlines)
  const mobileRegex = /<a href="collections\.html"[^>]*>Collections<\/a>\s*<a href="leaderboards\.html"[^>]*>Leaderboards<\/a>/g;
  const mobileReplacement = `<div class="border-b dark:border-gray-800 border-gray-100">
      <p class="text-xs font-mono tracking-widest dark:text-gray-500 text-gray-400 pt-2.5 pb-1">PAGES</p>
      <a href="collections.html" class="nav-link py-2 pl-4 block text-xs border-b dark:border-gray-800 border-gray-100">↳ Collections</a>
      <a href="leaderboards.html" class="nav-link py-2 pl-4 block text-xs">↳ Leaderboards</a>
    </div>`;
      
  content = content.replace(mobileRegex, mobileReplacement);
  
  // Desktop Nav Replacement
  const desktopRegex = /<a href="collections\.html"( class="nav-link(?: active)?")>Collections<\/a>\s*<a href="leaderboards\.html"( class="nav-link(?: active)?")>Leaderboards<\/a>/g;
  
  content = content.replace(desktopRegex, (match, colClass, leadClass) => {
    const isColActive = colClass.includes('active');
    const isLeadActive = leadClass.includes('active');
    
    // If either is active, the parent PAGES button should probably be active
    const parentActiveClass = (isColActive || isLeadActive) ? ' active' : '';
    
    const colLinkClass = isColActive ? 'block px-4 py-2 text-xs font-mono tracking-wider neon-green' : 'block px-4 py-2 text-xs font-mono tracking-wider dark:text-gray-300 text-gray-700 hover:text-green-400 hover:bg-green-400/5 transition-colors';
    
    const leadLinkClass = isLeadActive ? 'block px-4 py-2 text-xs font-mono tracking-wider neon-green' : 'block px-4 py-2 text-xs font-mono tracking-wider dark:text-gray-300 text-gray-700 hover:text-green-400 hover:bg-green-400/5 transition-colors';

    return `<div class="relative group"><button class="nav-link${parentActiveClass} flex items-center gap-1">PAGES <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg></button><div class="absolute top-full left-0 mt-1 w-40 dark:bg-gray-950 bg-white border dark:border-green-900/50 border-gray-100 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1"><a href="collections.html" class="${colLinkClass}">COLLECTIONS</a><a href="leaderboards.html" class="${leadLinkClass}">LEADERBOARDS</a></div></div>`;
  });
  
  fs.writeFileSync(file, content);
}
console.log('Update Complete');
