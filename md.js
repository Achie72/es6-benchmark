/*
MIT License

Copyright (c) 2017 Elliott May Brooks

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


var findBlockQuotes = function findBlockQuotes(objectArray) {

    return objectArray.map(item => {

        if (item.content.slice(0, 2) === "> ") {
            return {
                type: 'blockquote',
                content: item.content.slice(2)
            };
        } else {

            return item
        }

    })
}

function findCodeBlockIndexes(objectArray) {
    var indexArr = [];
    objectArray.map((obj, i) => {
        if (obj.content === "```") {
            indexArr.push(i);
        }
    });

    return indexArr;
}

function modifyCodeBlocks(objectArray, codeBlockIndexes) {
    if (codeBlockIndexes.length % 2 !== 0 || codeBlockIndexes.length === 0) {
        return objectArray;
    }

    var inCodeBlock = false;
    return objectArray.map((obj, i) => {
        if (i === codeBlockIndexes[0] && inCodeBlock === false) {
            codeBlockIndexes.shift();
            inCodeBlock = true;
            return {
                type: "delete",
                content: obj.content
            };
        } else if (i === codeBlockIndexes[0] && inCodeBlock === true) {
            codeBlockIndexes.shift();
            inCodeBlock = false;
            return {
                type: "delete",
                content: obj.content
            };
        } else if (inCodeBlock === true) {
            return {
                type: "code",
                content: obj.content
            };
        } else {
            return obj;
        }
    });
}

function deleteObj(objArray) {
    return objArray.filter(obj => obj.type !== "delete");
}


var setCodeType = function setCodeType(objectArray) {
    var indexes = findCodeBlockIndexes(objectArray);
    objectArray = modifyCodeBlocks(objectArray, indexes);
    return deleteObj(objectArray);
}

 function getParagraphs(file) {
    /*
    parameter type:         string
                            ==>
    return value type:      array of strings
    Description: Takes in a string of markdown and returns an array of paragraphs as separated by a blank line.
    */
    var paragraphs = file.split("\n");
    paragraphs = paragraphs.map(paragraph => {
        paragraph = paragraph.trim(); // removes any whitespace around the paragraph
        if (paragraph === "") {
            return "\n";
        } else {
            return paragraph;
        }
    });
    return paragraphs;
}



function setInitialType(headerCount) {
    /*
    parameter type:         number
                            ==>
    return value type:      string
    Description: Takes in a number and returns the correct header (h1, h2, h3) or p (for paragraph) if the number is 0, or br if it is a line break.
    */

    if (headerCount === -1) {
        return 'br';
    }
    if (headerCount === 0) {
        return 'p';
    } else {
        return 'h' + headerCount;
    }
}

 function convertToObject(paragraph) {
    /*
    parameter type:         string
                            ==>
    return value type:      object
    Description: Takes in a paragraph, and returns an object with its tag type and content.
    ex. {type: 'h2', content: 'this is a header2'}.
    */
    var headerCount = 0;
    var content = "";
    paragraph.split("").forEach(char => {
        if (char === "#") {
            headerCount++;
        } else if (char === "\n") {
            headerCount = -1;
        } else {
            content += char;
        }
    });
    return {
        type: setInitialType(headerCount),
        content: content.trim()
    };
}

function splitUpParagraph(segment, resultStr, stack, tokens, tokenIndex) {
    let startOfWord = resultStr.indexOf(stack[0].complete) + 1;
    let textBeforeSelected = resultStr.slice(0, startOfWord);
    let startToken = tokens[2][tokenIndex];
    let selected = resultStr.slice(startOfWord + segment.length - 1, resultStr.indexOf(segment));
    let endToken = tokens[3][tokenIndex];
    let textAfterSelected = resultStr.slice(resultStr.indexOf(segment) + segment.length - 1);
    return textBeforeSelected + startToken + selected + endToken + textAfterSelected;
}

