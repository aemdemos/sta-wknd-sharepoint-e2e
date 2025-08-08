/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the block table rows
  // First, determine the number of columns needed (always 2 for carousel: image + content)
  const columns = 2;
  // Header row: single cell, but should span both columns
  const headerRow = [{
    value: 'Carousel (carousel40)',
    colspan: columns,
  }];

  // Find content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Build content cell contents
  const textFragments = [];
  if (content) {
    // Pretitle
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) textFragments.push(pretitle);
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) textFragments.push(title);
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      // Wrap in p if not
      if (desc.tagName.toLowerCase() !== 'p') {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textFragments.push(p);
      } else {
        textFragments.push(desc);
      }
    }
    // CTA
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      const ctaP = document.createElement('p');
      ctaP.appendChild(cta);
      textFragments.push(ctaP);
    }
  }
  // Compose content cell
  const contentCell = textFragments.length ? textFragments : '';

  // Add slide row (2 columns)
  const slideRow = [imageEl, contentCell];

  // Compose cells array: header then slide
  // To support colspan in header, use objects for cell definition
  // WebImporter.DOMUtils.createTable supports cell objects: { value, colspan }
  const cells = [headerRow, slideRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
