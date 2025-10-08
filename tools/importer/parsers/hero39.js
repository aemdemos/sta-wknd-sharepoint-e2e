/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero39)'];

  // 2. Find the background image (row 2)
  // Look for an <img> inside the hero block
  const imageEl = element.querySelector('.cmp-teaser__image img');
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Gather text content (row 3)
  // Find the main heading and description
  // Only use actual heading and paragraph elements from the source
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description, p');

  // Compose the content cell
  const content = [];
  if (heading) content.push(heading);
  if (description && description !== heading) content.push(description);

  // Ensure all text content from the source HTML is included
  const contentRow = [content.length ? content : ''];

  // 4. Assemble the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // 5. Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
