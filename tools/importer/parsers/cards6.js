/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card-like contributor/guide sections
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  const rows = [['Cards (cards6)']];

  // For each card section extract image and text content
  cardSections.forEach((section) => {
    // IMAGE: Use the first <img> inside .image
    const img = section.querySelector('.image img');

    // TEXT CELL: collect h3 (name), h5 (role), and any social buttons (a.cmp-button)
    const textContainer = document.createElement('div');

    // h3 (name/title)
    const h3 = section.querySelector('h3');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent;
      textContainer.appendChild(strong);
    }

    // h5 (role/description)
    const h5 = section.querySelector('h5');
    if (h5) {
      // Place on new line if h3 exists
      if (h3) textContainer.appendChild(document.createElement('br'));
      const roleDiv = document.createElement('div');
      roleDiv.textContent = h5.textContent;
      textContainer.appendChild(roleDiv);
    }

    // Find all social buttons
    const socialLinks = Array.from(section.querySelectorAll('a.cmp-button'));
    if (socialLinks.length) {
      const socialsDiv = document.createElement('div');
      socialsDiv.style.marginTop = '8px';
      socialLinks.forEach((btn, i) => {
        socialsDiv.appendChild(btn);
        if (i < socialLinks.length - 1) {
          socialsDiv.appendChild(document.createTextNode(' '));
        }
      });
      textContainer.appendChild(socialsDiv);
    }

    // Add any additional text nodes that are direct children of the innermost .cmp-container, and are not in h3/h5/a
    // This is commonly used for extra context or description on some HTML variants
    const container = section.querySelector('.cmp-container');
    if (container) {
      // Get all text nodes that are not inside .image, .button, h3, h5, a, or .buildingblock
      Array.from(container.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            !node.matches('.image, .buildingblock, h3, h5') &&
            !node.querySelector('h3, h5, a.cmp-button')
          ) {
            // Only add if not already included (avoid duplicate text)
            if (!textContainer.textContent.includes(node.textContent.trim())) {
              const clone = node;
              textContainer.appendChild(document.createElement('br'));
              textContainer.appendChild(clone);
            }
          }
        }
      });
    }

    rows.push([img, textContainer]);
  });

  // Replace the original element with the cards block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
