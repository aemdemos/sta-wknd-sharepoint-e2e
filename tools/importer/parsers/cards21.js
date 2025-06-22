/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor/guide cards (sections with the class 'cmp-experience-fragment--contributor')
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Build the header row exactly as required
  const cells = [['Cards (cards21)']];

  // For each card section, extract the image and all text content (name, subtitle, social buttons)
  cardSections.forEach(section => {
    // Image: get the first <img> inside the section
    const img = section.querySelector('img');

    // Text cell: gather name (h3), subtitle (h5), and all button links in order
    const textCell = document.createElement('div');

    // Name (h3, bold)
    const h3 = section.querySelector('h3');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent;
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    // Subtitle (h5)
    const h5 = section.querySelector('h5');
    if (h5) {
      const subtitle = document.createElement('div');
      subtitle.textContent = h5.textContent;
      textCell.appendChild(subtitle);
    }
    // Buttons
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    if (buttons.length > 0) {
      const btnRow = document.createElement('div');
      buttons.forEach(btn => btnRow.appendChild(btn));
      textCell.appendChild(btnRow);
    }

    // Only add the row if at least image and text content exist
    if (img || textCell.childNodes.length > 0) {
      cells.push([img, textCell]);
    }
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
