/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as required
  const headerRow = ['Hero (hero20)'];

  // 2. Background image row: Use the first .cmp-image from the Overview tabpanel
  let backgroundImage = '';
  const tabs = element.querySelector('.cmp-tabs');
  if (tabs) {
    const overviewTabPanel = tabs.querySelector('.cmp-tabs__tabpanel');
    if (overviewTabPanel) {
      const img = overviewTabPanel.querySelector('.cmp-image');
      if (img) {
        backgroundImage = img;
      }
    }
  }

  // 3. Content row: Compose from page title, plus all text content from Overview tab (headings and paragraphs)
  const contentElems = [];

  // Add page title (h1) if present
  const titleElem = element.querySelector('.cmp-title h1, h1.cmp-title__text, h1');
  if (titleElem) {
    contentElems.push(titleElem);
  }

  // Add all relevant content from the Overview tab
  if (tabs) {
    const overviewTabPanel = tabs.querySelector('.cmp-tabs__tabpanel');
    if (overviewTabPanel) {
      // Look for all h2-h6, p in Overview tabpanel, in order of appearance
      const overviewContentFragment = overviewTabPanel.querySelector('.cmp-contentfragment__elements') || overviewTabPanel;
      overviewContentFragment.querySelectorAll('h2, h3, h4, h5, h6, p').forEach(el => {
        if (el.textContent.trim()) {
          contentElems.push(el);
        }
      });
    }
  }

  // If no content was found, ensure the row is not empty
  const textContentCell = contentElems.length ? contentElems : [''];

  // 4. Build the block table
  const rows = [
    headerRow,
    [backgroundImage ? backgroundImage : ''],
    [textContentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
