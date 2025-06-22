/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero image: first .cmp-image img in the .cmp-container
  let heroImg = null;
  const cmpContainer = element.querySelector('.cmp-container');
  if (cmpContainer) {
    const img = cmpContainer.querySelector('.cmp-image img');
    if (img) heroImg = img;
  }
  if (!heroImg) {
    // fallback: any .cmp-image img in the block
    const img = element.querySelector('.cmp-image img');
    if (img) heroImg = img;
  }

  // 2. Find all headings (main + subheading) that are visually below the hero image, but above the article body
  //   - The first .cmp-title h1 is always the main heading
  //   - Any .cmp-title h4 or h5 that comes immediately after is a byline/subheading
  //   - Both are visually above the body in the screenshot
  let headings = [];
  if (cmpContainer) {
    // Get all .title blocks inside cmpContainer
    const titleBlocks = Array.from(cmpContainer.querySelectorAll('.title'));
    for (const titleBlock of titleBlocks) {
      // Only push actual heading elements (not the container)
      const h = titleBlock.querySelector('h1, h2, h3, h4, h5, h6');
      if (h) headings.push(h);
    }
  }
  // fallback: just get any h1 then any h4/h5/etc.
  if (headings.length === 0) {
    const h1 = element.querySelector('h1');
    if (h1) headings.push(h1);
    const h4 = element.querySelector('h4');
    if (h4) headings.push(h4);
  }

  // 3. Compose the block table with the required structure:
  //    +----------+
  //    | Hero     |
  //    +----------+
  //    | [img]    |
  //    +----------+
  //    | heading  |
  //    +----------+

  const cells = [
    ['Hero'],
    [heroImg || ''],
    [headings.length > 0 ? headings : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
