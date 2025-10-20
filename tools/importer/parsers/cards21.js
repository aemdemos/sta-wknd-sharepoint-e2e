/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, multiple rows, each row = [image, text]
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find the image-list container (holds all cards)
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Find all card items
  const cardItems = imageList.querySelectorAll('li.cmp-image-list__item');
  cardItems.forEach((card) => {
    // Each card's content is inside article
    const article = card.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image element (img)
    let imgEl = article.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback to any img in card
    if (!imgEl) imgEl = article.querySelector('img');

    // --- Text cell ---
    // Title (as heading)
    let titleEl = article.querySelector('.cmp-image-list__item-title');
    // Defensive: fallback to first span
    if (!titleEl) titleEl = article.querySelector('span');
    let headingEl = null;
    if (titleEl) {
      headingEl = document.createElement('h3');
      headingEl.textContent = titleEl.textContent.trim();
    }

    // Description
    let descEl = article.querySelector('.cmp-image-list__item-description');
    // Defensive: fallback to first span after title
    if (!descEl) {
      const spans = article.querySelectorAll('span');
      if (spans.length > 1) descEl = spans[1];
    }
    let descNode = null;
    if (descEl) {
      descNode = document.createElement('p');
      descNode.textContent = descEl.textContent.trim();
    }

    // CTA link (if present)
    let ctaLink = article.querySelector('.cmp-image-list__item-title-link');
    let ctaNode = null;
    if (ctaLink && ctaLink.href) {
      ctaNode = document.createElement('a');
      ctaNode.href = ctaLink.href;
      ctaNode.textContent = ctaLink.textContent.trim();
    }

    // Compose text cell
    const textCell = [];
    if (headingEl) textCell.push(headingEl);
    if (descNode) textCell.push(descNode);
    // Only add CTA if it's not a duplicate of the heading text
    if (ctaNode && ctaNode.textContent !== headingEl?.textContent) textCell.push(ctaNode);

    // Compose row: [image, text]
    rows.push([
      imgEl ? imgEl : '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
