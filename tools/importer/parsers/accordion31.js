/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Find all h2 section titles in the contentfragment
  const sectionTitles = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  if (!sectionTitles.length) return;

  // Prepare table rows: header first
  const rows = [['Accordion (accordion31)']];

  // For each section, gather its title and content
  sectionTitles.forEach((titleEl, idx) => {
    // Title cell: clone the heading element
    const titleCell = titleEl.cloneNode(true);

    // Find all nodes between this h2 and the next h2
    const contentNodes = [];
    let node = titleEl.parentElement.parentElement.nextElementSibling;
    // Find the next h2 to know where to stop
    let nextH2 = null;
    for (let i = idx + 1; i < sectionTitles.length; i++) {
      nextH2 = sectionTitles[i];
      break;
    }
    while (node && (!nextH2 || !node.contains(nextH2))) {
      // Only add meaningful content nodes
      // Accept paragraphs, images, blockquotes, and divs containing those
      if (
        node.tagName === 'P' ||
        node.tagName === 'BLOCKQUOTE' ||
        (node.tagName === 'DIV' && node.querySelector('p, img, blockquote')) ||
        node.tagName === 'IMG'
      ) {
        contentNodes.push(node.cloneNode(true));
      }
      node = node.nextElementSibling;
      // Stop if we hit the next h2
      if (nextH2 && node && node.contains(nextH2)) break;
    }
    // Remove empty wrappers
    const filteredContent = contentNodes.filter(n => {
      if (n.tagName === 'DIV') {
        // Remove empty divs
        return n.querySelector('p, img, blockquote');
      }
      return true;
    });
    if (filteredContent.length > 0) {
      rows.push([titleCell, filteredContent]);
    }
  });

  // Create the Accordion table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
