/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Carousel (carousel40)'];

  // Find image cell (first column)
  let imageCell = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find text cell (second column)
  const teaserContent = element.querySelector('.cmp-teaser__content');
  let textCellElements = [];
  if (teaserContent) {
    // Pre-title (optional)
    const pretitle = teaserContent.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      // Use a <p> for pretitle as per HTML semantics
      const pretitleP = pretitle;
      textCellElements.push(pretitleP);
    }
    // Title (h2)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textCellElements.push(title);
    }
    // Description (div)
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textCellElements.push(desc);
    }
    // CTA (link)
    const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) {
        textCellElements.push(ctaLink);
      }
    }
  }

  // If no text elements, use undefined for second cell
  const textCell = textCellElements.length > 0 ? textCellElements : undefined;

  const cells = [
    headerRow,
    [imageCell, textCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
