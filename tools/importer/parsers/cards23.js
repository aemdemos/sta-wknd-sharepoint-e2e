/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor and guide cards (sections with .cmp-experience-fragment--contributor)
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');

  // Build the table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Cards (cards23)'];
  rows.push(headerRow);

  cardSections.forEach(section => {
    // Find the image (first .cmp-image img)
    const img = section.querySelector('.cmp-image__image');
    if (!img) return;

    // Find the name/title (h3)
    const h3 = section.querySelector('h3.cmp-title__text');
    // Find the subtitle/role (h5)
    const h5 = section.querySelector('h5.cmp-title__text');
    // Find the social links (all .cmp-button inside .buildingblock)
    const socialBlock = section.querySelector('.buildingblock');
    let socialLinks = [];
    if (socialBlock) {
      socialLinks = Array.from(socialBlock.querySelectorAll('a.cmp-button'));
    }

    // Try to find additional description text (e.g. in a <p> or <span> under the name)
    // Sometimes the description is not in h5, but in another element
    let description = '';
    // Look for a <span> or <p> after h3/h5
    const possibleDesc = section.querySelector('span, p');
    if (possibleDesc && possibleDesc.textContent.trim() && (!h5 || possibleDesc.textContent !== h5.textContent)) {
      description = possibleDesc.textContent.trim();
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    if (h3) {
      const title = document.createElement('strong');
      title.textContent = h3.textContent;
      textCell.appendChild(title);
    }
    if (h5) {
      if (h3) textCell.appendChild(document.createElement('br'));
      const subtitle = document.createElement('span');
      subtitle.textContent = h5.textContent;
      textCell.appendChild(subtitle);
    }
    if (description) {
      textCell.appendChild(document.createElement('br'));
      const desc = document.createElement('span');
      desc.textContent = description;
      textCell.appendChild(desc);
    }
    if (socialLinks.length) {
      textCell.appendChild(document.createElement('br'));
      socialLinks.forEach((link, idx) => {
        const a = link.cloneNode(true);
        a.removeAttribute('id');
        textCell.appendChild(a);
        if (idx < socialLinks.length - 1) {
          textCell.appendChild(document.createTextNode(' '));
        }
      });
    }

    // Add the row: [image, text cell]
    rows.push([
      img,
      textCell
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
