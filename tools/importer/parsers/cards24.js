/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as specified in example
  const headerRow = ['Cards (cards24)'];
  const cells = [headerRow];

  // Select all contributor/guide card sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Find all .cmp-text elements that are used as group intros for Contributors and Guides
  const introTexts = Array.from(element.querySelectorAll('.cmp-text'));

  // Logic: First 4 cards use first intro, next 3 use second intro
  // This matches the structure of the provided HTML
  const groupIntroMap = {};
  cardSections.forEach((section, idx) => {
    if (idx === 0 && introTexts[0]) groupIntroMap[idx] = introTexts[0]; // Contributors
    if (idx === 4 && introTexts[1]) groupIntroMap[idx] = introTexts[1]; // Guides
  });

  cardSections.forEach((section, idx) => {
    // Find image
    const img = section.querySelector('img.cmp-image__image');
    // Compose text cell
    const textCell = [];
    // Add all cmp-title__text elements
    section.querySelectorAll('.cmp-title__text').forEach((title, tIdx) => {
      if (title.textContent && title.textContent.trim()) {
        if (tIdx === 0) {
          const strong = document.createElement('strong');
          strong.textContent = title.textContent.trim();
          textCell.push(strong);
        } else {
          textCell.push(document.createElement('br'));
          const span = document.createElement('span');
          span.textContent = title.textContent.trim();
          textCell.push(span);
        }
      }
    });
    // Add group intro paragraph only to first card in each group
    if (groupIntroMap[idx]) {
      textCell.push(document.createElement('br'));
      // Reference <p> inside intro block if present
      const introP = groupIntroMap[idx].querySelector('p') || groupIntroMap[idx];
      textCell.push(introP);
    }
    // Add any paragraph text inside section (rare, fallback)
    section.querySelectorAll('p').forEach(p => {
      if (p.textContent && p.textContent.trim()) {
        textCell.push(document.createElement('br'));
        textCell.push(p);
      }
    });
    // Add social links
    const btnList = section.querySelector('.cmp-buildingblock--btn-list,.buildingblock');
    if (btnList) {
      const socialLinks = Array.from(btnList.querySelectorAll('a.cmp-button'));
      if (socialLinks.length) {
        textCell.push(document.createElement('br'));
        const div = document.createElement('div');
        socialLinks.forEach(a => div.appendChild(a));
        textCell.push(div);
      }
    }
    // Only add row if there is an image and some text
    if (img && textCell.length) {
      cells.push([img, textCell]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
