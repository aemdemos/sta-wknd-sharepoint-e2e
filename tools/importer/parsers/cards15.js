/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment for the surf spots cards
  const cf = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!cf) return;
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Helper: get .cmp-image from a .aem-GridColumn, or grid wrapper
  function findCmpImage(div) {
    if (!div) return null;
    return div.querySelector('.cmp-image');
  }

  // Helper: create the card text cell array with heading and paragraph
  function makeTextContent(heading, desc) {
    const arr = [];
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading;
      arr.push(strong, document.createElement('br'));
    }
    if (desc) arr.push(desc);
    return arr;
  }

  // Process cards: scan children of cfElements
  const children = Array.from(cfElements.children);
  const cards = [];
  let i = 0;
  while (i < children.length) {
    // Case: Card with heading (h2)
    if (children[i].tagName === 'H2') {
      const heading = children[i].textContent.trim();
      i++;
      let img = null;
      let desc = null;
      // Optional image in .aem-Grid after h2
      if (children[i] && children[i].tagName === 'DIV') {
        const maybeImg = findCmpImage(children[i]);
        if (maybeImg) {
          img = maybeImg;
          i++;
        }
      }
      // Description paragraph
      if (children[i] && children[i].tagName === 'P') {
        desc = children[i];
        i++;
      }
      if (img && (desc || heading)) {
        cards.push([img, makeTextContent(heading, desc)]);
      }
      continue;
    }
    // Case: Card with image first (intro card)
    if (children[i].tagName === 'DIV') {
      const img = findCmpImage(children[i]);
      if (img) {
        let heading = null;
        // Try to get caption as heading from span.cmp-image__title
        const caption = img.querySelector('.cmp-image__title');
        if (caption) heading = caption.textContent.trim();
        i++;
        let desc = null;
        if (children[i] && children[i].tagName === 'P') {
          desc = children[i];
          i++;
        }
        if (desc) {
          cards.push([img, makeTextContent(heading, desc)]);
        }
        continue;
      }
    }
    // Else, advance
    i++;
  }

  // Only build table if there's at least one card
  if (cards.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      ['Cards (cards15)'],
      ...cards
    ], document);
    element.replaceWith(table);
  }
}
