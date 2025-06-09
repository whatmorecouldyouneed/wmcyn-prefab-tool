"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const NewsletterForm_1 = __importDefault(require("../components/NewsletterForm"));
const page_module_scss_1 = __importDefault(require("./page.module.scss"));
function Home() {
    return (React.createElement("main", { className: page_module_scss_1.default.main },
        React.createElement("div", { className: page_module_scss_1.default.container },
            React.createElement("h1", { className: page_module_scss_1.default.title },
                "Welcome to ",
                { projectName }),
            React.createElement("section", { className: page_module_scss_1.default.section },
                React.createElement("h2", { className: page_module_scss_1.default.sectionTitle }, "Stay Updated"),
                React.createElement(NewsletterForm_1.default, null)))));
}
