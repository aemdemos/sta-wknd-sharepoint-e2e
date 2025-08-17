/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header
  const headerRow = ['Carousel (carousel40)'];

  // Find teaser image (first column)
  let img = null;
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    img = imgContainer.querySelector('img');
  }

  // Prepare second column (text cell)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentContainer) {
    // Featured Article pretitle
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textContent.push(pretitle);
    }
    // Main title as heading (preserve h2)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textContent.push(title);
    }
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textContent.push(desc);
    }
    // CTA link
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const cta = ctaContainer.querySelector('a');
      if (cta) {
        textContent.push(cta);
      }
    }
  }

  // Compose table rows
  const rows = [[img, textContent]];
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
