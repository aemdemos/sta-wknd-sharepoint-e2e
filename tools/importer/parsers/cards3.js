/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from contributor fragment
  function extractCardInfo(section) {
    // Find image
    const imageDiv = section.querySelector('.image .cmp-image img');
    // Find name/title
    const nameDiv = section.querySelector('.title .cmp-title__text, .title .cmp-title h3');
    // Find subtitle/role
    let subtitleDiv = null;
    const subtitle = section.querySelector('.title .cmp-title__text, .title .cmp-title h5');
    // Find social buttons
    const buttonLinks = Array.from(section.querySelectorAll('.cmp-button'));
    // Compose text cell
    const textCell = [];
    if (nameDiv) {
      const h3 = document.createElement('h3');
      h3.textContent = nameDiv.textContent;
      textCell.push(h3);
    }
    if (subtitle && subtitle !== nameDiv) {
      const p = document.createElement('p');
      p.textContent = subtitle.textContent;
      textCell.push(p);
    }
    // Add description text if present (flexible for missing text)
    const descDiv = section.querySelector('.cmp-title + .cmp-title, .cmp-title + .cmp-title--black, .cmp-title + .cmp-title--underline');
    if (descDiv && descDiv.textContent && descDiv.textContent !== nameDiv.textContent && descDiv.textContent !== subtitle.textContent) {
      const descP = document.createElement('p');
      descP.textContent = descDiv.textContent;
      textCell.push(descP);
    }
    // Add social buttons
    if (buttonLinks.length) {
      const btnWrapper = document.createElement('div');
      buttonLinks.forEach(btn => btnWrapper.appendChild(btn.cloneNode(true)));
      textCell.push(btnWrapper);
    }
    return [imageDiv, textCell];
  }

  // Find all contributor sections
  const cards = [];
  // Only select contributor fragments (not other sections)
  const contributorSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  contributorSections.forEach(section => {
    cards.push(extractCardInfo(section));
  });

  // Table header
  const headerRow = ['Cards (cards3)'];
  const tableRows = [headerRow, ...cards];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace element
  element.replaceWith(block);
}
