/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Carousel (carousel40)'];

  // Find image element (mandatory)
  let imageElement = null;
  const teaserImage = element.querySelector('.cmp-teaser__image img');
  if (teaserImage) {
    imageElement = teaserImage;
  }

  // Gather text content for the second cell
  const content = element.querySelector('.cmp-teaser__content');
  const contentItems = [];

  if (content) {
    // Pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      contentItems.push(pretitle);
    }
    // Title (optional, should be heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // If it's not already a heading, ensure semantic meaning
      if (/^h[1-6]$/i.test(title.tagName)) {
        contentItems.push(title);
      } else {
        const h2 = document.createElement('h2');
        h2.innerHTML = title.innerHTML;
        contentItems.push(h2);
      }
    }
    // Description (optional)
    const description = content.querySelector('.cmp-teaser__description');
    if (description && description.textContent.trim()) {
      contentItems.push(description);
    }
    // CTA link (optional)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      contentItems.push(cta);
    }
  }

  // Build the carousel rows: always 2 columns per slide
  const rows = [headerRow];
  rows.push([
    imageElement || '',
    contentItems.length ? contentItems : ''
  ]);

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
