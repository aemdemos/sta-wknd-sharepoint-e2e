/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header as in the example
  const headerRow = ['Cards (cards3)'];
  const cells = [headerRow];

  // --- Featured Card (first card, prominent at top) ---
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (featuredTeaser) {
    // Image
    let img = null;
    const imgDiv = featuredTeaser.querySelector('.cmp-teaser__image .cmp-image');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }
    // Text content: title, description, CTA
    const textContent = [];
    const pretitle = featuredTeaser.querySelector('.cmp-teaser__pretitle');
    const title = featuredTeaser.querySelector('.cmp-teaser__title');
    const desc = featuredTeaser.querySelector('.cmp-teaser__description');
    const cta = featuredTeaser.querySelector('.cmp-teaser__action-link');

    // Add pretitle if present
    if (pretitle && pretitle.textContent.trim()) {
      const pret = document.createElement('span');
      pret.textContent = pretitle.textContent.trim();
      textContent.push(pret, document.createElement('br'));
    }
    // Add title (strong)
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textContent.push(strong);
    }
    // Add description
    if (desc && desc.textContent.trim()) {
      textContent.push(document.createElement('br'));
      textContent.push(desc);
    }
    // Add CTA (Read More)
    if (cta) {
      textContent.push(document.createElement('br'));
      textContent.push(cta);
    }
    cells.push([img, textContent]);
  }

  // --- All Articles Cards ---
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (imageList) {
    const cardItems = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
    cardItems.forEach((li) => {
      // Image
      let img = null;
      const imgDiv = li.querySelector('.cmp-image-list__item-image .cmp-image');
      if (imgDiv) {
        img = imgDiv.querySelector('img');
      }
      // Text content: title (strong), description
      const textContent = [];
      const titleLink = li.querySelector('.cmp-image-list__item-title-link'); // contains span with title
      const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textContent.push(strong);
      }
      const descSpan = li.querySelector('.cmp-image-list__item-description');
      if (descSpan && descSpan.textContent.trim()) {
        textContent.push(document.createElement('br'));
        textContent.push(descSpan);
      }
      cells.push([img, textContent]);
    });
  }

  // --- Replace element with the new table block ---
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
