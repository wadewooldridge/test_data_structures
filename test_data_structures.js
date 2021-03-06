/*
 *  test_data_structures.js - Test implementation of data structures in JavaScript.
 *  Featuring abstract BinarySearchTree class with numeric and string parents.
 *  Copyright (C) 2016 by Wade Wooldridge
 */

/* Constants. */
var DATATYPE_NUMBER = 0;
var DATATYPE_STRING = 1;
var DATATYPE_PERSON = 2;

var DATATYPE_NAME = ['number', 'string', 'person'];

/* Global data */
gaInputData = [];                       // Just an array of numbers, strings, or objects.
gaOutputData = [];                      // Array of returned objects.

// Global data: the datatype of the tree, and the tree itself.
var gDataType = DATATYPE_STRING;        // Default checked box in HTML.
var gTree = null;

// Global data: control settings.
var gForceLowerCase = false;

/* Document ready function to kick everyting off. */
$(document).ready( function() {
    console.log('Document ready.');

    initProgram();
    initTree();

});

/* Add handlers to all of the control panel items. */
function addControlPanelHandlers() {
    console.log('addControlPanelHandlers');

    // TODO: Replace these with something that does not produce the "inefficient jQuery' warnings.
    $('#datatype-buttons').change(onDataTypeButtons);
    $('#lower-case-checkbox input').change(onLowerCaseCheckbox);

    $('#clear-button').click(onClearButton);
    $('#graph-button').click(onGraphButton);
    $('#print-button').click(onPrintButton);

    $('#add-file-input').change(onAddFileInputChange);
    $('#add-manual-button button').click(onAddManualButton);
    $('#add-random-button button').click(onAddRandomButton);
    $('#add-url-button button').click(onAddUrlButton);
}

/* Change placeholders to the control panel text input items, based on data type. */
function changeControlPanelPlaceholders() {
    console.log('changeControlPanelPlaceholders');
    var dataTypeName = DATATYPE_NAME[gDataType];

    $('#add-manual-button input').attr('placeholder', 'Manual ' + dataTypeName + '(s) to add');
    $('#add-random-button input').attr('placeholder', 'Count of random ' + dataTypeName + 's');
//
    $('#add-url-button input').attr('placeholder', 'URL load not current implemented.');
}

/* Change to a new data type and clear out the old data. */
function changeDataType(newDataType) {
    console.log('changeDataType: ' + DATATYPE_NAME[newDataType]);
    gDataType = parseInt(newDataType);

    // Enable or disable the 'lower case' checkbox based on new data type.
    var elem = $('#lower-case-checkbox input');
    if (newDataType == DATATYPE_STRING) {
        elem.removeAttr('disabled');
    } else {
        elem.attr('disabled', true);
    }

    // Change the placeholders to match the data type.
    changeControlPanelPlaceholders();

    // Clear out any of the old data.
    clearInputData();
    clearOutputData();

    // Build a new tree with the new data type.
    gTree = new BinarySearchTree();
}

/* Clear out the input-data area. */
function clearInputData() {
    console.log('clearInputData');
    gaInputData = [];
    updateInputDataDisplay();
    updateInputDataFooter();
}

/* Clear out the output-data area. */
function clearOutputData() {
    console.log('clearOutputData');
    gaOutputData = [];
    updateOutputDataDisplay();
}

/* Generate some random numbers to gaInputData. */
function generateRandomNumbersToInputData(count) {
    console.log('generateRandomNumbersToInputData: ' + count);

    // Pick numbers from -1,000,000 to +1,000,000.
    for (i = 0; i < count; i++) {
        var num = Math.floor(Math.random() * 2000000) - 1000000;
        gaInputData.push(num);
    }
    updateInputDataDisplay();
    updateInputDataFooter();
}

/* Generate some random strings to gaInputData. */
function generateRandomStringsToInputData(count) {
    console.log('generateRandomStringsToInputData: ' + count);

    // Generate random character string from 3 to 8 characters long.
    var chars = 'aaaaabbcdddeeeeeefghiiijkllmmnnooooapqrrrssstttuuvwxyz'.split('');

    for (i = 0; i < count; i++) {
        var len = Math.floor(Math.random() * 6) + 3;
        var str = '';
        for (var j = 0; j < len; j++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        gaInputData.push(str);
    }
    updateInputDataDisplay();
    updateInputDataFooter();
}

/* Main program initialization. */
function initProgram() {
    console.log('initProgram');

    addControlPanelHandlers();
    changeControlPanelPlaceholders();
}

/* Initialize the BinarySearchTree structure that we are going to use. */
function initTree() {
    console.log('initTree');
    gTree = new BinarySearchTree();
}

/* Button handler: add-file-button */
function onAddFileInputChange() {
    console.log('onAddFileInputChange');
    var file = $(this).get(0).files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function() {
            var contents = reader.result;
            parseStringToInputData(contents);
        }

        reader.readAsText(file);
    } else {
        console.log('onAddFileInputChange: file type not supported')
    }
}

