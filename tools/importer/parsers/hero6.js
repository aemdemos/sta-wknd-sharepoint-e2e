/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero teaser block (cmp-teaser--hero)
  const hero = element.querySelector('.cmp-teaser--hero');
  if (!hero) return;

  // 2. Extract the background image (if present)
  let imgEl = null;
  const imgContainer = hero.querySelector('.cmp-teaser__image .cmp-image');
  if (imgContainer) {
    imgEl = imgContainer.querySelector('img');
  }

  // 3. Extract the main content (title/heading, subheading, CTA if any)
  const contentContainer = hero.querySelector('.cmp-teaser__content');
  const contentEls = [];
  if (contentContainer) {
    // Push all heading elements found (h1-h6) in order
    contentContainer.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => contentEls.push(h));
    // Push all paragraphs if present
    contentContainer.querySelectorAll('p').forEach(p => contentEls.push(p));
    // Push any anchor/buttons (CTA) if present
    contentContainer.querySelectorAll('a,button').forEach(a => contentEls.push(a));
    // If contentContainer has direct text nodes (unlikely, but possible)
    Array.from(contentContainer.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        contentEls.push(span);
      }
    });
  }

  // 4. Compose the table cells as per the Hero (hero6) block spec
  const cells = [
    ['Hero (hero6)'],
    [imgEl ? imgEl : ''],
    [contentEls.length ? contentEls : '']
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
