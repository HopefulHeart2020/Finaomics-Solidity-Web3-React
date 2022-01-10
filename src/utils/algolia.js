import algoliasearch from "algoliasearch";

const ALGOLIA_APP_ID = "1DCIDEHTUI";
const ALGOLIA_API_KEY = "0a4989a79a356950c9b0863d30a7ee78";

export const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY, {
  protocol: "https:",
});
export const algolia = client.initIndex("NFTs");
