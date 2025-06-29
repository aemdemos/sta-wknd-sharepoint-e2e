/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero13)'];

  // --- IMAGE ROW ---
  // Find the first .cmp-tabs__tabpanel (Overview) and get the first <img> inside
  let heroImage = null;
  const overviewTabPanel = element.querySelector('.cmp-tabs__tabpanel');
  if (overviewTabPanel) {
    const img = overviewTabPanel.querySelector('img');
    if (img) heroImage = img;
  }
  // Fallback: any <img> in the element
  if (!heroImage) {
    const anyImg = element.querySelector('img');
    if (anyImg) heroImage = anyImg;
  }
  const imageRow = [heroImage ? heroImage : ''];

  // --- TEXT ROW ---
  // The text row should contain: main heading, subheading, paragraph(s), in source order
  const textContent = [];
  // 1. Main heading at top (h1)
  const mainHeading = element.querySelector('.cmp-title .cmp-title__text, h1');
  if (mainHeading) textContent.push(mainHeading);

  // 2. From the overview panel: all h2, h3, h4, h5, h6, p, ul, ol, but not images or their captions, in source order
  if (overviewTabPanel) {
    // Get all relevant selectors
    const blocks = overviewTabPanel.querySelectorAll('h2, h3, h4, h5, h6, p, ul, ol');
    blocks.forEach((el) => {
      // Skip if this element is inside an image or figure block
      if (!el.closest('.cmp-image')) {
        // Avoid duplicating the main heading
        if (el !== mainHeading) {
          // Only push if there's text
          if (el.textContent.trim().length > 0) textContent.push(el);
        }
      }
    });
  }

  // Compose the table
  const cells = [headerRow, imageRow, [textContent]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
