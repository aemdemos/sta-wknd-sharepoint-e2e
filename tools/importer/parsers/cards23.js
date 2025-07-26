/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor/guide card sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  const cells = [['Cards (cards23)']];
  cardSections.forEach(section => {
    // Use the innermost container, fallback to section itself
    const root = section.querySelector('.container.responsivegrid.cmp-layout-container--fixed') || section;
    // Get image (first .cmp-image__image)
    const img = root.querySelector('img.cmp-image__image');
    // Get all .cmp-title__text elements in order
    const titles = Array.from(root.querySelectorAll('.cmp-title__text'));
    // Title (name)
    let nameText = '';
    if (titles.length > 0) nameText = titles[0].textContent.trim();
    // Subtitle (role, etc)
    let subtitleText = '';
    if (titles.length > 1) subtitleText = titles[1].textContent.trim();
    // Get all buttons (social links) referenced in DOM (do NOT clone)
    const buttonLinks = Array.from(root.querySelectorAll('a.cmp-button'));
    // Compose text cell: keep structure and all text content
    const textCellElements = [];
    if (nameText) {
      const strong = document.createElement('strong');
      strong.textContent = nameText;
      textCellElements.push(strong);
      textCellElements.push(document.createElement('br'));
    }
    if (subtitleText) {
      const subtitle = document.createElement('span');
      subtitle.textContent = subtitleText;
      textCellElements.push(subtitle);
      textCellElements.push(document.createElement('br'));
    }
    // If there is extra text in this card's container (e.g. p or div), include it
    // But in provided HTML, only .cmp-title__text and buttons are relevant
    // Add button links as a container
    if (buttonLinks.length > 0) {
      const btnDiv = document.createElement('div');
      buttonLinks.forEach(btn => btnDiv.appendChild(btn));
      textCellElements.push(btnDiv);
    }
    // Remove trailing <br> if present
    while (textCellElements.length && textCellElements[textCellElements.length-1].tagName === 'BR') {
      textCellElements.pop();
    }
    // Final text cell (array if multiple, single element if one)
    const textCell = (textCellElements.length === 1) ? textCellElements[0] : textCellElements;
    // Always use the referenced elements from DOM, not clones
    cells.push([img || '', textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
