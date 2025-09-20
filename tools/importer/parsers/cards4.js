/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !document) return;

  // Helper to extract cards from the image-list block
  function extractImageListCards(imageList) {
    const cards = [];
    const items = imageList.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      const article = li.querySelector('article.cmp-image-list__item-content');
      if (!article) return;
      // Image
      const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
      let img = null;
      if (imageLink) {
        img = imageLink.querySelector('img');
      }
      // Title
      const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
      let title = null;
      if (titleLink) {
        title = titleLink.querySelector('span.cmp-image-list__item-title');
      }
      // Description
      const desc = article.querySelector('span.cmp-image-list__item-description');
      // Compose text cell
      const textCell = [];
      if (title) {
        const h = document.createElement('h3');
        h.textContent = title.textContent;
        textCell.push(h);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textCell.push(p);
      }
      // Ensure all text content is included
      cards.push([
        img || '',
        textCell.length ? textCell : (desc ? desc.textContent : '')
      ]);
    });
    return cards;
  }

  // Helper to extract cards from teaser blocks
  function extractTeaserCards(teasers) {
    const cards = [];
    teasers.forEach((teaser) => {
      // Image
      let img = null;
      const imgWrap = teaser.querySelector('.cmp-teaser__image');
      if (imgWrap) {
        img = imgWrap.querySelector('img');
      }
      // Title
      let title = null;
      const titleEl = teaser.querySelector('.cmp-teaser__title');
      if (titleEl) {
        const h = document.createElement('h3');
        h.textContent = titleEl.textContent.trim();
        title = h;
      }
      // Description
      let desc = null;
      const descEl = teaser.querySelector('.cmp-teaser__description');
      if (descEl) {
        if (descEl.querySelector('p')) {
          desc = descEl.querySelector('p');
        } else {
          const p = document.createElement('p');
          p.textContent = descEl.textContent.trim();
          desc = p;
        }
      }
      // CTA
      let cta = null;
      const ctaEl = teaser.querySelector('.cmp-teaser__action-container');
      if (ctaEl) {
        const link = ctaEl.querySelector('a');
        if (link) {
          cta = link;
        } else if (ctaEl.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = ctaEl.textContent.trim();
          cta = span;
        }
      }
      // Compose text cell
      const textCell = [];
      if (title) textCell.push(title);
      if (desc) textCell.push(desc);
      if (cta) textCell.push(cta);
      // Ensure all text content is included
      cards.push([
        img || '',
        textCell.length ? textCell : (desc ? desc.textContent : '')
      ]);
    });
    return cards;
  }

  // Find the image-list and teaser blocks
  const imageList = element.querySelector('.image-list.list');
  const teaserBlocks = Array.from(element.querySelectorAll('.teaser.cmp-teaser--list'));

  // Compose the table rows
  const headerRow = ['Cards (cards4)'];
  let rows = [headerRow];

  // Add image-list cards
  if (imageList) {
    rows = rows.concat(extractImageListCards(imageList));
  }
  // Add teaser cards
  if (teaserBlocks.length) {
    rows = rows.concat(extractTeaserCards(teaserBlocks));
  }

  // Only replace if we have at least one card row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
