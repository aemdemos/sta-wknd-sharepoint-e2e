/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find carousel content root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // 2. Extract slide panels
  const slides = Array.from(content.children).filter((el) => el.classList.contains('cmp-carousel__item'));

  // 3. Build table header
  const cells = [['Carousel (carousel9)']]; // Header matches example exactly

  // 4. For each slide, extract image and collect *all* text content
  slides.forEach((slide) => {
    // --- Image cell: Find the first <img> ---
    let imageCell = '';
    const img = slide.querySelector('img');
    if (img) imageCell = img;

    // --- Text cell: Gather all non-image content ---
    let textCellContent = [];
    // Get all children of slide except .image blocks
    const infoBlocks = Array.from(slide.children).filter((el) => !el.classList.contains('image'));
    // If infoBlocks exist, add them whole
    if (infoBlocks.length > 0) {
      infoBlocks.forEach((block) => {
        textCellContent.push(block);
      });
    }

    // Fallbacks if infoBlocks are empty
    if (textCellContent.length === 0) {
      // Check if .image contains any caption or title
      const imageBlock = slide.querySelector('.image');
      if (imageBlock) {
        // Caption as paragraph
        const captionMeta = imageBlock.querySelector('meta[itemprop="caption"]');
        if (captionMeta && captionMeta.getAttribute('content')) {
          const para = document.createElement('p');
          para.textContent = captionMeta.getAttribute('content');
          textCellContent.push(para);
        }
        // Title from <img title> or from data-cmp-data-layer
        if (img && img.getAttribute('title')) {
          const heading = document.createElement('h2');
          heading.textContent = img.getAttribute('title');
          textCellContent.unshift(heading);
        } else {
          // Try to get title from data-cmp-data-layer (robust parsing)
          let blockLayer = slide.getAttribute('data-cmp-data-layer') || imageBlock.getAttribute('data-cmp-data-layer');
          if (blockLayer) {
            try {
              const data = JSON.parse(blockLayer.replace(/&quot;/g, '"'));
              const keys = Object.keys(data);
              if (keys.length && data[keys[0]] && data[keys[0]]['dc:title']) {
                const heading = document.createElement('h2');
                heading.textContent = data[keys[0]]['dc:title'];
                textCellContent.unshift(heading);
              }
            } catch(e) {}
          }
        }
      }
    }
    // If still empty, use empty string so cell count is correct
    const textCell = textCellContent.length > 0 ? textCellContent : '';
    cells.push([imageCell, textCell]); // Always 2 columns per row
  });

  // 5. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