/* Button handler: add-manual-button */
function onAddManualButton() {
    var s = $('#add-manual-button input').val();
    console.log('onAddManualButton: ', s);

    if (s.length) {
        parseStringToInputData(s);
    }
}

/* Button handler: add-random-button */
function onAddRandomButton() {
    var s = $('#add-random-button input').val();
    console.log('onAddRandomButton: ' + s);

    var count = parseInt(s);
    if (isNaN(count)) {
        count = 10;
    }

    switch (gDataType) {
        case DATATYPE_NUMBER:
            generateRandomNumbersToInputData(count);
            break;
        case DATATYPE_STRING:
            generateRandomStringsToInputData(count);
            break;
        default:
            console.log('onAddRandomButton: datatype not supported');
            break;
    }
}

/* Button handler: add-url-button */
function onAddUrlButton() {
    var url = $('#add-url-button input').val();
    console.log('onAddUrlButton: ' + url);


}

/* Button handler: clear-button */
function onClearButton() {
    console.log('onClearButton');
    clearInputData();
    updateInputDataDisplay();
    updateInputDataFooter();
    clearOutputData();
    updateOutputDataDisplay();
    updateOutputDataFooter();
}

/* Button handler: datatype-buttons */
function onDataTypeButtons() {
    var newDataType = $(this).find('input:checked').val();
    console.log('onDataTypeButtons: ' + DATATYPE_NAME[newDataType]);

    if (newDataType != gDataType) {
        changeDataType(newDataType);
    }

}

/* Button handler: graph-button */
function onGraphButton() {
    console.log('onGraphButton');
}

/* Checkbox handler: lower-case-checkbox. */
function onLowerCaseCheckbox() {
    var checked = $(this).prop('checked');
    console.log('onLowerCaseCheckbox: ' + checked);
    gForceLowerCase = checked;
}

/* Button handler: print-button */
function onPrintButton() {
    console.log('onPrintButton');

    // Initialize the tree and the output data.
    initTree();
    clearOutputData();

    // and add all the data to the tree.
    for (var i = 0; i < gaInputData.length; i++) {
        gTree.addWord(gaInputData[i]);
    }

    // Now traverse the tree in sorted order, calling back for each node in turn.
    gTree.traverseAndCallBack(onPrintCallback);

    // gaOutputData is now updated with the sorted tree.  Update the displays.
    updateOutputDataDisplay();
    updateOutputDataFooter();
}

/* Callback function used by onPrintButton handler */
function onPrintCallback(retObj) {
    console.log('onPrintCallback: ', retObj);
    gaOutputData.push(retObj);
}

/* Parse input string looking for numbers or strings, and add those to the gaInputData array. */
function parseStringToInputData(s) {
    console.log('parseStringToInputData: ' + s.length + ' bytes');

    if (gForceLowerCase) {
        s = s.toLowerCase();
    }

    // Allow decimal points in numeric input, but filter periods out of string input.
    switch (gDataType) {
        case DATATYPE_NUMBER:
            var numbers = s.split(/[ :;,?!'"&|{}\[\]\r\n\t\\A-Za-z]+/);
            // Don't allow invalid 'numbers' such as '.' to slip through.
            for (var i = 0; i < numbers.length; i++) {
                if (!isNaN(numbers[i])) {
                    gaInputData.push(numbers[i]);
                }
            }
            break;

        case DATATYPE_STRING:
        case DATATYPE_PERSON:
            var words = s.split(/[ .:;,?!'"&|{}\[\]\r\n\t\\0-9]+/);
            gaInputData = gaInputData.concat(words);
            break;

        default:
            break;
    }

    updateInputDataDisplay();
    updateInputDataFooter();
}

/* Update the input data display based on the current value of gaInputData. */
function updateInputDataDisplay() {
    console.log('updateInputDataDisplay');

    var s = '';
    for (var i = 0; i < gaInputData.length; i++) {
        s += (gaInputData[i] + ', ');
    }

    $('#input-data').text(s);
}

/* Update the input data footer based on the current value of gaInputData. */
function updateInputDataFooter() {
    console.log('updateInputDataFooter');
    $('#input-data-footer').text('Total ' + DATATYPE_NAME[gDataType] + 's: ' + gaInputData.length);
}

/* Update the output data display based on the current value of gaOutputData. */
function updateOutputDataDisplay() {
    console.log('updateOutputDataDisplay');

    var s = '';
    for (var i = 0; i < gaOutputData.length; i++) {
        var obj = gaOutputData[i];
        s += (obj.value + '=' + obj.count + ', ');
    }

    $('#output-data').text(s);
}

/* Update the input data footer based on the current value of gaInputData. */
function updateOutputDataFooter() {
    console.log('updateOutputDataFooter');
    $('#output-data-footer').text('Total nodes: ' + gaOutputData.length);
}

