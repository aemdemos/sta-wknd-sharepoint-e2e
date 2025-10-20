/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the article with the travel story)
  let mainContent = element.querySelector('main.container.responsivegrid > div > main.container.responsivegrid');
  if (!mainContent) {
    mainContent = element.querySelector('main.container.responsivegrid');
  }
  if (!mainContent) return;

  // The main article content is inside a contentfragment article
  const contentFragment = mainContent.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the root for section parsing
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements') || contentFragment;
  const elements = Array.from(elementsRoot.children);

  // Find the main title and byline
  const mainTitle = contentFragment.querySelector('h1');
  const byline = contentFragment.querySelector('h4');

  // Find the quote block (either .cmp-text--quote or blockquote)
  let quoteBlock = null;
  const quoteText = elementsRoot.querySelector('.cmp-text--quote');
  if (quoteText) {
    quoteBlock = quoteText.cloneNode(true);
  } else {
    const blockquote = elementsRoot.querySelector('blockquote');
    if (blockquote) quoteBlock = blockquote.cloneNode(true);
  }

  // Gather all elements before the first h2 as intro
  let introContent = document.createElement('div');
  if (mainTitle) introContent.appendChild(mainTitle.cloneNode(true));
  if (byline) introContent.appendChild(byline.cloneNode(true));
  if (quoteBlock) introContent.appendChild(quoteBlock);
  for (let el of elements) {
    if (el.tagName === 'H2') break;
    introContent.appendChild(el.cloneNode(true));
  }

  // Find all h2s and build tab sections
  const tabs = [];
  tabs.push(['Introduction', introContent]);

  let idx = elements.findIndex(el => el.tagName === 'H2');
  while (idx !== -1 && idx < elements.length) {
    const h2 = elements[idx];
    const tabLabel = h2.textContent.trim();
    const tabContent = document.createElement('div');
    let i = idx + 1;
    while (i < elements.length && elements[i].tagName !== 'H2') {
      tabContent.appendChild(elements[i].cloneNode(true));
      i++;
    }
    tabs.push([tabLabel, tabContent]);
    idx = elements.findIndex((el, j) => j > i - 1 && el.tagName === 'H2');
  }

  // Build the table rows: header row must be exactly one column
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];
  for (const tab of tabs) {
    rows.push([tab[0], tab[1]]);
  }
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
