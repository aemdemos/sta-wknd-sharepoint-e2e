/* global WebImporter */
export default function parse(element, { document }) {
  // Find all .title.cmp-title--underline as section headers
  const headers = Array.from(element.querySelectorAll('.title.cmp-title--underline'));

  // Map: section header text => {introEl, cardSections: []}
  const sectionMap = {};
  const sectionOrder = [];

  // Group the structure by section header and assign intro text
  headers.forEach(header => {
    const h2 = header.querySelector('h2.cmp-title__text');
    if (!h2) return;
    const key = h2.textContent.trim();
    sectionOrder.push(key);
    // Find the next sibling .text as intro
    let intro = null;
    let next = header.nextElementSibling;
    while (next) {
      if (next.classList.contains('text')) {
        intro = next.querySelector('.cmp-text') || next;
        break;
      }
      if (next.classList.contains('title') || next.tagName === 'SECTION') break;
      next = next.nextElementSibling;
    }
    sectionMap[key] = { intro, cards: [] };
  });

  // Assign cards to their respective section
  let currentKey = null;
  const children = Array.from(element.children);
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    const header = headers.find(h => h === el);
    if (header) {
      const h2 = header.querySelector('h2.cmp-title__text');
      if (h2) currentKey = h2.textContent.trim();
      continue;
    }
    if (el.tagName === 'SECTION' && el.classList.contains('cmp-experience-fragment--contributor')) {
      if (currentKey && sectionMap[currentKey]) {
        sectionMap[currentKey].cards.push(el);
      }
    }
  }

  // Helper to build card rows (adds intro row before card rows)
  function buildCardRows(cards, introEl) {
    const rows = [];
    if (introEl && cards.length) {
      rows.push(['', [introEl]]);
    }
    cards.forEach(sec => {
      // Left: image
      const img = sec.querySelector('.image img');
      // Right: headings/byline and links
      const content = [];
      sec.querySelectorAll(':scope .title').forEach(title => {
        Array.from(title.children).forEach(child => {
          if (/^H[1-6]$/i.test(child.tagName)) content.push(child);
        });
      });
      const buttonLinks = Array.from(sec.querySelectorAll('a.cmp-button'));
      if (buttonLinks.length > 0) {
        const btnGroup = document.createElement('div');
        buttonLinks.forEach(link => btnGroup.appendChild(link));
        content.push(btnGroup);
      }
      rows.push([
        img || '',
        content.length ? content : ''
      ]);
    });
    return rows;
  }

  const cells = [['Cards (cards24)']];
  sectionOrder.forEach(key => {
    const d = sectionMap[key];
    cells.push(...buildCardRows(d.cards, d.intro));
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