var convertText = function convertText(str) {
    str = " " + str + " ";
    var resultStr = str;

    const tokens =
        [
            [" **", " __", " *", " _", " `"],
            ["** ", "__ ", "* ", "_ ", "` "],
            ["<strong>", "<strong>", "<em>", "<em>", "<code>"],
            ["</strong>", "</strong>", "</em>", "</em>", "</code>"],
        ];

    var stack = [];

    for (let i = 0; i < str.length; i++) {

        let charBefore = str[i - 1];

        let threeChars = str.slice(i, i + 3);
        let fourthChar = str[i + 3];

        let twoChars = str.slice(i, i + 2);
        let thirdChar = str[i + 2];


        if (tokens[0].includes(threeChars) && fourthChar !== " ") {
            let complete = threeChars + fourthChar;
            stack.unshift({
                token: threeChars,
                complete: complete
            });

        } else if (tokens[0].includes(twoChars) && thirdChar !== " ") {
            let complete = twoChars + thirdChar;
            stack.unshift({
                token: twoChars,
                complete: complete
            });
        }

        if (tokens[1].includes(threeChars) && charBefore !== " ") {
            let tokenIndex = tokens[1].indexOf(threeChars);
            let complement = tokens[0][tokenIndex];

            if (stack.length && stack[0].token === complement) {
                resultStr = splitUpParagraph(threeChars, resultStr, stack, tokens, tokenIndex, fourthChar);
                stack.shift();
            }
        } else if (tokens[1].includes(twoChars) && charBefore !== " " && charBefore !== twoChars[0]) {
            let tokenIndex = tokens[1].indexOf(twoChars);
            let complement = tokens[0][tokenIndex];

            if (stack.length && stack[0].token === complement) {
                resultStr = splitUpParagraph(twoChars, resultStr, stack, tokens, tokenIndex, thirdChar);

                stack.shift();
            }
        }
    }
    return resultStr.trim();
}
var findLineBreaks = function findLineBreaks(objectArray) {

    return objectArray.map(object => {
        if (object.content[0] !== "-") {
            return object;
        }

        for (var i = 0; i < object.content.length; i++) {
            if (object.content[i] !== "-") {
                return object;
            }
        }

        return {
            type: 'hr',
            content: ""
        };

    });
}

function getAllLinks(text) {
    var inDescription = false;
    var inUrl = false;
    var startIndex;
    var endIndex;
    var description = "";
    var url = "";
    var links = [];

    for (var i = 0; i < text.length; i++) {
        if (text[i] === "[" && inDescription === false) {
            inDescription = true;
            startIndex = i;
        } else if (text.slice(i, i + 2) === "](") {
            inDescription = false;
            inUrl = true;
        } else if (inUrl === true && text[i] === ")") {
            inUrl = false;
            endIndex = i;
            links.push({
                type: 'link',
                startIndex,
                endIndex,
                description,
                url: url.slice(1)
            });
            startIndex = undefined;
            endIndex = undefined;
            description = "";
            url = "";

        } else if (inDescription) {
            description += text[i];

        } else if (inUrl === true) {
            url += text[i];
        }
    }
    return links;
}


function findImageLinks(links, text) {
    return links.map(link => {
        if (text[link.startIndex - 1] === "!") {
            var splitLink = link.url.trim();
            if (splitLink.indexOf(" ") > -1){
                var index = splitLink.indexOf(" ");
                var url = splitLink.slice(0, index);
                var alt = splitLink.slice(index+1);
                return {type: "image", startIndex: link.startIndex -1, endIndex: link.endIndex,  description: link.description, url, alt}
            } else {
            return {
                type: "image",
                startIndex: link.startIndex - 1,
                endIndex: link.endIndex,
                description: link.description,
                url: link.url
            };
                }
        } else {
            return link;
        }
    });
}

function translateLink(link) {
    var converted;
    if (link.type === 'link') {
        converted = `<a href="${link.url}">${link.description}</a>`;
    }
    if (link.type === 'image') {
        if (link.hasOwnProperty('alt')) {
            converted = `${link.description}</br><img src="${link.url}" alt=${link.alt} />`;
        } else {
            converted = `${link.description}</br><img src="${link.url}" />`;
        }
    }

    return {
        startIndex: link.startIndex,
        endIndex: link.endIndex,
        link: converted
    };
}

