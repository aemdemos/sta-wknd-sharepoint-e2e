/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-search section as flexibly as possible to support source variations
  let searchSection = element.querySelector('.cmp-search');
  if (!searchSection) {
    // Fallback: look for section[role="search"]
    searchSection = element.querySelector('section[role="search"]');
  }
  if (!searchSection) {
    // Fallback: look for a descendant with "search" in the class name
    const candidates = element.querySelectorAll('[class*="search"]');
    searchSection = Array.from(candidates).find((el) => el.className && el.className.match(/\bcmp-search(?!__)/));
  }
  if (!searchSection) {
    // If still not found, use the original element as a last resort
    searchSection = element;
  }

  // Attempt to extract the .searchresults.json URL from the form's action attribute
  let searchUrl = '';
  const form = searchSection.querySelector('form[action]');
  if (form) {
    const action = form.getAttribute('action');
    if (action) {
      const match = action.match(/(\/content\/.+?\.searchresults\.json)/);
      if (match) {
        searchUrl = `https://main--helix-block-collection--adobe.hlx.page${match[1]}`;
      }
    }
  }

  // If we have a .searchresults.json url, create a link. Otherwise, include fallback content.
  let cellContent;
  if (searchUrl) {
    const a = document.createElement('a');
    a.href = searchUrl;
    a.textContent = searchUrl;
    cellContent = a;
  } else {
    // Fallback: include all visible text from the search section (preserves text content)
    cellContent = document.createElement('div');
    // Pull all text content, trim, and keep as a single text node
    cellContent.textContent = (searchSection.textContent || '').trim();
  }

  // Table block as per example: 1 column, 2 rows, header 'Search'
  const cells = [
    ['Search'],
    [cellContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
