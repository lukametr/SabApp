"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonCategory = exports.DocumentFormat = void 0;
var DocumentFormat;
(function (DocumentFormat) {
    DocumentFormat["PDF"] = "pdf";
    DocumentFormat["DOC"] = "doc";
    DocumentFormat["DOCX"] = "docx";
    DocumentFormat["TXT"] = "txt";
})(DocumentFormat || (exports.DocumentFormat = DocumentFormat = {}));
var PersonCategory;
(function (PersonCategory) {
    PersonCategory["INDIVIDUAL"] = "individual";
    PersonCategory["LEGAL"] = "legal";
})(PersonCategory || (exports.PersonCategory = PersonCategory = {}));
