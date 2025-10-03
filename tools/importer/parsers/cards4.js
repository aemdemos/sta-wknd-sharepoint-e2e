/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Prepare header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Loop through each card item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Get image (first cell)
    let img = li.querySelector('img');
    if (!img) {
      const imgLink = li.querySelector('a.cmp-image-list__item-image-link');
      if (imgLink) img = imgLink.querySelector('img');
    }

    // Compose text cell by including all visible text content in order
    const textCell = [];
    // Title
    const title = li.querySelector('.cmp-image-list__item-title');
    if (title) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = title.textContent.trim();
      textCell.push(titleEl);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      textCell.push(document.createElement('br'));
      const descEl = document.createElement('span');
      descEl.textContent = desc.textContent.trim();
      textCell.push(descEl);
    }
    // CTA (use the first link that is not the image link)
    const links = li.querySelectorAll('a');
    let ctaLink = null;
    links.forEach(a => {
      if (!a.classList.contains('cmp-image-list__item-image-link')) {
        if (!ctaLink) ctaLink = a;
      }
    });
    if (ctaLink) {
      textCell.push(document.createElement('br'));
      const ctaEl = document.createElement('a');
      ctaEl.href = ctaLink.href;
      ctaEl.textContent = ctaLink.textContent.trim() || 'Read More';
      textCell.push(ctaEl);
    }

    // Compose row: [image, text cell]
    rows.push([img, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
