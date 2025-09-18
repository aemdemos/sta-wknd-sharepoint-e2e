/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists and contains the expected structure
  if (!element || !element.querySelector('ul.cmp-image-list')) return;

  // Table header row as specified
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Get all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Each card's content is inside article.cmp-image-list__item-content
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // Image cell: find the img inside the image link
    let imageEl = content.querySelector('.cmp-image-list__item-image-link img');
    // Defensive: fallback if not found
    if (!imageEl) {
      imageEl = document.createElement('span');
      imageEl.textContent = 'Image missing';
    }

    // Text cell: build a fragment with title and description
    const frag = document.createElement('div');
    // Title (as heading)
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = content.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      // If title is a link, wrap heading in link
      if (titleLink && titleLink.href) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(heading);
        frag.appendChild(link);
      } else {
        frag.appendChild(heading);
      }
    }
    // Description
    const desc = content.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // CTA: If title link exists and isn't already used as heading link, add at bottom
    if (titleLink && titleLink.href && (!titleSpan || !frag.querySelector('a'))) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = titleSpan ? titleSpan.textContent : 'Read more';
      frag.appendChild(cta);
    }

    // Add row: [image, text]
    rows.push([imageEl, frag]);
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
