/* global WebImporter */
export default function parse(element, { document }) {
  // Helper for extracting a card's image and all relevant text/buttons
  function extractCard(section) {
    // Image: first <img> found in the section
    const img = section.querySelector('img');

    // Gather all text content for the right cell
    // Name: first h3, Role: first h5 after h3 (if any), Social: all .button > a
    let name = section.querySelector('h3');
    let role = section.querySelector('h5');
    // If there are additional <p> or text blocks, include those too
    let paragraphs = Array.from(section.querySelectorAll('p')).filter(p => p.textContent.trim());
    // Social links
    const buttonLinks = Array.from(section.querySelectorAll('.button a'));

    // Compose right cell content: [name, role, para(s), social]
    const rightCellContent = [];
    if (name) rightCellContent.push(name);
    if (role) rightCellContent.push(role);
    paragraphs.forEach(p => rightCellContent.push(p));
    if (buttonLinks.length) {
      const socialDiv = document.createElement('div');
      buttonLinks.forEach(a => socialDiv.appendChild(a));
      rightCellContent.push(socialDiv);
    }

    return [img || '', rightCellContent];
  }

  // Table header matches the example exactly
  const cells = [
    ['Cards (cards22)']
  ];

  // Find all card sections (contributors/guides)
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  cardSections.forEach(section => {
    cells.push(extractCard(section));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
