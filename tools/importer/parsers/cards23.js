/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow];

  // Map section headings (h2) to their description <p> (from immediately following .cmp-text)
  const sectionDescriptions = {};
  let lastSectionTitle = null;
  Array.from(element.children).forEach((el) => {
    const h2 = el.querySelector && el.querySelector('h2.cmp-title__text');
    if (h2) {
      lastSectionTitle = h2.textContent.trim();
    } else if (
      lastSectionTitle &&
      el.classList &&
      el.classList.contains('text') &&
      el.querySelector('.cmp-text')
    ) {
      const cmpText = el.querySelector('.cmp-text');
      // Use the <p> inside cmp-text, or the whole cmp-text if no <p>
      let desc = cmpText.querySelector('p');
      if (!desc) desc = cmpText;
      // Store a CLONE so it can be reused in several places
      sectionDescriptions[lastSectionTitle] = desc.cloneNode(true);
      lastSectionTitle = null;
    }
  });

  // All cards (contributors & guides)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  cardSections.forEach(section => {
    const image = section.querySelector('.cmp-image__image');
    // Gather all title/subtitle (h3/h5/etc)
    const titles = Array.from(section.querySelectorAll('.cmp-title h1, .cmp-title h2, .cmp-title h3, .cmp-title h4, .cmp-title h5, .cmp-title h6'));
    // Social buttons
    const btnContainer = section.querySelector('.buildingblock.responsivegrid.cmp-buildingblock--btn-list');
    const btnLinks = btnContainer ? Array.from(btnContainer.querySelectorAll('a.cmp-button')) : [];
    let btnDiv = null;
    if (btnLinks.length > 0) {
      btnDiv = document.createElement('div');
      btnLinks.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
    }
    // Find the nearest preceding h2 for section description
    let sectionTitle = null;
    let prev = section.previousElementSibling;
    while (prev) {
      const h2 = prev.querySelector && prev.querySelector('h2.cmp-title__text');
      if (h2) { sectionTitle = h2.textContent.trim(); break; }
      prev = prev.previousElementSibling;
    }
    // Compose text cell: titles, section description, buttons (in that order)
    const cellContent = [];
    titles.forEach(t => cellContent.push(t.cloneNode(true)));
    if (sectionTitle && sectionDescriptions[sectionTitle]) {
      cellContent.push(sectionDescriptions[sectionTitle].cloneNode(true));
    }
    if (btnDiv) cellContent.push(btnDiv);
    if (image && cellContent.length) {
      cells.push([image.cloneNode(true), cellContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
