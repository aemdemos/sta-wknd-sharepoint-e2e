/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the top hero image (first .image block with <img> inside)
  function getHeroImage(el) {
    // Find the first .image block with an <img>
    const imgDiv = el.querySelector('.image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) return imgDiv;
    }
    // Fallback: first <img> in the block
    const img = el.querySelector('img');
    if (img) return img;
    return '';
  }

  // Helper: Find the main title (h1) and subtitle (h4)
  function getTitles(el) {
    let title = null;
    let subtitle = null;
    // Use less specific selectors to ensure we get all possible titles
    const h1 = el.querySelector('h1');
    if (h1) title = h1;
    const h4 = el.querySelector('h4');
    if (h4) subtitle = h4;
    return { title, subtitle };
  }

  // Helper: Find a call-to-action (button or link)
  function getCTA(el) {
    // Try to find a button or link with CTA-like text
    const btn = el.querySelector('.cmp-button');
    if (btn) return btn;
    // Fallback: first <a> with likely CTA text
    const links = el.querySelectorAll('a');
    for (const link of links) {
      if (link.textContent.match(/(read|learn|explore|start|sign|join|discover|see|shop|buy|get)/i)) {
        return link;
      }
    }
    return null;
  }

  // Helper: Get all text content in the hero area (title, subtitle, and intro paragraph)
  function getHeroText(el) {
    const content = [];
    // Title and subtitle
    const { title, subtitle } = getTitles(el);
    if (title) content.push(title);
    if (subtitle) content.push(subtitle);
    // First paragraph after title
    // Try to find the first <p> after the title
    let firstP = null;
    if (title) {
      let next = title.parentElement;
      while (next && next.nextElementSibling) {
        next = next.nextElementSibling;
        if (next.tagName === 'P') {
          firstP = next;
          break;
        }
      }
    }
    // Fallback: first <p> in the block
    if (!firstP) {
      firstP = el.querySelector('p');
    }
    if (firstP) content.push(firstP);
    // Also include all paragraphs up to the first section heading (h2, h3, etc.)
    let mainContainer = el.querySelector('.cmp-container');
    if (!mainContainer) mainContainer = el;
    let foundTitle = false;
    let foundHeading = false;
    let paragraphs = [];
    for (const node of mainContainer.querySelectorAll('h1, h4, p')) {
      if (node.tagName === 'H1') foundTitle = true;
      if (foundTitle && node.tagName === 'P' && !foundHeading) {
        paragraphs.push(node);
      }
      if (/^H[2-6]$/.test(node.tagName)) {
        foundHeading = true;
      }
    }
    // Only add paragraphs if we found any
    if (paragraphs.length) {
      for (const p of paragraphs) {
        if (!content.includes(p)) content.push(p);
      }
    }
    // CTA
    const cta = getCTA(el);
    if (cta) content.push(cta);
    return content.length ? content : '';
  }

  // Compose the header row
  const headerRow = ['Hero (hero15)'];

  // Compose the image row
  const heroImage = getHeroImage(element);
  const imageRow = [heroImage ? heroImage : ''];

  // Compose the content row
  const contentCell = getHeroText(element);
  const contentRow = [contentCell];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
