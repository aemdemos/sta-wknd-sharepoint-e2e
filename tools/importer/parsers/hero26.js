/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageContainer = element.querySelector('.cmp-teaser__image');

  // Defensive: Find the image element (background image)
  let imageEl = null;
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Defensive: Find the title
  let titleEl = null;
  if (content) {
    titleEl = content.querySelector('.cmp-teaser__title');
  }

  // Defensive: Find the description
  let descEl = null;
  if (content) {
    descEl = content.querySelector('.cmp-teaser__description');
  }

  // Defensive: Find the CTA link
  let ctaEl = null;
  if (content) {
    const ctaContainer = content.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      ctaEl = ctaContainer.querySelector('a');
    }
  }

  // Compose the text block (title, description, CTA)
  const textBlock = document.createElement('div');
  if (titleEl) textBlock.appendChild(titleEl);
  if (descEl) textBlock.appendChild(descEl);
  if (ctaEl) textBlock.appendChild(ctaEl);

  // Build the table rows
  const headerRow = ['Hero (hero26)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [textBlock];

  const cells = [headerRow, imageRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
