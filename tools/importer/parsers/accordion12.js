/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (the main story)
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Get the main title (h1)
  const mainTitle = contentFragment.querySelector('.cmp-title h1');
  // Get the author (h4)
  const authorTitle = contentFragment.querySelector('.cmp-title h4');

  // Get the main contentfragment inner article
  const cfArticle = contentFragment.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;

  // Get the content block
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Prepare table rows
  const rows = [];
  // Header row
  const headerRow = ['Accordion (accordion12)'];
  rows.push(headerRow);

  // Find all h2s (section titles)
  const sectionTitles = Array.from(cfElements.querySelectorAll('h2.cmp-title__text'));

  // Helper: get all nodes between two elements
  function getContentBetween(start, end) {
    const content = [];
    let node = start;
    while (node && node !== end) {
      if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img'))) {
        content.push(node.cloneNode(true));
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        content.push(span);
      }
      node = node.nextSibling;
    }
    return content;
  }

  // Find the parent elements of all h2s
  const sectionStarts = sectionTitles.map(h2 => h2.parentElement);

  // First accordion item: intro section (before first h2)
  let introContentEls = [];
  if (authorTitle) introContentEls.push(authorTitle.cloneNode(true));
  const firstSectionStart = sectionStarts[0] || null;
  introContentEls = introContentEls.concat(getContentBetween(cfElements.firstChild, firstSectionStart));
  if (mainTitle && introContentEls.length) {
    rows.push([
      mainTitle.textContent.trim(),
      introContentEls
    ]);
  }

  // For each h2 section, collect content until next h2
  for (let i = 0; i < sectionStarts.length; i++) {
    const h2 = sectionStarts[i].querySelector('h2.cmp-title__text');
    const titleText = h2 ? h2.textContent.trim() : '';
    const startNode = sectionStarts[i].nextSibling;
    const endNode = sectionStarts[i + 1] || null;
    const contentEls = getContentBetween(startNode, endNode);
    if (contentEls.length) {
      rows.push([
        titleText,
        contentEls
      ]);
    }
  }

  // If no accordion items were found, try to extract all paragraphs as fallback
  if (rows.length === 1) {
    const allParagraphs = Array.from(cfElements.querySelectorAll('p'));
    allParagraphs.forEach(p => {
      if (p.textContent.trim()) {
        rows.push([
          p.textContent.trim().slice(0, 40) + '...', // Use first 40 chars as title
          [p.cloneNode(true)]
        ]);
      }
    });
  }

  // Always output the table, even if only header row, to ensure DOM is modified
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
