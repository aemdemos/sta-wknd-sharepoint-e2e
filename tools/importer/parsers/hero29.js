/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero background image (first .image in the mainGrid)
  let heroImage = null;
  const mainGrid = element.querySelector(':scope > .cmp-container > .aem-Grid');
  if (mainGrid) {
    const imageDiv = mainGrid.querySelector(':scope > .image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) heroImage = img;
    }
  }

  // Find the main content area for all relevant heading and introductory text
  let heroTextContent = [];
  const mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (mainContent) {
    const contentContainer = mainContent.querySelector('.cmp-container');
    if (contentContainer) {
      // Collect all direct .title children
      const titles = Array.from(contentContainer.querySelectorAll(':scope > .title'));
      for (const title of titles) {
        // Only include h1 and h4 directly (most common for hero blocks)
        const h1 = title.querySelector('h1');
        if (h1) heroTextContent.push(h1);
        const h4 = title.querySelector('h4');
        if (h4) heroTextContent.push(h4);
      }
      // Also, per the example, include the first large intro paragraph before the main article content
      // This is typically the first <p> after the heading in the content fragment
      const article = contentContainer.querySelector('article.contentfragment');
      if (article) {
        // Look for the first <p> inside the article that is visually in the hero section
        const firstP = article.querySelector('.cmp-contentfragment__elements > div > p');
        if (firstP) heroTextContent.push(firstP);
      }
    }
  }
  // Fallback: if nothing found, ensure we have an empty string so the row isn't empty
  if (heroTextContent.length === 0) heroTextContent = [''];

  // Compose table as per the example: 1 column, 3 rows
  const rows = [
    ['Hero'],
    [heroImage || ''],
    [heroTextContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