function convertAllLinks(text, links) {
    var result = "";
    links.forEach((link, index) => {
        if (index === 0) {
            result += text.slice(0, link.startIndex);
        } else {
            result += text.slice(links[index - 1].endIndex + 1, link.startIndex);
        }
        result += link.link;
    });
    result += text.slice(links[links.length - 1].endIndex + 1);
    return result;
}

var convertLinks = function convertLinks(objectArray) {
    return objectArray.map(item => {
        let links = getAllLinks(item.content);
        if (links.length) {
            links = findImageLinks(links, item.content);
            links = links.map(link => translateLink(link))
            let newText = convertAllLinks(item.content, links)
            return {
                type: item.type,
                content: newText
            }
        } else {
            return item
        }
    });
}
function findListIndexes(objectArray) {
    var indexArr = [];
    objectArray.map((obj, i) => {
        var check = obj.content.slice(0, 2);
        if (check === "* " || check === "+ " || check === "- ") {
            indexArr.push(i);
        }
    });

    return indexArr;
}

function markListItems(objectArr, indexArr) {
    return objectArr.map((item, i) => {
        if (i === indexArr[0]) {
            indexArr.shift();
            return {
                type: "ul li",
                content: item.content.slice(2)
            };
        } else {
            return item;
        }
    });
}

/* This is where we now find ordered lists */

function findOrderedListItems(objectArr) {
    var inList = false;
    var listNum = 1;
    return objectArr.map((item, index) => {
        if (item.content.slice(0, 3) === `${listNum}. `) {
            listNum++;
            inList = true;
            return {
                type: "ol li",
                content: item.content.slice(3)
            };
        }

        if (inList === true && item.content.slice(0, 3) !== `${listNum}. `) {
            inList = false;
            listNum = 1;
        }
        return item;
    });
}
function addContainerDivs(objectArr) {
    var result = [];

    var parentOptions = [
        ['ol li', 'ul li', 'code'],
        ['ol', 'ul', 'pre code'],
        ['li', 'li', ]
    ];

    objectArr.forEach((item, index) => {

        if (parentOptions[0].includes(item.type)) {

            let parentIndex = parentOptions[0].indexOf(item.type); // 0 for 'ol li', 1 for 'ul li', and 2 for 'code';

            if (!objectArr[index - 1] || objectArr[index - 1].type !== parentOptions[0][parentIndex]) {

                result.push({
                    type: parentOptions[1][parentIndex],
                    content: ""
                });
                result.push(item);
            } else {

                result.push(item);
            }

            if (!objectArr[index + 1] || objectArr[index + 1].type !== parentOptions[0][parentIndex]) {

                result.push({
                    type: parentOptions[1][parentIndex],
                    content: ""
                });
            }

        } else {

            result.push(item);
        }


    });
    return result;

}




function combineText(objectArr) {

    return objectArr.map((item, index) => {

        if (item.type === 'hr' || item.type === 'br') {

            return `<${item.type}/>`
        } else if (item.type === 'pre code') {

            if (objectArr[index + 1] && objectArr[index + 1].type === 'code') {

                return '<pre><code>'
            } else {
                return '</code></pre>'
            }

        } else if (item.type === 'ol' || item.type === 'ul') {

            if (objectArr[index + 1] && objectArr[index + 1].type === 'ol li' || objectArr[index + 1].type === 'ul li') {
                return item.type === 'ol' ? '<ol>' : '<ul>';

            } else {
                return item.type === 'ol' ? '</ol>' : '</ul>';
            }

        } else if (item.type === 'ol li' || item.type === 'ul li') {

            return `    <li>${item.content}</li>`

        } else if (item.type === 'code') {

            return item.content;

        } else {

            return `<${item.type}>${item.content}</${item.type}>`

        }


    })

}

function convertToHTML(markdownText){

    let paragraphs = getParagraphs(markdownText);

    let paragraphObjects = paragraphs.map(paragraph => convertToObject(paragraph));

    paragraphObjects = setCodeType(paragraphObjects);
    paragraphObjects = findLineBreaks(paragraphObjects);
    paragraphObjects = findBlockQuotes(paragraphObjects);

    let indexes = findListIndexes(paragraphObjects);
    paragraphObjects = markListItems(paragraphObjects, indexes);
    paragraphObjects = findOrderedListItems(paragraphObjects);

    paragraphObjects = convertLinks(paragraphObjects);

    paragraphObjects = paragraphObjects.map(paragraph => {
        return {
            type: paragraph.type,
            content: convertText(paragraph.content + " ").trim()  // this hack is needed because if not styling at the end of a paragraph will not be counted
        }
    });

    paragraphObjects = addContainerDivs(paragraphObjects);
    let arrayOfHTML = combineText(paragraphObjects);

    return arrayOfHTML.join("\n");
}


