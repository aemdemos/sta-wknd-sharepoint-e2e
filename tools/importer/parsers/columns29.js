/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content container
  const main = element.tagName === 'MAIN' ? element : element.querySelector('main.container');
  // Find the article main section (the one with titles and contentfragment)
  let storyMain = main && main.querySelector('main.container');
  if (!storyMain) storyMain = main;
  const mainContainer = storyMain.querySelector('.cmp-container') || storyMain;

  // Helper: get first element by tag or class
  function getFirst(selector) {
    return mainContainer.querySelector(selector);
  }
  // Helper: get all elements by selector
  function getAll(selector) {
    return Array.from(mainContainer.querySelectorAll(selector));
  }

  // Find all cmp-images
  const images = getAll('.cmp-image');
  // Find all lists
  const lists = getAll('ul,ol');
  // Find all buttons (a.cmp-button, button, a.button)
  const buttons = getAll('a.cmp-button, a.button, button');
  // Find all paragraphs
  const paragraphs = getAll('p');
  // Find all headings
  const headings = getAll('h1, h2, h3, h4, h5, h6, .cmp-title__text');

  // First row, left cell: block heading (or text), list, first button (Live)
  const firstRowLeft = [];
  // Example: 'Columns block' (find heading or fallback to first paragraph)
  if (headings.length > 0) {
    firstRowLeft.push(headings[0]);
  } else if (paragraphs.length > 0) {
    firstRowLeft.push(paragraphs[0]);
  }
  // Example: - One\n- Two\n- Three (first list)
  if (lists.length > 0) {
    firstRowLeft.push(lists[0]);
  }
  // Example: Live button (first button)
  if (buttons.length > 0) {
    firstRowLeft.push(buttons[0]);
  }

  // First row, right cell: first image (blue/green double helix)
  const firstRowRight = images[0] || '';

  // Second row, left cell: second image (yellow double helix)
  const secondRowLeft = images[1] || '';

  // Second row, right cell: preview/caption paragraph and preview button if available
  const secondRowRight = [];
  // Example: 'Or you can just view the preview' paragraph
  let foundPreviewPara = null;
  for (const p of paragraphs) {
    if (/preview/i.test(p.textContent)) {
      foundPreviewPara = p;
      break;
    }
  }
  if (foundPreviewPara) {
    secondRowRight.push(foundPreviewPara);
  }
  // Preview button (next button that is not the first/live button)
  let previewBtn = null;
  if (buttons.length > 1) {
    previewBtn = buttons.find((btn, idx) => idx !== 0 && /preview/i.test(btn.textContent));
    if (!previewBtn && buttons.length > 1) previewBtn = buttons[1];
  }
  if (previewBtn) {
    secondRowRight.push(previewBtn);
  }

  
  const headerRow = ['Columns (columns29)'];
  const cells = [
    headerRow,
    [firstRowLeft, firstRowRight],
    [secondRowLeft, secondRowRight]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
