/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list for "All Articles"
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Build table header
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Process each card
  imageList.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // IMAGE CELL - use the .cmp-image element so we reference the image DOM node
    let imageCell = null;
    const cmpImage = article.querySelector('.cmp-image-list__item-image .cmp-image');
    if (cmpImage) {
      imageCell = cmpImage;
    }

    // TEXT CELL
    const textCellContent = [];
    // Title as heading (h3)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const heading = document.createElement('h3');
      heading.textContent = titleLink.textContent.trim();
      textCellContent.push(heading);
    }
    // Description below heading
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCellContent.push(p);
    }
    // CTA at the bottom (link to the article)
    if (titleLink && titleLink.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.setAttribute('href', titleLink.getAttribute('href'));
      cta.textContent = 'Read More';
      textCellContent.push(cta);
    }

    cells.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the whole image-list block (not just the ul, but the .image-list container)
  const imageListContainer = imageList.closest('.image-list');
  if (imageListContainer) {
    imageListContainer.replaceWith(table);
  }
}
