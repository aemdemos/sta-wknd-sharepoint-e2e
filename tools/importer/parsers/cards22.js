/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract everything that makes up a single card (image, headings, subtitle, ctas)
  function extractCard(section) {
    // Use the actual <img> element (not clone)
    const img = section.querySelector('.cmp-image img');

    // Titles: get all .cmp-title__text children (h3, h5, etc.) in order
    const titles = Array.from(section.querySelectorAll('.cmp-title__text'));

    // There are rarely paragraphs, but get any in case (for resilience)
    const paragraphs = Array.from(section.querySelectorAll('p'));

    // Gather all .cmp-button links (socials)
    const socialBtns = Array.from(section.querySelectorAll('a.cmp-button'));
    let socialDiv = null;
    if (socialBtns.length > 0) {
      socialDiv = document.createElement('div');
      socialBtns.forEach((btn) => socialDiv.appendChild(btn));
    }

    // Compose text content as array of EXISTING elements from DOM, not clones
    const textCell = [];
    // Titles (first h3 becomes <strong>, others preserved as is)
    let strongAdded = false;
    titles.forEach((el) => {
      if (el.tagName.toLowerCase() === 'h3' && !strongAdded) {
        const strong = document.createElement('strong');
        strong.textContent = el.textContent;
        textCell.push(strong);
        textCell.push(document.createElement('br'));
        strongAdded = true;
      } else {
        textCell.push(el);
        textCell.push(document.createElement('br'));
      }
    });
    // Paragraphs: only if not already in titles (should not duplicate)
    paragraphs.forEach((p) => {
      if (!titles.includes(p)) {
        textCell.push(p);
        textCell.push(document.createElement('br'));
      }
    });
    // Social buttons
    if (socialDiv) {
      textCell.push(socialDiv);
    }
    // Remove trailing <br>, if present
    while (textCell.length && textCell[textCell.length-1].tagName === 'BR') {
      textCell.pop();
    }
    return [img || '', textCell.length ? textCell : ''];
  }

  // Find all card sections (contributors and guides)
  const cardSections = Array.from(
    element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor')
  );
  const cardRows = cardSections
    .filter(section =>
      section.querySelector('.cmp-image img') && section.querySelector('.cmp-title__text')
    )
    .map(section => extractCard(section));

  if (!cardRows.length) return;

  // Build the table as per block example
  const cells = [
    ['Cards (cards22)'],
    ...cardRows
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
