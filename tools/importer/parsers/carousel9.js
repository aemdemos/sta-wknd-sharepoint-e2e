/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row: must match block name exactly, single column
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image element (mandatory)
    const imageWrapper = item.querySelector('.cmp-image');
    let imgEl = null;
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }
    // Defensive: skip if no image
    if (!imgEl) return;

    // Find possible text content in the slide (title, description, CTA)
    let textContent = '';
    // Try to find heading
    const heading = item.querySelector('h2, h3, h4, h5, h6');
    if (heading) {
      textContent += `<h3>${heading.textContent.trim()}</h3>`;
    }
    // Find all paragraphs
    const paragraphs = Array.from(item.querySelectorAll('p'));
    paragraphs.forEach(p => {
      textContent += `<p>${p.textContent.trim()}</p>`;
    });
    // Find links (CTA)
    const links = Array.from(item.querySelectorAll('a'));
    links.forEach(a => {
      textContent += `<p><a href="${a.href}">${a.textContent.trim()}</a></p>`;
    });
    // If no structured text found, try to get all text nodes
    if (!textContent) {
      const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (!node.parentElement || node.parentElement.classList.contains('cmp-image')) return NodeFilter.FILTER_SKIP;
          if (node.textContent.trim().length === 0) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let node;
      while ((node = walker.nextNode())) {
        textContent += `<p>${node.textContent.trim()}</p>`;
      }
    }

    // Always push two columns: image, then text (empty if none)
    rows.push([imgEl, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Fix: Remove extra header columns so header is only one cell
  const thead = block.querySelector('thead');
  if (thead) {
    const ths = thead.querySelectorAll('th');
    // Remove all but the first th
    for (let i = 1; i < ths.length; i++) {
      ths[i].remove();
    }
  }
  // Replace the original element
  element.replaceWith(block);
}
