/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main hero image
  let heroImg = null;
  // Look for the Overview tab panel
  const tabPanels = element.querySelectorAll('.cmp-tabs__tabpanel');
  let overviewPanel = null;
  for (const panel of tabPanels) {
    const dataLayer = panel.getAttribute('data-cmp-data-layer');
    if (dataLayer && dataLayer.includes('Overview')) {
      overviewPanel = panel;
      break;
    }
  }
  if (overviewPanel) {
    heroImg = overviewPanel.querySelector('img');
  }

  // 2. Find the main heading/title (h1 inside .cmp-title)
  let heroTitle = null;
  const titleDiv = element.querySelector('.cmp-title');
  if (titleDiv) {
    // prefer h1 if present
    heroTitle = titleDiv.querySelector('h1, .cmp-title__text');
  }

  // 3. Compose the text cell (title, subheading, paragraphs)
  let textCellContent = [];
  if (heroTitle) {
    textCellContent.push(heroTitle);
  }
  if (overviewPanel) {
    const innerArticle = overviewPanel.querySelector('article');
    if (innerArticle) {
      const elementsDiv = innerArticle.querySelector('.cmp-contentfragment__elements');
      if (elementsDiv) {
        // Find all h3 and p in the .cmp-contentfragment__elements
        const h3s = elementsDiv.querySelectorAll('h3');
        h3s.forEach(h3 => {
          // Only add if not duplicate of heroTitle (by text)
          if (!heroTitle || h3.textContent.trim() !== heroTitle.textContent.trim()) {
            textCellContent.push(h3);
          }
        });
        const ps = elementsDiv.querySelectorAll('p');
        ps.forEach(p => {
          textCellContent.push(p);
        });
      }
    }
  }

  // If textCellContent is empty, add a blank entry to keep table structure
  if (textCellContent.length === 0) {
    textCellContent = [''];
  }

  // 4. Assemble table as in the example: first row is header, second is image, third is text
  const tableCells = [
    ['Hero'],
    [heroImg || ''],
    [textCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
