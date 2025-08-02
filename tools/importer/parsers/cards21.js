/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const cells = [['Cards (cards21)']];

  // Collect all children in order
  const children = Array.from(element.children);

  let pendingIntro = null;

  children.forEach((child) => {
    // Intro text block (before a group of cards)
    if (child.classList.contains('text')) {
      const textBlock = child.querySelector('.cmp-text');
      if (textBlock) {
        pendingIntro = textBlock;
      }
      return;
    }
    // Card section
    if (child.tagName && child.tagName.toLowerCase() === 'section' && child.classList.contains('cmp-experience-fragment--contributor')) {
      // Insert any intro text row immediately before first card of each group
      if (pendingIntro) {
        cells.push(['', pendingIntro]);
        pendingIntro = null;
      }
      // Card content
      const img = child.querySelector('img');
      const rightContent = [];
      const name = child.querySelector('h3.cmp-title__text');
      if (name) rightContent.push(name);
      const role = child.querySelector('h5.cmp-title__text');
      if (role) rightContent.push(role);
      const links = Array.from(child.querySelectorAll('a.cmp-button'));
      if (links.length) {
        const div = document.createElement('div');
        links.forEach(link => div.appendChild(link));
        rightContent.push(div);
      }
      cells.push([
        img || '',
        rightContent.length ? rightContent : ''
      ]);
    }
    // Other elements are ignored
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
