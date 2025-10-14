/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel17) block: header row, each slide = row, always 2 columns (image, text)
  const headerRow = ['Carousel (carousel17)'];

  // Find carousel items
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // For each item, extract the image and text content (always 2 columns per row)
  const rows = items.map(item => {
    // Image (mandatory, first column)
    const img = item.querySelector('img');
    if (!img) return null;
    // Ensure alt/title/caption text is included if available
    const meta = item.querySelector('meta[itemprop="caption"]');
    if (meta && meta.content) {
      img.alt = img.alt || meta.content;
      img.title = img.title || meta.content;
    }
    // Text content (second column, optional, but always present as empty string if none)
    let textCell = '';
    // Heading (h1-h6)
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textCell += heading.outerHTML;
    // Paragraphs
    item.querySelectorAll('p').forEach(p => { textCell += p.outerHTML; });
    // Links
    item.querySelectorAll('a').forEach(a => { textCell += a.outerHTML; });
    // If still empty, check for text nodes outside image
    if (!textCell.trim()) {
      const imageDiv = item.querySelector('.image');
      let textNodes = [];
      item.childNodes.forEach(node => {
        if (node !== imageDiv && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textNodes.push(node.textContent.trim());
        }
      });
      if (textNodes.length) textCell = textNodes.join(' ');
    }
    return [img, textCell]; // always 2 columns per row
  }).filter(Boolean);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
