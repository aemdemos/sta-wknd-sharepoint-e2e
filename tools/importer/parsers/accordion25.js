/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // The main content container
  const mainContent = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!mainContent) return;

  // We'll build accordion items as [title, content]
  const accordionRows = [];

  // Helper to collect all nodes between start and end (exclusive)
  function collectContent(startNode, endNode) {
    const nodes = [];
    let node = startNode;
    while (node && node !== endNode) {
      // Only add elements with meaningful content
      if (
        node.nodeType === 1 &&
        (node.matches('p') || node.classList.contains('cmp-text') || node.classList.contains('cmp-image'))
      ) {
        nodes.push(node.cloneNode(true));
      }
      node = node.nextElementSibling;
    }
    return nodes.length ? nodes : null;
  }

  // Find all h2 section titles
  const sectionTitles = Array.from(mainContent.querySelectorAll('h2.cmp-title__text'));

  // 1. Intro section: everything before first h2
  const mainTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
  const firstH2Block = sectionTitles[0]?.closest('.cmp-title');
  let introContent = [];
  let node = mainContent.firstElementChild;
  while (node && node !== firstH2Block) {
    if (
      node.nodeType === 1 &&
      (node.matches('p') || node.classList.contains('cmp-text') || node.classList.contains('cmp-image'))
    ) {
      introContent.push(node.cloneNode(true));
    }
    node = node.nextElementSibling;
  }
  if (mainTitle && introContent.length) {
    accordionRows.push([
      mainTitle.textContent,
      introContent
    ]);
  }

  // 2. For each h2 section, collect content until next h2
  for (let i = 0; i < sectionTitles.length; i++) {
    const h2 = sectionTitles[i];
    const titleText = h2.textContent;
    const h2Block = h2.closest('.cmp-title');
    let sectionContent = [];
    let startNode = h2Block.nextElementSibling;
    let endNode = sectionTitles[i + 1]?.closest('.cmp-title') || null;
    let node2 = startNode;
    while (node2 && node2 !== endNode) {
      if (
        node2.nodeType === 1 &&
        (node2.matches('p') || node2.classList.contains('cmp-text') || node2.classList.contains('cmp-image'))
      ) {
        sectionContent.push(node2.cloneNode(true));
      }
      node2 = node2.nextElementSibling;
    }
    if (titleText && sectionContent.length) {
      accordionRows.push([
        titleText,
        sectionContent
      ]);
    }
  }

  // Fallback: If no rows, try to get all <p> in mainContent
  if (accordionRows.length === 0) {
    const allPs = Array.from(mainContent.querySelectorAll('p'));
    if (allPs.length) {
      accordionRows.push([
        mainTitle ? mainTitle.textContent : 'Intro',
        allPs.map(p => p.cloneNode(true))
      ]);
    }
  }

  // Compose the table rows
  const headerRow = ['Accordion (accordion25)'];
  const rows = [headerRow, ...accordionRows];

  // If there are no accordion items, do not replace
  if (rows.length <= 1) return;

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
