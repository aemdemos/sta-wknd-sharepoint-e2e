/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor/guide cards (sections)
  const sections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));
  // Prepare header row exactly as in the example
  const rows = [['Cards (cards24)']];

  // For each card, extract image and related text
  sections.forEach(section => {
    // Get image (first <img> in section)
    const img = section.querySelector('img');
    // Compose text cell content
    const textCell = [];

    // All .cmp-title__text elements, maintain order
    const titles = section.querySelectorAll('.cmp-title__text');
    titles.forEach((title, i) => {
      // Name (first h3): bold
      if (title.tagName.toLowerCase() === 'h3' && i === 0) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        textCell.push(strong);
      } else {
        textCell.push(document.createElement('br'));
        textCell.push(title);
      }
    });

    // If there are <p> paragraphs inside the section, include them (support for flexibility)
    section.querySelectorAll('.cmp-text p').forEach(p => {
      textCell.push(document.createElement('br'));
      textCell.push(p);
    });

    // Social buttons: all <a.cmp-button> inside the section
    const socialLinks = Array.from(section.querySelectorAll('a.cmp-button'));
    if (socialLinks.length > 0) {
      textCell.push(document.createElement('br'));
      const socialsDiv = document.createElement('div');
      socialLinks.forEach(a => socialsDiv.appendChild(a));
      textCell.push(socialsDiv);
    }

    // Only add row if both image and at least a name
    if (img && textCell.length > 0) {
      rows.push([img, textCell]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
