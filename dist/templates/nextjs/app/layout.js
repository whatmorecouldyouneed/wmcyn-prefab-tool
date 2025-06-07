"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("../styles/globals.scss");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: '{{projectName}}',
    description: 'Created with WMCYN Prefab Tool',
};
function RootLayout({ children, }) {
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: inter.className }, children)));
}
