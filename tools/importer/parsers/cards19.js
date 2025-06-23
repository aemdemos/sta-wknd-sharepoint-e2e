/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the contentfragment container for the main article body.
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Find all h2s, .cmp-image (not hero), and p tags in order of appearance in the contentfragment
  const allElements = Array.from(cfElements.querySelectorAll(':scope > *'));

  // We'll scan for h2s and for each, collect all subsequent elements until the next h2, forming a card.
  const cards = [];
  let idx = 0;
  while (idx < allElements.length) {
    const el = allElements[idx];
    if (
      el.matches('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12') &&
      el.querySelector('h2')
    ) {
      // If this is a grid wrapper containing h2 and maybe img
      const title = el.querySelector('h2');
      let cardImg = el.querySelector('.cmp-image');
      const textContent = [];
      if (title) textContent.push(title);
      // Look ahead for ps and addresses within this grid wrapper
      let next = el.nextElementSibling;
      while (
        next &&
        (!next.querySelector('h2')) &&
        (!next.matches('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12') || next.querySelector('p'))
      ) {
        if (next.querySelector('p')) {
          // add all p's within
          next.querySelectorAll('p').forEach((p) => textContent.push(p));
        }
        if (!cardImg && next.querySelector('.cmp-image')) {
          cardImg = next.querySelector('.cmp-image');
        }
        next = next.nextElementSibling;
      }
      cards.push([cardImg || '', textContent]);
      idx = allElements.indexOf(next);
      if (idx === -1) break; // No more
      continue;
    }
    // Fallback: If direct h2 (not in grid), treat single element as start of card
    if (el.tagName && el.tagName.toLowerCase() === 'h2') {
      const textContent = [el];
      let cardImg = null;
      let curr = idx + 1;
      // Look ahead for img and ps until next h2
      while (
        curr < allElements.length &&
        !(allElements[curr].tagName && allElements[curr].tagName.toLowerCase() === 'h2')
      ) {
        const curEl = allElements[curr];
        if (curEl.classList && curEl.classList.contains('image') && curEl.querySelector('.cmp-image')) {
          cardImg = curEl.querySelector('.cmp-image');
        }
        // Add p tags if present
        if (curEl.tagName && curEl.tagName.toLowerCase() === 'p') {
          textContent.push(curEl);
        }
        curr++;
      }
      cards.push([cardImg || '', textContent]);
      idx = curr;
      continue;
    }
    idx++;
  }

  // Fallback for this HTML: If no cards found, use a more generic approach by splitting at h2s inside cfElements
  if (cards.length === 0) {
    const h2s = Array.from(cfElements.querySelectorAll('h2'));
    h2s.forEach((h2, i) => {
      const textContent = [h2];
      // Get every element between this h2 and the next h2
      let curr = h2.nextElementSibling;
      let cardImg = null;
      while (curr && curr.tagName.toLowerCase() !== 'h2') {
        if (!cardImg && curr.querySelector && curr.querySelector('.cmp-image')) {
          cardImg = curr.querySelector('.cmp-image');
        }
        if (curr.tagName.toLowerCase() === 'p') textContent.push(curr);
        curr = curr.nextElementSibling;
      }
      cards.push([cardImg || '', textContent]);
    });
  }

  // Further fallback: If still not found, try the best effort by chunking the elements using h2s as delimiters
  if (cards.length === 0) {
    const h2s = Array.from(cfElements.querySelectorAll('h2'));
    const images = Array.from(cfElements.querySelectorAll('.cmp-image'));
    for (let i = 0; i < h2s.length; i++) {
      let textContent = [h2s[i]];
      const allPs = Array.from(cfElements.querySelectorAll('p'));
      textContent = textContent.concat(allPs.filter((p, idx) => idx >= i && idx <= i + 1));
      let img = images[i] || '';
      cards.push([img, textContent]);
    }
  }

  // Remove empty card rows
  const filteredCards = cards.filter(card => card[0] || (Array.isArray(card[1]) && card[1].length > 1));

  // Table: header row is single cell, each card is a row of [image, text-content]
  const cells = [
    ['Cards (cards19)'],
    ...filteredCards.map(([img, textArr]) => [img, textArr]),
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
