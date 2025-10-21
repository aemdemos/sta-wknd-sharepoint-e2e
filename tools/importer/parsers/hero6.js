/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero6) block parsing
  // 1 column, 3 rows: [header], [image], [content]

  // Helper to get immediate child divs
  const mainDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Find the hero teaser block
  let teaserDiv;
  for (const div of mainDivs) {
    if (div.classList.contains('cmp-container')) {
      const teaser = div.querySelector('.teaser.cmp-teaser--hero');
      if (teaser) {
        teaserDiv = teaser;
        break;
      }
    }
  }

  // Defensive: fallback if not found
  if (!teaserDiv) return;

  // Extract image element
  let imageElem = null;
  const imageWrapper = teaserDiv.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) imageElem = img;
  }

  // Extract heading/title, trim whitespace
  let titleElem = null;
  const contentDiv = teaserDiv.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      // Clone and trim text
      const clone = heading.cloneNode(true);
      clone.textContent = heading.textContent.trim();
      titleElem = clone;
    }
  }

  // Table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageElem ? imageElem : ''];
  const contentRow = [titleElem ? titleElem : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Find the separator <hr> after the hero block
  let hrElem = null;
  // The separator is in the next <main> sibling after the current <main>
  let parentMain = element;
  while (parentMain && parentMain.tagName !== 'MAIN') {
    parentMain = parentMain.parentElement;
  }
  if (parentMain) {
    let nextMain = parentMain.nextElementSibling;
    while (nextMain) {
      if (nextMain.tagName === 'MAIN') {
        const hr = nextMain.querySelector('hr.cmp-separator__horizontal-rule');
        if (hr) {
          hrElem = hr.cloneNode(true);
          break;
        }
      }
      nextMain = nextMain.nextElementSibling;
    }
  }

  // Replace with block and separator if found
  if (hrElem) {
    element.replaceWith(block);
    block.after(hrElem);
  } else {
    element.replaceWith(block);
  }
}
