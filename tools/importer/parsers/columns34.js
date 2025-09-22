/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  function getChildDivs(parent) {
    return Array.from(parent.querySelectorAll(':scope > div'));
  }

  // Find main content columns: visually, left is main article, right is sidebar
  // Source HTML: main container > div.cmp-container > div.aem-Grid > main (main col) & aside (sidebar)
  let mainCol, sidebarCol;
  const gridDiv = element.querySelector('.aem-Grid');
  if (gridDiv) {
    mainCol = gridDiv.querySelector('main');
    sidebarCol = gridDiv.querySelector('aside');
  } else {
    // fallback: just use first/second child
    const divs = getChildDivs(element);
    mainCol = divs.find(d => d.tagName === 'MAIN');
    sidebarCol = divs.find(d => d.tagName === 'ASIDE');
  }

  // Defensive: if not found, fallback to element itself
  if (!mainCol) mainCol = element;
  if (!sidebarCol) sidebarCol = null;

  // --- COLUMN 1: Main Content ---
  // We'll extract the main article area, including images, titles, and article body
  // Find the first image (hero)
  let heroImg = null;
  const heroImgDiv = mainCol.querySelector('.image .cmp-image img');
  if (heroImgDiv) heroImg = heroImgDiv;

  // Find the title and byline
  let title = mainCol.querySelector('.title h1');
  let byline = mainCol.querySelector('.title h4');

  // Find the main article contentfragment
  let articleFragment = mainCol.querySelector('.contentfragment');
  // Defensive: if not found, try article
  if (!articleFragment) articleFragment = mainCol.querySelector('article');

  // We'll collect all paragraphs and images inside the contentfragment
  let articleContent = [];
  if (articleFragment) {
    // Get all direct children of .cmp-contentfragment__elements
    const cfElements = articleFragment.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      // Get all paragraphs and images in order
      // FIX: Use less specific selectors to include ALL text content, not just direct children
      // We'll recursively collect all <p> and <img> in order
      const nodes = Array.from(cfElements.querySelectorAll('p, img'));
      articleContent = nodes;
    }
  }

  // Byline block at bottom
  let bylineBlock = null;
  const bylineDiv = mainCol.querySelector('.experiencefragment .cmp-byline');
  if (bylineDiv) {
    bylineBlock = bylineDiv;
  }

  // --- COLUMN 2: Sidebar ---
  // We'll extract the sidebar column as a single block
  let sidebarBlock = null;
  if (sidebarCol) {
    sidebarBlock = sidebarCol;
  }

  // --- Compose table rows ---
  // Header row
  const headerRow = ['Columns (columns34)'];

  // Second row: main column and sidebar column
  // Compose left column: hero image, title, byline, article content, byline block
  let leftCol = [];
  if (heroImg) leftCol.push(heroImg);
  if (title) leftCol.push(title);
  if (byline) leftCol.push(byline);
  if (articleContent.length) leftCol = leftCol.concat(articleContent);
  if (bylineBlock) leftCol.push(bylineBlock);

  // Compose right column: sidebar block
  let rightCol = [];
  if (sidebarBlock) rightCol.push(sidebarBlock);

  // Table rows
  const rows = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element
  element.replaceWith(table);
}
