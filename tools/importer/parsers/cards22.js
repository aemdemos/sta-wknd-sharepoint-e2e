/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const imageDiv = section.querySelector('.image .cmp-image');
    let imgEl = null;
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }
    // Find name/title (h3)
    let nameEl = section.querySelector('h3.cmp-title__text');
    // Find subtitle/role (h5)
    let subtitleEl = section.querySelector('h5.cmp-title__text');
    // Find social buttons
    const btnBlock = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
    let socialLinks = [];
    if (btnBlock) {
      socialLinks = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }
    // Compose text cell: name, subtitle, social links
    const textCell = [];
    if (nameEl) {
      textCell.push(nameEl.cloneNode(true));
    }
    if (subtitleEl) {
      textCell.push(document.createElement('br'));
      textCell.push(subtitleEl.cloneNode(true));
    }
    // Add all text nodes under the card (for missing text)
    // Find all direct text under .cmp-title and .cmp-buildingblock--btn-list
    // Also add any other text content in the section
    // Add all visible text nodes under section (excluding h3/h5)
    // Get all text nodes under section except inside .cmp-title__text and .cmp-buildingblock--btn-list
    // Add any additional text content (if present)
    // Defensive: avoid duplicates
    // Add all text nodes under section except h3/h5 and social links
    // For this block, all text is in h3, h5, and social links, so nothing else needed
    if (socialLinks.length > 0) {
      textCell.push(document.createElement('br'));
      const socialDiv = document.createElement('div');
      socialLinks.forEach(link => socialDiv.appendChild(link.cloneNode(true)));
      textCell.push(socialDiv);
    }
    return [imgEl ? imgEl.cloneNode(true) : '', textCell];
  }

  // Find all contributor sections (cards)
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  cardSections.forEach(section => {
    // Defensive: skip if no image
    const imgDiv = section.querySelector('.image .cmp-image');
    if (!imgDiv) return;
    const imgEl = imgDiv.querySelector('img');
    if (!imgEl) return;
    // Add all text content from h3, h5, and social links
    rows.push(extractCard(section));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
