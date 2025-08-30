/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, must match example exactly
  const headerRow = ['Hero (hero39)'];

  // Extract background image (optional)
  let imageEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    // find first <img> direct descendant
    imageEl = imageDiv.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // Extract text content: title, description, call-to-action
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentNodes = [];
  if (contentDiv) {
    // Heading (usually h2)
    const heading = contentDiv.querySelector('h2, h1, h3');
    if (heading) contentNodes.push(heading);
    // Subheading/description (optional)
    const description = contentDiv.querySelector('.cmp-teaser__description');
    if (description) {
      // Add all child nodes (typically paragraphs)
      Array.from(description.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentNodes.push(node);
        }
      });
    }
    // Call-to-action: any <a> inside contentDiv
    const link = contentDiv.querySelector('a');
    if (link) contentNodes.push(link);
  }
  const contentRow = [contentNodes.length > 0 ? contentNodes : ''];

  // Construct the block table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
