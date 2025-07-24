/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name must match exactly the specification
  const headerRow = ['Hero (hero39)'];

  // Second row: background image (optional)
  let imageEl = '';
  const teaserImageWrapper = element.querySelector('.cmp-teaser__image');
  if (teaserImageWrapper) {
    const foundImg = teaserImageWrapper.querySelector('img');
    if (foundImg) imageEl = foundImg;
  }
  const imageRow = [imageEl];

  // Third row: text content (title, subheading, description, CTA, etc)
  const textContent = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Title (any heading)
    const title = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) textContent.push(title);
    // Subheading: look for an extra heading after the title (none in this example, but code allows for it)
    // Description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      // We want only the paragraph(s) inside
      Array.from(desc.childNodes).forEach((node) => {
        // append elements (e.g. <p>) or text nodes if any
        if (node.nodeType === 1) {
          textContent.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // text node, non-empty
          const p = document.createElement('p');
          p.textContent = node.textContent;
          textContent.push(p);
        }
      });
    }
    // CTA: look for an <a> inside content (not present in this example, but future-proof)
    const cta = contentWrapper.querySelector('a');
    if (cta) textContent.push(cta);
  }

  const textRow = [textContent];

  // Compose all rows in a 3-row, 1-column table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
