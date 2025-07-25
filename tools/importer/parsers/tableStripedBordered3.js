/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area containing the FAQ accordion
  let mainContent = null;
  const allGrids = element.querySelectorAll(':scope > div > div');
  for (const grid of allGrids) {
    const col8 = grid.querySelector('[class*="aem-GridColumn--default--8"]');
    if (col8) {
      mainContent = col8;
      break;
    }
  }
  if (!mainContent) return;

  // Find the accordion (FAQs)
  const accordion = mainContent.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Build the outer block table
  const blockCells = [
    ['Table (striped, bordered)'],
  ];

  // Build the FAQ table (as in the example: header row, then rows for each FAQ)
  const faqTableRows = [
    ['Product Name', 'Website']
  ];

  // In the provided example table, the FAQ questions are in the Product Name column,
  // and the Website column contains a URL. But in the actual HTML they're Q&A format,
  // so we need to adjust for this.
  // However, the provided HTML does NOT actually match the example table content.
  // Instead, the example screenshot is just of a plain product table, but the provided HTML is FAQ content.

  // Based on the provided instructions, we are to structure the output table in the same way as the provided example,
  // which means two columns, first for the question, second for the answer. But the header must match the markdown example
  // exactly: ['Product Name', 'Website']

  // We will use the accordion question as 'Product Name' and the answer as 'Website'.

  // Extract FAQ items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Product Name (Question)
    const questionEl = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let question = '';
    if (questionEl) {
      question = questionEl.textContent.trim();
    }
    // Website (Answer)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let answer = '';
    if (panel) {
      const text = panel.querySelector('.cmp-text');
      if (text) {
        answer = text;
      } else {
        // fallback: the panel itself
        answer = panel;
      }
    }
    faqTableRows.push([question, answer]);
  });

  // Create the inner FAQ table and add it to the block
  const faqTable = WebImporter.DOMUtils.createTable(faqTableRows, document);
  blockCells.push([faqTable]);

  // Replace the original element with the composed block
  const block = WebImporter.DOMUtils.createTable(blockCells, document);
  element.replaceWith(block);
}
