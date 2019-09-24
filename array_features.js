/*
 * MIT License
 *
 * Copyright (c) 2019 Tóth Béla
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var assert = function(a,b) {
    if (a == b) {
        return true
    } else {
        throw "Error: Generated output does not correspond to the expected"
    }
}

var originalString = "ta This is A dummy TexT To AnAlyze ArrAy new ES6 feATures broughT inTo jAvAscripT.\
Premise is To hAve All A And T chArAcTers uppercAse, seArch for Them, And lATer replAce All occurrences\
 inTo smAll versions using The new funcTion inTroduced."

var expectedString = "ta this is a dummy text to analyze array new ES6 features brought into javascript.\
Premise is to have all a and t characters uppercase, search for them, and later replace all occurrences\
 into small versions using the new function introduced."



var workString = originalString;

// lets concat it a few times to have a bigger test input
// also concat our expected result the same time
for (var i = 0; i <= 3; i++) {
    workString += workString
    expectedString += expectedString
}

var characterArray = Array.from(workString)
var indexes = []

// search for the characters, and save their indexes
for ([index, element] of characterArray.entries()) {
    if (element === "T" || element === "A") {
        indexes.push(index)
    }
}

// copy the corresponding small variant from the start
// of the array to the given index
for (idx of indexes) {
    if (characterArray[idx] === "T" ) {
        characterArray.copyWithin(idx,0,1)
    }
    if (characterArray[idx] === "A" ) {
         characterArray.copyWithin(idx,1,2)
    }
}

// create our result string
var lowerCaseString = characterArray.join('')

// test our result
assert(lowerCaseString,expectedString)


var numbers = Array(10000)
numbers.fill(0)
numbers.fill(2,2500)
numbers.fill(1,2500,5000)
numbers.fill(3,7500)
numbers[9999] = 11

var startOne = numbers.findIndex(number => number == 1);
var startTwo= numbers.findIndex(number => number == 2);
var startThree = numbers.findIndex(number => number == 3);
var findDifferent = numbers.findIndex(number => number == 11)

assert(numbers.find(number => number > 3),11)

print(startOne + " " + startTwo + " " + startThree + " " + findDifferent)

var keys = [...numbers.keys()]
var values = [...numbers.values()]

var reverseValues = []

for (key of keys) {
    reverseValues[key] = numbers.pop()
}

var expectedReverseValues = values.reverse()

for (var i = reverseValues.length - 1; i >= 0; i--) {
    assert(reverseValues[i],expectedReverseValues[i])
}