function getParagraphs(file) {
    /*
    parameter type:         string
                            ==>
    return value type:      array of strings
    Description: Takes in a string of markdown and returns an array of paragraphs as separated by a blank line.
    */
    var paragraphs = file.split("\n");
    paragraphs = paragraphs.map(paragraph => {
        paragraph = paragraph.trim(); // removes any whitespace around the paragraph
        if (paragraph === "") {
            return "\n";
        } else {
            return paragraph;
        }
    });
    return paragraphs;
}



function setInitialType(headerCount) {
    /*
    parameter type:         number
                            ==>
    return value type:      string
    Description: Takes in a number and returns the correct header (h1, h2, h3) or p (for paragraph) if the number is 0, or br if it is a line break.
    */

    if (headerCount === -1) {
        return 'br';
    }
    if (headerCount === 0) {
        return 'p';
    } else {
        return 'h' + headerCount;
    }
}

function convertToObject(paragraph) {
    /*
    parameter type:         string
                            ==>
    return value type:      object
    Description: Takes in a paragraph, and returns an object with its tag type and content
    ex. {type: 'h2', content: 'this is a header2'}.
    */
    var headerCount = 0;
    var content = "";
    paragraph.split("").forEach(char => {
        if (char === "#") {
            headerCount++;
        } else if (char === "\n") {
            headerCount = -1;
        } else {
            content += char;
        }
    });
    return {
        type: setInitialType(headerCount),
        content: content.trim()
    };
}


//Example from: https://markdown-to-html-demo.herokuapp.com/
const markdownStr = "# Markdown to HTML Converter\
This note demonstrates all the functionality of the **Markdown to HTML Converter** available on npm.\
*Note: Feel free to edit this note, or even to click **clear** and start making your own note!*\
 **You can click the `Raw HTML` button at the bottom of this page to view this note as raw HTML!**\
## Images\
First and foremost, Markdown can  contain images.\
![Here is a picture of a very cute puppy:](../public/puppy-image-example.jpg 'puppy photo')\
## Basic formatting\
Paragraphs can be written like so. A paragraph is the basic block of Markdown. A paragraph is what text will turn into when there is no reason it should become anything else.\
Paragraphs must be separated by a blank line. Basic formatting of *italics* and **bold** is supported. This *can be **nested** like* so.\
## Lists\
### Ordered list\
1. Item 1\
2. A second item\
3. Number 3\
4. Ⅳ\
### Unordered list\
* An item\
* Another item\
* Yet another item\
* And there's more...\
## Paragraph modifiers\
### Code block\
```\
Code blocks are very useful for developers and other people who look at code or other things that are written in plain text. As you can see, it uses a fixed-width font.\
```\
You can also make `inline code` to add code into other things.\
### Quote\
> Here is a quote. What this is should be self explanatory. Quotes are automatically indented when they are used.\
## Headings\
There are six levels of headings. They correspond with the six levels of HTML headings. You've probably noticed them already in the page. Each level down uses one more hash character.\
### Headings *can* also contain **formatting**\
### They can even contain `inline code`\
Of course, demonstrating what headings look like messes up the structure of the page.\
I don't recommend using more than three or four levels of headings here, because, when you're smallest heading isn't too small, and you're largest heading isn't too big, and you want each size up to look noticeably larger and more important, there there are only so many sizes that you can use.\
## URLs\
URLs can be made like so: [Markdown To HTML Converter on Github](https://github.com/elliette/markdown-to-html-converter/)\
## Horizontal rule\
A horizontal rule is a line that goes across the middle of the page.\
---\
It's sometimes handy for breaking things up.;"


const htmlStr = convertToHTML(markdownStr);
print(htmlStr)
