/* global WebImporter */
export default function parse(element, { document }) {
  // Find the relevant content fragment article
  const cfArticle = element.querySelector('article.cmp-contentfragment--san-diego-surfspots');
  if (!cfArticle) return;

  const rows = [['Cards']];
  const children = Array.from(cfArticle.children);
  let idx = 0;

  // 1. Intro card: everything before first H2
  const introCard = [];
  while (idx < children.length && children[idx].tagName !== 'H2') {
    const el = children[idx];
    if (el.tagName === 'DIV' && el.querySelector('img')) {
      introCard.push(el.querySelector('img'));
    } else if (el.tagName === 'H3' || el.tagName === 'P') {
      introCard.push(el);
    }
    idx++;
  }
  if (introCard.length) {
    rows.push([introCard]);
  }

  // 2. Each section card: H2 + following images/paragraphs until next H2
  while (idx < children.length) {
    if (children[idx].tagName === 'H2') {
      const card = [];
      // Card heading as <strong>
      const strong = document.createElement('strong');
      strong.textContent = children[idx].textContent;
      card.push(strong);
      idx++;
      // All following images/paragraphs until next H2 or end
      while (idx < children.length && children[idx].tagName !== 'H2') {
        const el = children[idx];
        if (el.tagName === 'DIV' && el.querySelector('img')) {
          card.push(el.querySelector('img'));
        } else if (el.tagName === 'P') {
          card.push(el);
        }
        idx++;
      }
      rows.push([card]);
    } else {
      idx++;
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  cfArticle.replaceWith(table);
}
