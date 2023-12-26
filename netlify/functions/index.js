const { readSearchTerms } = require("../../utils/fileProcessing");
const { main } = require("../../utils/pageProcessing");

exports.handler = async () => {
  // (async () => {
  //   const searchTerms = readSearchTerms();
  //   console.log(searchTerms);
  //   for (const searchTerm of searchTerms) {
  //     await main(searchTerm);
  //   }
  // })();
  console.log("requrest recived");
  return {
    statusCode: 200,
    body: "Hello, World!",
  };
};
