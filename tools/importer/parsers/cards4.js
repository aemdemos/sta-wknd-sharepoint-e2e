/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a cmp-image-list__item
  function parseImageListItem(li) {
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let img = null;
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // Title (linked)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let title = null;
    if (titleLink) {
      title = titleLink.querySelector('.cmp-image-list__item-title');
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    // Compose text cell
    const textCell = [];
    if (title) {
      // Make a heading
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent;
      textCell.push(h3);
    }
    if (desc) {
      // Use full HTML content, not just textContent
      if (desc.childNodes.length > 0) {
        desc.childNodes.forEach((node) => {
          textCell.push(node.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textCell.push(p);
      }
    }
    // Add CTA if titleLink exists
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read More';
      textCell.push(cta);
    }
    return [img, textCell];
  }

  // Helper to extract card info from a cmp-teaser block
  function parseTeaser(teaser) {
    // Image
    const img = teaser.querySelector('.cmp-teaser__image img');
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    // CTA (look for link, else use text)
    let cta = teaser.querySelector('.cmp-teaser__action-link');
    if (!cta) {
      // Sometimes it's just text
      const ctaDiv = teaser.querySelector('.cmp-teaser__action-container');
      if (ctaDiv && ctaDiv.textContent.trim()) {
        const ctaEl = document.createElement('span');
        ctaEl.textContent = ctaDiv.textContent.trim();
        cta = ctaEl;
      }
    }
    // Compose text cell
    const textCell = [];
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.push(h3);
    }
    if (desc) {
      // Use full HTML content, not just textContent
      if (desc.childNodes.length > 0) {
        desc.childNodes.forEach((node) => {
          textCell.push(node.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
    }
    if (cta) {
      textCell.push(cta);
    }
    return [img, textCell];
  }

  // Find all cards from cmp-image-list and cmp-teaser blocks
  const rows = [];
  // 1. Cards from .cmp-image-list
  const imageList = element.querySelector('.cmp-image-list');
  if (imageList) {
    const items = imageList.querySelectorAll('.cmp-image-list__item');
    items.forEach((li) => {
      rows.push(parseImageListItem(li));
    });
  }
  // 2. Cards from .cmp-teaser--list (members only)
  const teasers = element.querySelectorAll('.cmp-teaser--list');
  teasers.forEach((teaser) => {
    rows.push(parseTeaser(teaser));
  });

  // Compose table
  const headerRow = ['Cards (cards4)'];
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
