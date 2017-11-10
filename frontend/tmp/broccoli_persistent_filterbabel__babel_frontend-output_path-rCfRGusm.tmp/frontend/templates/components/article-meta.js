define("frontend/templates/components/article-meta", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "aBjRYb5k", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[19,0,[\"model\",\"article\",\"allowSubmission\"]]],null,{\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"article-meta-text article-challenge-date\"],[7],[0,\"\\n\\t\\t\"],[6,\"span\"],[9,\"class\",\"article-icon\"],[7],[6,\"svg\"],[9,\"viewBox\",\"0 0 11.05 16.8\"],[7],[6,\"polyline\"],[9,\"points\",\"1.22 1.22 8.58 8.58 1.22 15.54\"],[7],[8],[8],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-challenge-label\"],[7],[6,\"span\"],[7],[0,\"Starts\"],[8],[0,\" \"],[1,[25,\"moment-format\",[[19,0,[\"model\",\"article\",\"dateStart\"]],\"MMMM Do YYYY\"],null],false],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-challenge-label\"],[7],[6,\"span\"],[7],[0,\"Ends\"],[8],[0,\" \"],[1,[25,\"moment-format\",[[19,0,[\"model\",\"article\",\"dateEndVoting\"]],\"MMMM Do YYYY\"],null],false],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"article-meta-text article-author\"],[7],[0,\"\\n\\t\\t\"],[6,\"span\"],[9,\"class\",\"article-icon\"],[7],[6,\"svg\"],[9,\"viewBox\",\"0 0 11.05 16.8\"],[7],[6,\"polyline\"],[9,\"points\",\"1.22 1.22 8.58 8.58 1.22 15.54\"],[7],[8],[8],[8],[0,\"\\n\\t\\t\"],[6,\"span\"],[7],[0,\"By \"],[1,[25,\"change-author-name\",[[19,0,[\"model\",\"article\",\"articleID\"]],22,23],null],false],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]}],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"article-social-media\"],[7],[0,\"\\n\\n\\t\"],[4,\"fb-share-button\",null,[[\"url\"],[[19,0,[\"model\",\"article\",\"url\"]]]],{\"statements\":[[0,\"Share\"]],\"parameters\":[]},null],[0,\"\\n\\t\"],[4,\"twitter-share-button\",null,[[\"url\",\"hastag\",\"title\",\"text\"],[[19,0,[\"model\",\"article\",\"url\"]],\"#8thMind\",[19,0,[\"model\",\"article\",\"title\"]],[19,0,[\"model\",\"article\",\"body\"]]]],{\"statements\":[[0,\"Tweet\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-meta.hbs" } });
});