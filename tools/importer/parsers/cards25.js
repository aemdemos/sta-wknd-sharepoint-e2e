/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor/guide section
  function extractCards(sections) {
    const cards = [];
    sections.forEach((section) => {
      // Find the main container inside the experiencefragment
      const container = section.querySelector('.cmp-container .cmp-container .cmp-container');
      if (!container) return;
      // Find image
      const imageWrap = container.querySelector('.image .cmp-image img');
      // Find name/title (h3)
      const nameTitle = container.querySelector('.title h3');
      // Find subtitle/role (h5)
      let subtitle = container.querySelector('.title.cmp-title--black h5, .title:not(.cmp-title--black) h5');
      if (!subtitle) {
        // fallback: any h5 in .title
        subtitle = container.querySelector('.title h5');
      }
      // Social buttons
      const socialBlock = container.querySelector('.buildingblock');
      let socialLinks = [];
      if (socialBlock) {
        socialLinks = Array.from(socialBlock.querySelectorAll('a.cmp-button'));
      }
      // Compose text cell
      const textCell = document.createElement('div');
      if (nameTitle) textCell.appendChild(nameTitle.cloneNode(true));
      if (subtitle) textCell.appendChild(subtitle.cloneNode(true));
      if (socialLinks.length) {
        const socialRow = document.createElement('div');
        socialRow.style.display = 'flex';
        socialRow.style.gap = '8px';
        socialLinks.forEach((link) => {
          socialRow.appendChild(link.cloneNode(true));
        });
        textCell.appendChild(socialRow);
      }
      // Add card row
      cards.push([
        imageWrap ? imageWrap.cloneNode(true) : '',
        textCell
      ]);
    });
    return cards;
  }

  // Compose header row
  const headerRow = ['Cards (cards25)'];

  // Extract section headings and descriptions
  const contributorsTitle = element.querySelector('.title.cmp-title--underline h2');
  const contributorsDesc = element.querySelector('.text.cmp-text--font-small p i');
  const guidesTitle = Array.from(element.querySelectorAll('.title.cmp-title--underline h2')).find(h2 => h2.textContent.includes('WKND Guides'));
  const guidesDesc = Array.from(element.querySelectorAll('.text.cmp-text--font-small p i')).find(i => i.textContent.includes('travel guides'));

  // Find all contributor and guide sections
  const allSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  // There are 4 contributors, 4 guides (corrected: 4 guides, not 3)
  const contributorCards = extractCards(allSections.slice(0, 4));
  const guideCards = extractCards(allSections.slice(4, 8));

  // Compose all card rows only (no section headings/descriptions)
  const rows = [headerRow, ...contributorCards, ...guideCards];

  // Place section headings and descriptions above the table
  const fragment = document.createDocumentFragment();
  if (contributorsTitle) fragment.appendChild(contributorsTitle.cloneNode(true));
  if (contributorsDesc) fragment.appendChild(contributorsDesc.parentElement.cloneNode(true));
  if (guidesTitle) fragment.appendChild(guidesTitle.cloneNode(true));
  if (guidesDesc) fragment.appendChild(guidesDesc.parentElement.cloneNode(true));

  // Build table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  fragment.appendChild(block);
  // Replace element
  element.replaceWith(fragment);
}
