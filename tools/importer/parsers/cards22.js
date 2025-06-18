/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table with a single-column header row
  const cells = [ ['Cards (cards22)'] ];

  // Find all card sections (contributors and guides)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  cardSections.forEach(section => {
    // First cell: the main image (img element)
    const img = section.querySelector('.cmp-image__image');
    // Second cell: name, subtitle, and buttons (as elements)
    const textParts = [];
    const name = section.querySelector('h3.cmp-title__text');
    const subtitle = section.querySelector('h5.cmp-title__text');
    const btnList = section.querySelector('.cmp-buildingblock--btn-list');
    if (name) textParts.push(name);
    if (subtitle) textParts.push(subtitle);
    if (btnList) textParts.push(btnList);
    // Add the row if at least the image and one text part are present
    if (img && textParts.length) {
      cells.push([img, textParts]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
