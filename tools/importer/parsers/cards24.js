/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all contributor/guide sections
  function getContributorSections(root) {
    return Array.from(root.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  }

  // Helper to extract card info from a contributor/guide section
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.cmp-image__image');

    // Find name (h3)
    const name = section.querySelector('h3.cmp-title__text');
    // Find subtitle (h5)
    const subtitle = section.querySelector('h5.cmp-title__text');
    // Find all social links
    const socialLinks = Array.from(section.querySelectorAll('a.cmp-button'));

    // Compose text cell
    const textCell = document.createElement('div');
    if (name) {
      const h3 = document.createElement('h3');
      h3.textContent = name.textContent;
      textCell.appendChild(h3);
    }
    if (subtitle) {
      const p = document.createElement('p');
      p.textContent = subtitle.textContent;
      textCell.appendChild(p);
    }
    // Add all text nodes under .cmp-title that are not h3/h5 (for extra description)
    const extraTitles = section.querySelectorAll('.cmp-title__text');
    extraTitles.forEach(node => {
      if (node !== name && node !== subtitle) {
        const p = document.createElement('p');
        p.textContent = node.textContent;
        textCell.appendChild(p);
      }
    });
    // Add social links
    if (socialLinks.length > 0) {
      const socialsDiv = document.createElement('div');
      socialLinks.forEach(link => {
        const btn = document.createElement('a');
        btn.href = link.href;
        btn.textContent = link.querySelector('.cmp-button__text')?.textContent || link.textContent;
        socialsDiv.appendChild(btn);
      });
      textCell.appendChild(socialsDiv);
    }
    return [img, textCell];
  }

  // Find the main grid (the container with all content)
  const grid = element.querySelector(':scope > div > div');
  if (!grid) return;

  // Find all contributor/guide sections
  const sections = getContributorSections(grid);

  // Compose table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);

  // For each card section, push a row [image, text]
  sections.forEach(section => {
    const [img, textCell] = extractCard(section);
    // Defensive: Only add if image and textCell exist
    if (img && textCell && textCell.textContent.trim()) {
      rows.push([img, textCell]);
    }
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
