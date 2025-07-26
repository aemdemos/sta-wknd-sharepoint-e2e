/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the block
  const headerRow = ['Hero (hero39)'];

  // 2. Get the background image (optional row)
  // It's the .cmp-teaser__image > [data-cmp-is=image] > img
  let imgCell = '';
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    // Use the img element directly if found
    const img = teaserImage.querySelector('img');
    if (img) imgCell = img;
  }

  // 3. Get the text content (title + description)
  let textCell = '';
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Collect all children of .cmp-teaser__content (h2, div, etc) in order
    const nodes = Array.from(content.childNodes).filter(
      node => (node.nodeType === Node.ELEMENT_NODE &&
        (node.tagName.match(/^H[1-6]$/) || node.tagName === 'DIV' || node.tagName === 'P'))
        || node.nodeType === Node.TEXT_NODE
    );
    if (nodes.length > 0) {
      textCell = nodes;
    } else {
      // fallback, use the whole .cmp-teaser__content element
      textCell = content;
    }
  }

  // 4. Compose rows as per block definition: header, image(optional), text content
  const rows = [
    headerRow,
    [imgCell],
    [textCell],
  ];

  // 5. Create the table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
