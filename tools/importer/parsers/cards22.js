/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [['Cards (cards22)']];

  // Extract introductory <p><i> paragraphs for contributors and guides
  const introParagraphs = Array.from(element.querySelectorAll('.cmp-text > p > i'));
  introParagraphs.forEach(introI => {
    const p = introI.parentElement;
    if (p) cells.push([p]);
  });

  // Find all contributor card sections
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  cardSections.forEach(section => {
    // Get the image (first .cmp-image img inside section)
    const imageEl = section.querySelector('.cmp-image img');

    // Gather all text content for the card's right column
    const textContent = [];

    // Get contributor name/title (h3)
    const name = section.querySelector('h3.cmp-title__text');
    if (name) textContent.push(name);

    // Get contributor role/description (h5)
    const role = section.querySelector('h5.cmp-title__text');
    if (role) textContent.push(role);

    // Get any <p> tags directly inside this card (not in social block)
    const paragraphs = Array.from(section.querySelectorAll('p')).filter(p => !p.closest('.buildingblock'));
    paragraphs.forEach(p => textContent.push(p));

    // Get social links (all .cmp-button in .buildingblock)
    const socialBlock = section.querySelector('.buildingblock');
    if (socialBlock) {
      const btns = Array.from(socialBlock.querySelectorAll('a.cmp-button'));
      if (btns.length) {
        const btnContainer = document.createElement('div');
        btns.forEach(btn => btnContainer.appendChild(btn));
        textContent.push(btnContainer);
      }
    }

    // Only include rows with both image and text content
    if (imageEl && textContent.length) {
      cells.push([imageEl, textContent]);
    }
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
