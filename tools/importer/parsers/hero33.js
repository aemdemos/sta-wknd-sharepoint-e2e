/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Find the main hero image (first .image .cmp-image img)
  let heroImg = null;
  const imgDivs = Array.from(element.querySelectorAll(':scope > div'));
  for (const div of imgDivs) {
    const cmpImg = div.querySelector('.cmp-image img');
    if (cmpImg) {
      heroImg = cmpImg;
      break;
    }
  }

  // Step 2: Gather all direct children between the hero image block and the main content area as hero text
  // The first <main> inside this <main> is the main content area, so everything before that (excluding image) is hero text
  let heroTextEls = [];
  let foundImg = false;
  for (const child of element.children) {
    if (!foundImg && child.classList.contains('image')) {
      foundImg = true;
      continue;
    }
    if (!foundImg) continue;
    // Stop at the first <main> (main content)
    if (child.tagName.toLowerCase() === 'main') break;
    // Ignore empty elements
    if (child.textContent.trim() || child.querySelector('img')) {
      heroTextEls.push(child);
    }
  }

  // Fallback: If no hero text found, use all children except the image and aside/main
  if (!heroTextEls.length) {
    heroTextEls = Array.from(element.children).filter(el =>
      !el.classList.contains('image') &&
      el.tagName.toLowerCase() !== 'main' &&
      el.tagName.toLowerCase() !== 'aside'
    );
  }

  // Compose the cells for the Hero (hero33) block
  const cells = [
    ['Hero (hero33)'],
    [heroImg ? heroImg : ''],
    [heroTextEls.length ? heroTextEls : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
