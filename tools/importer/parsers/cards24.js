/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor and guide fragments
  const fragments = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  if (!fragments.length) return;

  // Table header exactly as required
  const headerRow = ['Cards (cards24)'];

  // Identify section intros: find the cmp-text elements after each h2 title
  // These should be inserted in the first card of each section (contributors, guides)
  const sectionIntroElems = [];
  // Grab all '.title.cmp-title--underline' (these wrap the h2 headings for sections)
  const sectionTitles = Array.from(element.querySelectorAll('.title.cmp-title--underline'));
  sectionTitles.forEach(sectionTitle => {
    let intro = null;
    // The corresponding intro is the next sibling .text .cmp-text element
    let next = sectionTitle.nextElementSibling;
    while (next) {
      if (next.classList.contains('text')) {
        intro = next.querySelector('.cmp-text');
        if (intro) break;
      }
      next = next.nextElementSibling;
    }
    if (intro) sectionIntroElems.push(intro);
  });

  // There are two intros: one for contributors (first 4), one for guides (last 3)

  // Build table rows for each card
  const rows = fragments.map((fragment, idx) => {
    // Find the innermost .cmp-container
    let innerContainer = fragment.querySelector('.cmp-container .cmp-container');
    if (!innerContainer) innerContainer = fragment.querySelector('.cmp-container'); // fallback

    // Image: first <img> inside .cmp-image
    let imgElem = null;
    const cmpImage = innerContainer.querySelector('.cmp-image');
    if (cmpImage) imgElem = cmpImage.querySelector('img');

    // Text cell: gather all content (titles, subtitle, intro, social links)
    const textCellContent = [];
    // Insert the correct section intro only for the first card of each section
    // First 4 cards = contributors, next 3 cards = guides
    if (idx === 0 && sectionIntroElems[0]) {
      textCellContent.push(sectionIntroElems[0]);
    }
    if (idx === 4 && sectionIntroElems[1]) {
      textCellContent.push(sectionIntroElems[1]);
    }

    // Title (h3), Subtitle (h5)
    ['h3.cmp-title__text', 'h5.cmp-title__text'].forEach(sel => {
      const el = innerContainer.querySelector(sel);
      if (el) textCellContent.push(el);
    });

    // Social links: all <a.cmp-button> inside .cmp-buildingblock--btn-list
    const btnList = innerContainer.querySelector('.cmp-buildingblock--btn-list');
    if (btnList) {
      const socialLinks = Array.from(btnList.querySelectorAll('a.cmp-button'));
      if (socialLinks.length > 0) {
        const socialDiv = document.createElement('div');
        socialLinks.forEach(link => socialDiv.appendChild(link));
        textCellContent.push(socialDiv);
      }
    }

    return [imgElem || '', textCellContent.length ? textCellContent : ''];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
