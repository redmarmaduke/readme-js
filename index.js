const fs = require("fs");

var packageJSON = JSON.parse(fs.readFileSync("package.json","utf-8",{ "flags":"r" }));
console.log(packageJSON);

var packageLockJSON = JSON.parse(fs.readFileSync("package-lock.json","utf-8",{ "flags":"r" }));
console.log(packageLockJSON);

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

/**
 * constructHTMLBadge
 * 
 * Construct a badge from img.shields.io
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} color 
 * @param {*} url 
 */
function constructHTMLBadge(name = "Name", value = "Value", color = "lightblue", url) {
    // [![License](https://img.shields.io/badge/License-Boost%201.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)        
    let badge = `<img alt="${name}" id="${name.charAt(0).toLowerCase()+name.slice(1)}" src="https://img.shields.io/badge/${name}-${value}-${color}.svg">`; 
    // if there's an URL associated with the badge then imbed in an href
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
header += "\n";

//Badges associated with package
//Technologies

if ("dependencies" in packageJSON && "dependencies" in packageLockJSON) {        
    for (let dependency in packageJSON.dependencies) {
        console.log(dependency,packageLockJSON.dependencies[dependency].version,constructHTMLBadge(dependency,packageLockJSON.dependencies[dependency].version));
        header += `${constructHTMLBadge(dependency,packageLockJSON.dependencies[dependency].version)}\n`;
    }
    header += "\n";
}

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
body += `
\`\`\`sh
npm install
\`\`\`
`;

tableOfContents += "\t- [Usage](#Usage)\n";
body += "### Usage:  \n";
body += `
\`\`\`sh
npm start
\`\`\`
`;

tableOfContents += `${++section}. [To-Do](#To-Do)\n`;
body += "## To-Do(s):  \n";
body += `
<div id="todoContainer"></div>
\n`;

tableOfContents += `${++section}. [Feedback or Feature Request](#Feedback-or-Feature-Request)\n`;
body += "## Feedback or Feature Request(s):  \n";
body += `
<div id="featureContainer"></div>
\n`;

body += `
<script src="https://code.jquery.com/jquery-3.5.1.min.js"
    integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<script defer>
    function liListToOl(liList) {
        if (liList.length !== 0) {
            var el = $("<ol>");
            for (let li of todos) {
                el.append(li);
            }                        
        }
        else {
            var el = $("<span>&emsp;&emsp;None.</span>");
        }
        return (el);
    }
    $.ajax(        
        "${packageJSON.bugs.url.replace("https://github.com","https://api.github.com")}",
        {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        }).then(
            function (data, textStatus, jqXHR) {
                function isEnhancement(issue) {
                    for (let label of issue.labels) {
                        if (label.name === "enhancement") {
                            return (true);
                        }
                    }    
                }

                let features = [];
                let todos = [];
                for (let issue of data) {
                    let li = $("<li>");
                    let anchor = $("<a>");
                    anchor.prop("href", issue.html_url);
                    anchor.text(issue.title);
                    li.append(anchor);

                    if (isEnhancement(issue)) {
                        features.push(li);
                    }
                    else {
                        todos.push(li);
                    }
                }
            
                $("#todoContainer").append(liListToOl(todos));
                $("#featureContainer").append(liListToOl(features));
            },
            function (jqXHR, textStatus, errorThrown) {
                $("#todoContainer").append(liListToOl([]));
                $("#featureContainer").append(liListToOl([]));
            }
        );
</script>
\n`;

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