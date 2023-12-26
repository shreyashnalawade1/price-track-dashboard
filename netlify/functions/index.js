const { readSearchTerms } = require("../../utils/fileProcessing");
const { main } = require("../../utils/pageProcessing");

(async () => {
  const searchTerms = readSearchTerms();
  console.log(searchTerms);
  for (const searchTerm of searchTerms) {
    await main(searchTerm);
  }
})();
