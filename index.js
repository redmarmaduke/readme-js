const fs = require("fs");

var packageJSON = JSON.parse(fs.readFileSync("package.json","utf-8",{ "flags":"r" }));
console.log(packageJSON);

function capitalize(string) {
    return string.charAt(0).toUppercase().concat(string.slice(1));    
}

function capitalizeAll(string) {
    return string.split(" ").map(capitalize).join(" ");
}

function constructMDBadge(name, value, color, url) {
    name = name || "Name";
    value = value || "Value";
    color = color || "lightblue";

    // [![License](https://img.shields.io/badge/License-Boost%201.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)    
    let badge = `![${name}](https://img.shields.io/badge/${name}-${value}-${color}.svg)`; 
    if (url !== undefined) {
        badge = `[${badge}](${url})`;
    }
    return badge;
}

function constructHTMLBadge(name, value, color, url) {
    name = name || "Name";
    value = value || "Value";
    color = color || "lightblue";

    // [![License](https://img.shields.io/badge/License-Boost%201.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)    

    let badge = `<img alt="${name}" id="${name.charAt(0).toLowerCase()+name.slice(1)}" src="https://img.shields.io/badge/${name}-${value}-${color}.svg">`; 
    if (url !== undefined) {
        badge = `<a href="${url}">${badge}</a>`;
    }
    badge += "\n";
    return badge;
}

var header = "";

if ("name" in packageJSON) {
    header += `# ${packageJSON.name}\n`;
}
else {
    header += `# Name\n`;
}

if ("description" in packageJSON) {
    header += `${packageJSON.description}\n`;
}
else {
    header += `Description\n`;
}

//Badges associated with package
//Technologies

var tableOfContents = "";
var body = "";
var section = 0;

tableOfContents += "## Table of Contents\n";

tableOfContents += `${++section}. [Examples](#Examples)\n`;
body += "## Examples:  \n";

tableOfContents += `${++section}. [Features](#Features)\n`;
body += "## Features:  \n";

tableOfContents += `${++section}. [General Info](#General-Info)\n`;
body += "## General Info:  \n";

if ("os" in packageJSON || "cpu" in packageJSON) {
    tableOfContents += "\t- [Support](#Support)\n";
    body += "### Support:\n";
    body += "OS: "+packageJSON.os.join(", ")+"\n";
    body += "CPU: "+packageJSON.cpu.join(", ")+"\n";
    body += "  \n";
}

tableOfContents += "\t- [Setup](#Setup)\n";
body += "### Setup:  \n";

tableOfContents += "\t- [Usage](#Usage)\n";
body += "### Usage:  \n";

tableOfContents += `${++section}. [To-Do](#To-Do)\n`;
body += "## To-Do:  \n";

tableOfContents += `${++section}. [Feedback or Feature Request](#Feedback-or-Feature-Request)\n`;
body += "## Feedback or Feature Request:  \n";

tableOfContents += `${++section}. [Sources](#Sources)\n`;
body += "## Sources:  \n";

if ("author" in packageJSON) {
    tableOfContents += `${++section}. [Author](#Author)\n`;
    body += "## Author:\n";
    body += `${packageJSON.author}  \n`;
}

if ("contributors" in packageJSON) {
    tableOfContents += `${++section}. [Contributors](#Contributors)\n`;
    body += "## Contributors:\n";
    for (let contributor of packageJSON.contributors) {
        body += `${contributor}\n`;
    }
    body += "  \n";
}



if ("license" in packageJSON) {
    tableOfContents += `${++section}. [License](#License)\n`;
    body += "<br>";
    body += constructHTMLBadge("License",packageJSON.license,"blue");
    body += "  \n"
}
else {
    tableOfContents += `${++section}. [License](#License)\n`;
    body += "## License:  \n";
}

fs.writeFileSync("README-template.md",header+tableOfContents+body);