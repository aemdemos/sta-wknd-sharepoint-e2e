/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for UL containing LI cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));
  if (!items.length) return;

  // Table header row
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Each card is an LI > ARTICLE
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find the IMG inside the image link
    let imgEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imgEl = img;
    }

    // Text cell: Title, Description, CTA (if any)
    const textContent = [];

    // Title: use the span inside the title link
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element for semantic structure
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textContent.push(heading);
      }
    }

    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.push(descP);
    }

    // CTA: If titleLink exists, add as CTA at bottom (but only if not already used for heading)
    // In this block, the title is the clickable link, so we can add it as CTA if needed
    // But since heading is not a link, add CTA as a link below description
    if (titleLink) {
      // Defensive: only add if href exists and is not empty
      const href = titleLink.getAttribute('href');
      if (href) {
        const cta = document.createElement('a');
        cta.href = href;
        cta.textContent = titleLink.textContent.trim() || href;
        cta.setAttribute('target', '_blank');
        textContent.push(cta);
      }
    }

    // Compose row: [image, textContent]
    rows.push([
      imgEl ? imgEl : '',
      textContent.length ? textContent : ''
    ]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
