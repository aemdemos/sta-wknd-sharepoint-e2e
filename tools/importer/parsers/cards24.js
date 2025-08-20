/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content including descriptions
  function extractCards(sections) {
    const cards = [];
    sections.forEach(section => {
      // Image (or empty string)
      const img = section.querySelector('img');
      // Compose right cell contents: name, role, any additional description, social links
      const content = [];
      // All .cmp-title__text (preserve order)
      section.querySelectorAll('.cmp-title__text').forEach(node => {
        content.push(node);
      });
      // Any .cmp-text inside card (for possible card-specific description, rare, but for robustness)
      const desc = section.querySelector('.cmp-text');
      if (desc) {
        content.push(desc);
      }
      // Social links
      const socialLinks = Array.from(section.querySelectorAll('a.cmp-button'));
      if (socialLinks.length) {
        const linksDiv = document.createElement('div');
        socialLinks.forEach(link => linksDiv.appendChild(link));
        content.push(linksDiv);
      }
      cards.push([img || '', content.length ? content : '']);
    });
    return cards;
  }

  // Find contributor and guide sections
  const allSections = element.querySelectorAll('section.cmp-experience-fragment--contributor');
  if (!allSections || allSections.length === 0) return;
  const contributorSections = Array.from(allSections).slice(0, 4);
  const guideSections = Array.from(allSections).slice(4);

  // Get the correct intro/description content for each section
  const contributorsIntroEl = element.querySelector('#text-7eb634afb9 .cmp-text, #text-7eb634afb9');
  const guidesIntroEl = element.querySelector('#text-03749c064c .cmp-text, #text-03749c064c');

  // Build contributors table
  const contributorsHeader = ['Cards (cards24)'];
  const contributorsIntroRow = [contributorsIntroEl ? contributorsIntroEl : ''];
  const contributorCards = extractCards(contributorSections);
  const contributorsTable = WebImporter.DOMUtils.createTable([
    contributorsHeader,
    contributorsIntroRow,
    ...contributorCards
  ], document);

  // Build guides table
  const guidesHeader = ['Cards (cards24)'];
  const guidesIntroRow = [guidesIntroEl ? guidesIntroEl : ''];
  const guideCards = extractCards(guideSections);
  const guidesTable = WebImporter.DOMUtils.createTable([
    guidesHeader,
    guidesIntroRow,
    ...guideCards
  ], document);

  // Replace the original element with both tables (in order)
  element.replaceWith(contributorsTable, guidesTable);
}
