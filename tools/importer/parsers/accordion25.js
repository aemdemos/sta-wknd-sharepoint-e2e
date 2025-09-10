/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse main article content
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Prepare header row
  const rows = [['Accordion (accordion25)']];

  // Find all elements inside the main content fragment
  const elements = Array.from(contentFragment.querySelectorAll('.cmp-contentfragment__elements > div > *'));

  // Find all h2s (accordion titles) and their content
  let currentTitle = null;
  let currentContent = [];
  let started = false;
  elements.forEach((el, idx) => {
    if (el.matches('.title .cmp-title h2')) {
      // Push previous accordion item if exists
      if (currentTitle && currentContent.length > 0) {
        rows.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
        ]);
      }
      currentTitle = el;
      currentContent = [];
      started = true;
    } else if (started) {
      // Collect everything after the first h2 until the next h2
      // Only collect elements that have meaningful content
      if (
        el.tagName === 'P' ||
        el.tagName === 'BLOCKQUOTE' ||
        el.classList.contains('cmp-image') ||
        (el.tagName === 'DIV' && el.textContent.trim())
      ) {
        currentContent.push(el);
      }
    }
  });
  // Push the last accordion item
  if (currentTitle && currentContent.length > 0) {
    rows.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
    ]);
  }

  // If no accordion items found, fallback: extract all text content as a single row
  if (rows.length === 1) {
    // Fallback: collect all text content from the block description
    const blockDesc = element.querySelector('.cmp-contentfragment__elements');
    if (blockDesc) {
      const allContent = Array.from(blockDesc.querySelectorAll('p,blockquote,div,section,ul,ol,img,h2,h3,h4,h5')).filter(e => e.textContent.trim() || e.tagName === 'IMG');
      if (allContent.length > 0) {
        rows.push([
          'Content',
          allContent.length === 1 ? allContent[0] : allContent.slice(),
        ]);
      }
    }
  }

  // Always create the block, even if only header (to ensure DOM is modified)
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
