/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image list UL
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Each card is a LI
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // Defensive: find the article
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find the image element inside the image link
    let img = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      img = imageLink.querySelector('img');
    }
    // Defensive: if no image, skip card (block requires image)
    if (!img) return;

    // Text cell: Title (as heading), Description, CTA (optional)
    // Title: use span.cmp-image-list__item-title, wrap in <strong> (or <h3> for semantic heading)
    let titleEl = article.querySelector('.cmp-image-list__item-title');
    let title = null;
    if (titleEl) {
      title = document.createElement('strong');
      title.textContent = titleEl.textContent;
    }

    // Description: span.cmp-image-list__item-description
    let descEl = article.querySelector('.cmp-image-list__item-description');
    let desc = null;
    if (descEl) {
      desc = document.createElement('p');
      desc.textContent = descEl.textContent;
    }

    // CTA: if there is a title link, use its href and text
    let cta = null;
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink && titleLink.getAttribute('href')) {
      cta = document.createElement('a');
      cta.href = titleLink.getAttribute('href');
      cta.textContent = titleLink.textContent.trim();
    }

    // Compose text cell: [title, desc, cta] (exclude nulls)
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    // Add row: [image, textCell]
    rows.push([img, textCell]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
