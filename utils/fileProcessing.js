const fs = require("fs");
const path = require("path");
exports.readSearchTerms = function () {
  try {
    const filePath = path.join(__dirname, "../data/search-terms.txt");
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    const searchTerms = data.split(",");
    const searchTermsFinal = [];
    for (const searchTerm of searchTerms) {
      searchTermsFinal.push(searchTerm.trim());
    }
    return searchTermsFinal;
  } catch (err) {
    throw err;
  }
};
