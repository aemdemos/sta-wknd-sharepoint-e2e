/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the first hero image (decorative, top-of-page)
  function findHeroImage() {
    const firstGrid = element.querySelector('.cmp-container > .aem-Grid');
    if (!firstGrid) return null;
    const imageDiv = firstGrid.querySelector('.image .cmp-image');
    if (!imageDiv) return null;
    const img = imageDiv.querySelector('img');
    return img ? imageDiv : null;
  }

  // Helper: Find the main title and subtitle (author)
  function findTitleAndSubtitle() {
    const containers = element.querySelectorAll('.container.responsivegrid > .cmp-container');
    let title = null;
    let subtitle = null;
    if (containers.length > 0) {
      // Find h1 and h4
      const h1 = containers[0].querySelector('.title .cmp-title__text');
      if (h1 && h1.tagName === 'H1') title = h1;
      // Subtitle is the next .title with h4
      const h4 = containers[0].querySelector('.title ~ .title .cmp-title__text');
      if (h4 && h4.tagName === 'H4') subtitle = h4;
    }
    return { title, subtitle };
  }

  // Helper: Find all paragraphs in the main content area
  function findAllParagraphs() {
    // Look for all <p> in the main contentfragment article
    const mainContent = element.querySelector('main.container.responsivegrid .cmp-container article.contentfragment');
    if (!mainContent) return [];
    // Get all direct <p> children and also nested ones
    const paragraphs = Array.from(mainContent.querySelectorAll('p'));
    return paragraphs;
  }

  // ---
  // 1. Header row
  const headerRow = ['Hero (hero28)'];

  // 2. Background image row
  const heroImage = findHeroImage();
  const imageRow = [heroImage ? heroImage : ''];

  // 3. Content row (title, subtitle, all paragraphs)
  const { title, subtitle } = findTitleAndSubtitle();
  const paragraphs = findAllParagraphs();
  const content = [];
  if (title) content.push(title);
  if (subtitle) content.push(subtitle);
  if (paragraphs.length) content.push(...paragraphs);
  const contentRow = [content.length ? content : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
