/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get cards content area
  function getCardsContentArea(el) {
    // Find contentfragment, which houses the cards
    return el.querySelector('article.contentfragment');
  }

  // Helper: extract all cards (img, title, desc, address)
  function extractCards(contentEl) {
    const cards = [];
    const cf = contentEl.querySelector('article.cmp-contentfragment');
    if (!cf) return cards;
    const mainContent = cf.querySelector('.cmp-contentfragment__elements');
    if (!mainContent) return cards;

    // Flatten out top-level children (handle div.aem-Grid wrappers)
    let children = [];
    mainContent.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV') {
        // Unwrap aem-Grid > .image/.title/.text, but keep all others
        if (
          node.classList.contains('aem-Grid') ||
          (node.firstElementChild && node.firstElementChild.classList.contains('aem-Grid'))
        ) {
          // Unwrap all children
          let grid = node.classList.contains('aem-Grid') ? node : node.firstElementChild;
          children.push(...Array.from(grid.children));
        } else {
          children.push(node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        children.push(node);
      }
    });

    // Segment into cards using .title h2 as anchor, then assign image, desc, address
    let card = null;
    let foundAny = false;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.classList.contains('title') &&
        child.querySelector('h2')
      ) {
        // New card start
        if (card && (card.title || card.desc.length || card.image)) {
          cards.push(card);
        }
        card = { image: null, title: null, desc: [], address: null };
        // Use the h2 directly
        card.title = child.querySelector('h2');
        foundAny = true;
        continue;
      }
      // Otherwise, fill image, desc, address for the current card
      if (!card) {
        card = { image: null, title: null, desc: [], address: null };
      }
      // Image
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.classList.contains('image') &&
        child.querySelector('img')
      ) {
        card.image = child.querySelector('img');
        continue;
      }
      // Address: <p><i><b>...</b></i></p>
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName === 'P' &&
        child.querySelector('i b')
      ) {
        card.address = child;
        continue;
      }
      // Description: all <p> except address, and <div.text> (e.g. quote blocks)
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName === 'P' &&
        !child.querySelector('i b')
      ) {
        card.desc.push(child);
        continue;
      }
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.classList.contains('text')
      ) {
        card.desc.push(child);
        continue;
      }
    }
    // Push last card
    if (card && (card.title || card.desc.length || card.image)) {
      cards.push(card);
    }
    // Filter out empty cards
    return cards.filter(c => c.title || c.desc.length || c.image);
  }

  // MAIN
  const contentArea = getCardsContentArea(element);
  if (!contentArea) return;
  const cards = extractCards(contentArea);
  if (!cards.length) return;

  // Construct rows: header, then rows of [image, details]
  const rows = [];
  rows.push(['Cards (cards9)']);
  cards.forEach(card => {
    const imgCell = card.image || '';
    const contentCell = [];
    if (card.title) contentCell.push(card.title);
    if (card.desc && card.desc.length > 0) contentCell.push(...card.desc);
    if (card.address) contentCell.push(card.address);
    rows.push([imgCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
