  /*   
   Copyright 2011 Martin Hawksey
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// Usage
//  1. Enter sheet name where data is to be written below
        var SHEET_NAME = "MASTER LIST";
        
//  2. Run > setup
//
//  3. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//
//  4. Copy the 'Current web app URL' and post this in your form/script action 
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doGet(e){
  return handleResponse(e);
}

//function doPost(e){
//  return handleResponse(e);
//}

function handleResponse(e) {
  // shortly after my original solution Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  
  try {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = []; 


    // Check if the row already exists:
    var duplicateRow = doesRowAlreadyExist("ID", e.parameter["ID"]);
    if(duplicateRow) {
      // The row already exists
      // TODO: Get the existing row, make the "Needs Updating" column "YES"
      var flaggedColumnNumber = findKeyColumn("Flagged");
      var commentsColumnNumber = findKeyColumn("Comments");
      var oldCommentsValue = sheet.getRange(duplicateRow+1, commentsColumnNumber+1).getValues();
      if(flaggedColumnNumber && commentsColumnNumber) {
        sheet.getRange(duplicateRow+1, flaggedColumnNumber+1).setValue(e.parameter["Flagged"]);
        sheet.getRange(duplicateRow+1, commentsColumnNumber+1).setValue(oldCommentsValue + " --- " + e.parameter["Comments"]);
      } // else there is an error: didn't find the columns

    } else {
      // No duplicate, add a row:
      for (i in headers){
        if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
          row.push(new Date());
        } else { // else use header name to get data
          row.push(e.parameter[headers[i]]);
        }
        // more efficient to set values as [][] array than individually
        sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
      }
    }


    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "duplicateRow": duplicateRow, "flaggedColumnNumber": flaggedColumnNumber, "commentsColumnNumber":commentsColumnNumber, "headers length":headers.length}))
          .setMimeType(ContentService.MimeType.JSON);
    // END try
  } catch(e){
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}


function doesRowAlreadyExist(keyColumn, uniqueValue) {
  // Select the sheet to work with:
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);

  // Find the header row (probably row 1)
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Find the keyColumn:
  var keyColumnNumber = findKeyColumn(keyColumn);

  var data = sheet.getDataRange().getValues();

  // Check if the uniqueValue already exists:
  for (i in data) {
    if(data[i][keyColumnNumber] == uniqueValue) {
      // Found it, return the index number
      return parseInt(i);
    }
  }
  // Didn't find it, return false
  return false;

}


function findKeyColumn(keyColumn) {
  // Select the sheet to work with:
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);

  // Find the header row (probably row 1)
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Find the keyColumn:
  var keyColumnNumber = -1;
  for(i in headers) {
    if(headers[i] == keyColumn) {
      keyColumnNumber = i;
    }
  }
  if(keyColumnNumber){
    return parseInt(keyColumnNumber);
  } else {
    return false;
  }
}


function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}