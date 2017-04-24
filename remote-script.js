! function() {
    "use strict";
    var a = window.flagKBArticle = {
        version: "{version}",
        init: function() {
            var articleUrl = '';
            var articleId = '';
            var articleName = '';
            var articleTopic = '';
            var articleComments = '';
            

            
            var currentUrl = window.location.href;
            if(currentUrl.startsWith('http://support.august.com/customer/')) {
                articleComments = prompt("Why did you flag this article?");
                var currentArticleIdentifier = currentUrl.replace('http://support.august.com/customer/en/portal/articles/', '');
                currentArticleIdentifier = currentArticleIdentifier.split(/[?#]/)[0];

                var currentTopic = document.getElementsByClassName("sidebar_topic")[0];

                articleUrl = currentUrl.split(/[?#]/)[0];;
                articleId = currentArticleIdentifier.substring(0, 7);
                articleName = document.getElementById("content").getElementsByClassName("header")[0].getElementsByTagName("h2")[0].innerHTML.replace(/^[ ]+|[ ]+$/g,'').replace(/^\s+|\s+$/g, '');
                articleTopic = currentTopic.getElementsByTagName("h4")[0].innerHTML.replace(/^[ ]+|[ ]+$/g,'');


                console.log('articleUrl: ' + articleUrl);
                console.log('articleId: ' + articleId);
                console.log('articleName: ' + articleName);
                console.log('articleTopic: ' + articleTopic);
            } else {
                console.log('Not gonna work on this site!');
            }


            // Set up the GET query string:
            var theQueryString = "ID=" + articleId + "&Link=" + articleUrl + "&Title=" + articleName + "&Topic=" + articleTopic;
            theQueryString += "&Flagged=YES&Comments=" + articleComments;
            theQueryString += "&Has Images=-&Screenshots=-&Videos=-&Activity Feed=-&Needs Updating=-";
            theQueryString = theQueryString.replace(/ /g, '+');
            var theUrlWithQueryString = "https://script.google.com/macros/s/AKfycbxB9FK82TITEFV3waqc7L12pjNdCiyDH875o2JtzuEgmw88W8w6/exec?" + encodeURI(theQueryString);
            
            // var theUrlWithQueryString = "https://script.google.com/macros/s/AKfycbxB9FK82TITEFV3waqc7L12pjNdCiyDH875o2JtzuEgmw88W8w6/exec?ID=123123&Title=Hi+there+person&Has+Images=-&Screenshots=-&Videos=-&Activity+Feed=-&Needs+Updating=YES&Comments=The+thing+is+cool%21"

            // alert("URL: " + theUrlWithQueryString);


            // Setup & execute the GET Ajax request:
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState != 4) return;

                if (this.status == 200) {
                    var data = JSON.parse(this.responseText);
                    // Got the response data
                    console.log(data);
                }
                // End of state change: could be a minute (asyncronous)
                console.log("Done");
                alert("Thank you. This article has been flagged.");
            };

            xhr.open('GET', theUrlWithQueryString, true);
            xhr.send();
        }
    }
}();