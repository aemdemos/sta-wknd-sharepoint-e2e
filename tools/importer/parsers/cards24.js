/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor/guide section
  function extractCardsFromSections(sections) {
    const cards = [];
    sections.forEach((section) => {
      // Find the image
      const imgDiv = section.querySelector('.image .cmp-image img');
      // Find the name/title
      const nameDiv = section.querySelector('.title .cmp-title__text, .title .cmp-title h3');
      // Find the subtitle/role
      let subtitleDiv = null;
      const allTitles = Array.from(section.querySelectorAll('.title .cmp-title__text'));
      if (allTitles.length > 1) {
        subtitleDiv = allTitles[1];
      } else {
        subtitleDiv = section.querySelector('.title .cmp-title h5');
      }
      // Find the social buttons
      const buttonContainer = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list, .xf-master-building-block');
      let buttons = [];
      if (buttonContainer) {
        buttons = Array.from(buttonContainer.querySelectorAll('a.cmp-button'));
      }
      // Compose text cell
      const textCell = [];
      if (nameDiv) textCell.push(nameDiv.cloneNode(true));
      if (subtitleDiv) {
        textCell.push(document.createElement('br'));
        textCell.push(subtitleDiv.cloneNode(true));
      }
      if (buttons.length) {
        textCell.push(document.createElement('br'));
        const btnDiv = document.createElement('div');
        buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
        textCell.push(btnDiv);
      }
      cards.push([
        imgDiv ? imgDiv.cloneNode(true) : '',
        textCell
      ]);
    });
    return cards;
  }

  // Extract headings and intro texts
  const heading1 = element.querySelector('h1');
  const headings = Array.from(element.querySelectorAll('.cmp-title--underline .cmp-title__text'));
  const intros = Array.from(element.querySelectorAll('.cmp-text .cmp-text, .cmp-text p i, .cmp-text i, .cmp-text em'));
  // Only get unique intro texts (avoid duplicates)
  const introSet = new Set();
  intros.forEach(intro => {
    const txt = intro.textContent.trim();
    if (txt) introSet.add(txt);
  });

  // Find all contributor/guide sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build the table rows
  const headerRow = ['Cards (cards24)'];
  const cardRows = extractCardsFromSections(cardSections);
  const cells = [headerRow, ...cardRows];

  // Create a fragment to hold everything
  const frag = document.createDocumentFragment();
  if (heading1) frag.appendChild(heading1.cloneNode(true));
  headings.forEach(h2 => {
    const h2el = document.createElement('h2');
    h2el.textContent = h2.textContent;
    frag.appendChild(h2el);
  });
  introSet.forEach(txt => {
    const pel = document.createElement('p');
    const iel = document.createElement('i');
    iel.textContent = txt;
    pel.appendChild(iel);
    frag.appendChild(pel);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  frag.appendChild(block);

  // Replace the original element
  element.replaceWith(frag);
}
