/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards24)'];

  // Extract all card sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Find descriptive paragraphs for contributors & guides
  const titleEls = Array.from(element.querySelectorAll('.cmp-title h2.cmp-title__text'));
  // Find each title's associated description block (.cmp-text)
  const sectionDescs = titleEls.map(titleEl => {
    const parent = titleEl.closest('.cmp-title');
    let next = parent && parent.nextElementSibling;
    while (next) {
      if (next.classList && next.classList.contains('cmp-text')) {
        return next;
      }
      next = next.nextElementSibling;
    }
    return null;
  });
  // Card section indices
  const contributorsStart = 0;
  const contributorsEnd = 4; // 4 contributor cards
  const guidesStart = 4;
  const guidesEnd = 7; // 3 guide cards

  // Compose card rows
  const cardRows = [];
  cardSections.forEach((section, idx) => {
    // Find the innermost container with the card info
    const innerContainers = section.querySelectorAll('.cmp-container');
    let cardContainer = null;
    innerContainers.forEach(cont => {
      if (cont.querySelector('.cmp-image')) {
        cardContainer = cont;
      }
    });
    if (!cardContainer) return;
    // Image
    const img = cardContainer.querySelector('img.cmp-image__image');
    // Compose text content
    const textContent = [];
    // Add section description only on first card of each section
    if (idx === contributorsStart && sectionDescs[0]) {
      textContent.push(sectionDescs[0]);
      textContent.push(document.createElement('br'));
    }
    if (idx === guidesStart && sectionDescs[1]) {
      textContent.push(sectionDescs[1]);
      textContent.push(document.createElement('br'));
    }
    // Name
    const nameTitle = cardContainer.querySelector('h3.cmp-title__text');
    if (nameTitle) {
      const name = document.createElement('strong');
      name.textContent = nameTitle.textContent;
      textContent.push(name);
    }
    // Subtitle
    const subtitleTitle = cardContainer.querySelector('h5.cmp-title__text');
    if (subtitleTitle) {
      textContent.push(document.createElement('br'));
      const subtitle = document.createElement('span');
      subtitle.textContent = subtitleTitle.textContent;
      textContent.push(subtitle);
    }
    // Social CTAs
    const buttonContainer = cardContainer.querySelector('.cmp-buildingblock--btn-list, .cmp-buildingblock');
    if (buttonContainer) {
      const buttons = Array.from(buttonContainer.querySelectorAll('.cmp-button'));
      if (buttons.length > 0) {
        textContent.push(document.createElement('br'));
        const btnDiv = document.createElement('div');
        buttons.forEach(btn => btnDiv.appendChild(btn));
        textContent.push(btnDiv);
      }
    }
    if (img && textContent.length > 0) {
      cardRows.push([
        img,
        textContent
      ]);
    }
  });

  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
