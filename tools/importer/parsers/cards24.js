/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  function getCardRow(section) {
    // IMAGE: use closest .image container if possible
    let img = section.querySelector('img');
    let imageCell = img ? (img.closest('.image') || img) : null;

    // TEXT: single composite block: <strong>heading</strong>, <div>subtitle</div>, <p>desc</p>, <div>ctas</div>
    const textBlock = document.createElement('div');

    // 1. Heading/Name as <strong> (not heading tag, matches example)
    const h3 = section.querySelector('h3');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent;
      textBlock.appendChild(strong);
    }

    // 2. Subtitle/Role as <div>
    const h5 = section.querySelector('h5');
    if (h5) {
      const roleDiv = document.createElement('div');
      roleDiv.textContent = h5.textContent;
      textBlock.appendChild(roleDiv);
    }

    // 3. (No card-specific description exists in the HTML, so we skip description per the current data)

    // 4. CTAs (buttons) at the bottom, in a <div>
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    if (buttons.length > 0) {
      const ctaDiv = document.createElement('div');
      buttons.forEach(btn => ctaDiv.appendChild(btn));
      textBlock.appendChild(ctaDiv);
    }

    return [imageCell, textBlock];
  }

  const cells = [
    ['Cards (cards24)'],
    ...cardSections.map(getCardRow)
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
