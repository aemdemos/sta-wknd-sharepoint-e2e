/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor card sections
  const contributorSections = element.querySelectorAll('section.cmp-experience-fragment--contributor');
  if (!contributorSections.length) return;

  const rows = [['Cards (cards6)']];

  contributorSections.forEach((section) => {
    // Get the main image element (reference the existing element)
    const img = section.querySelector('img');

    // Compose the text content cell
    const cellContent = [];

    // Get all headings within this card: name (h3), role(s) (h5)
    const cardHeadings = section.querySelectorAll('h3.cmp-title__text, h5.cmp-title__text');
    cardHeadings.forEach(h => {
      // Reference the existing heading element
      cellContent.push(h);
    });

    // Include any additional descriptive text not in h3/h5
    // (not present in this HTML, but guard for future)
    const cardDescriptions = section.querySelectorAll('.cmp-title__text ~ p, .cmp-title__text ~ span');
    cardDescriptions.forEach(desc => {
      if (desc.textContent.trim()) cellContent.push(desc);
    });

    // Social links (reference the actual <a> elements)
    const socialLinks = section.querySelectorAll('a.cmp-button');
    if (socialLinks.length > 0) {
      const btnContainer = document.createElement('div');
      socialLinks.forEach(btn => btnContainer.appendChild(btn));
      cellContent.push(btnContainer);
    }

    // Only add row if both image and text content exist
    if (img && cellContent.length > 0) {
      rows.push([img, cellContent]);
    }
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
