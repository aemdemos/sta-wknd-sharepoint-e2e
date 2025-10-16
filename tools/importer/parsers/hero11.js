/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero11) block: 1 column, 3 rows
  // Row 1: Header
  // Row 2: Background Image (optional)
  // Row 3: Headline, Subheading, CTA (optional), Separator (hr)

  // Helper: Get immediate child divs
  const mainDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Find the hero teaser block
  let teaserDiv;
  for (const div of mainDivs) {
    if (div.classList.contains('cmp-container')) {
      const teaser = div.querySelector('.cmp-teaser--hero');
      if (teaser) {
        teaserDiv = teaser;
        break;
      }
    }
  }
  if (!teaserDiv) {
    teaserDiv = element.querySelector('.cmp-teaser--hero');
  }

  // Extract image (background)
  let imageEl = null;
  if (teaserDiv) {
    const imageWrap = teaserDiv.querySelector('.cmp-teaser__image .cmp-image');
    if (imageWrap) {
      const img = imageWrap.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // Extract headline (h2)
  let headlineEl = null;
  if (teaserDiv) {
    const contentDiv = teaserDiv.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      const h2 = contentDiv.querySelector('h2');
      if (h2) headlineEl = h2;
    }
  }

  // Extract separator <hr>
  let hrEl = null;
  const separatorDiv = element.querySelector('.cmp-separator__horizontal-rule');
  if (separatorDiv && separatorDiv.tagName === 'HR') {
    hrEl = separatorDiv;
  }

  // Compose table rows
  const headerRow = ['Hero (hero11)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Row 3: headline and hr (if present)
  const contentRow = [hrEl ? [headlineEl, hrEl] : headlineEl ? headlineEl : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
