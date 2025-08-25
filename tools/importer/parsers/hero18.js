/* global WebImporter */
export default function parse(element, { document }) {
  // === 1. Header Row ===
  const headerRow = ['Hero (hero18)']; // Matches example exactly

  // === 2. Hero Image ===
  // Find the first .image block with an <img> tag
  let heroImg = null;
  const imageBlocks = element.querySelectorAll('.image');
  for (const imgBlock of imageBlocks) {
    const img = imgBlock.querySelector('img');
    if (img) {
      heroImg = img;
      break;
    }
  }
  // Fallback: any img
  if (!heroImg) {
    const img = element.querySelector('img');
    if (img) heroImg = img;
  }

  // === 3. Hero Text Content ===
  // The hero text should include:
  // - Main heading (h1)
  // - Subheading/byline (h4, etc.)
  // - First main intro paragraph from contentfragment/article block

  const textContent = [];

  // 3.1. Main Heading
  const h1 = element.querySelector('h1');
  if (h1) textContent.push(h1);

  // 3.2. Subheading/byline
  // Typically rendered as h4 under the first .title
  const h4 = element.querySelector('h4');
  if (h4) textContent.push(h4);

  // 3.3. First intro paragraph from contentfragment/article
  // Find first .contentfragment article or main article block
  let introParagraph = null;
  let foundArticle = null;
  const contentFragments = element.querySelectorAll('article');
  for (const frag of contentFragments) {
    // Only consider the first article with a visible paragraph and not deeply nested
    const p = frag.querySelector('p');
    if (p && p.textContent.trim().length > 0) {
      introParagraph = p;
      foundArticle = frag;
      break;
    }
  }
  if (introParagraph) {
    textContent.push(introParagraph);
  } else {
    // Fallback: get the first paragraph anywhere
    const p = element.querySelector('p');
    if (p) textContent.push(p);
  }

  // === 4. Table Structure ===
  // 1 column, 3 rows: header, image, and hero text
  const cells = [
    headerRow, // Header
    [heroImg ? heroImg : ''], // Image row
    [textContent.length > 0 ? textContent : ''], // Text row
  ];
  // === 5. Replace ===
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
