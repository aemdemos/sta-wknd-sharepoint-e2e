/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find heading and intro block
  function getHeadingBlock(title) {
    // Find appropriate heading (h2) for block
    const headings = Array.from(element.querySelectorAll('.cmp-title__text'));
    const h = headings.find(e => e.textContent.trim() === title);
    if (!h) return null;
    // Find intro text <p> after heading
    let cmpTitleDiv = h.closest('.cmp-title');
    let parent = cmpTitleDiv.parentElement;
    let next = parent.nextElementSibling;
    while (next && !next.classList.contains('cmp-text')) {
      next = next.nextElementSibling;
    }
    let introPs = [];
    if (next && next.classList.contains('cmp-text')) {
      introPs = Array.from(next.querySelectorAll('p'));
    }
    // Compose block: <strong>title</strong> + intro paragraphs (preserving original elements)
    const blockDiv = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = title;
    blockDiv.appendChild(strong);
    introPs.forEach(p => blockDiv.appendChild(p));
    return blockDiv;
  }

  // Helper: Extract card content from a contributor section
  function extractCard(section) {
    // Image (first img)
    const img = section.querySelector('img');
    // Compose right cell: name, subtitle, any extra text, social links
    const cardDiv = document.createElement('div');
    // Name h3 (bold)
    const h3 = section.querySelector('h3.cmp-title__text');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent;
      cardDiv.appendChild(strong);
    }
    // Subtitle h5
    const h5 = section.querySelector('h5.cmp-title__text');
    if (h5) {
      cardDiv.appendChild(document.createElement('br'));
      const span = document.createElement('span');
      span.textContent = h5.textContent;
      cardDiv.appendChild(span);
    }
    // Any extra text (from .cmp-text or paragraphs inside section)
    const textBlocks = Array.from(section.querySelectorAll('.cmp-text p, p:not(.cmp-title__text)'));
    textBlocks.forEach(tb => {
      if (tb.textContent.trim() && !cardDiv.textContent.includes(tb.textContent.trim())) {
        cardDiv.appendChild(document.createElement('br'));
        cardDiv.appendChild(tb);
      }
    });
    // Social links (all .cmp-button)
    const buttons = Array.from(section.querySelectorAll('a.cmp-button'));
    if (buttons.length) {
      cardDiv.appendChild(document.createElement('br'));
      buttons.forEach(btn => cardDiv.appendChild(btn));
    }
    return [img, cardDiv];
  }

  // Find all contributor card sections in order
  const allSections = Array.from(element.querySelectorAll(':scope > section.cmp-experience-fragment--contributor'));
  // Split: Contributors (first 4), Guides (next 3)
  const contributors = allSections.slice(0, 4);
  const guides = allSections.slice(4, 7);

  // Build table matching the example
  const cells = [['Cards (cards24)']];
  // Contributors heading block
  const contributorsHeadingBlock = getHeadingBlock('Our Contributors');
  if (contributorsHeadingBlock) {
    cells.push([contributorsHeadingBlock]);
  }
  // Each contributor card row
  contributors.forEach(section => {
    cells.push(extractCard(section));
  });
  // Guides heading block
  const guidesHeadingBlock = getHeadingBlock('WKND Guides');
  if (guidesHeadingBlock) {
    cells.push([guidesHeadingBlock]);
  }
  // Each guide card row
  guides.forEach(section => {
    cells.push(extractCard(section));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
