let globalTweetMap = new Map();

function extractTweetId(tweet) {
    const linkElement = tweet.querySelector('a[href*="/status/"]');
    let tweetId = null;
    if (linkElement) {
        const href = linkElement.getAttribute('href');
        const statusPosition = href.indexOf('/status/') + 8; // +8 to move past '/status/'
        tweetId = href.substring(statusPosition);
    }
    return tweetId;
}

function extractLikes(tweet) {
    const likeButton = tweet.querySelector('button[data-testid="like"]');
    let likesCount = 0;
    if (likeButton) {
        const likesText = likeButton.querySelector('div > div > span > span').innerText;
        likesCount = parseInt(likesText, 10);
    }
    return likesCount;
}

function getContent(textsDom) {
    let content = "";
    for (const textDom of textsDom) {
        if (textDom.tagName.toLowerCase() === "span") {
            content += textDom.innerText;
        }
        if (textDom.tagName.toLowerCase() === "img") {
            content += textDom.getAttribute("alt");
        }
    }
    return content;
}

function extractTweetPhotoUrl(tweet) {
    const photoDiv = tweet.querySelector('[data-testid="tweetPhoto"]');
    let photoUrl = null;
    if (photoDiv) {
        const imgTag = photoDiv.querySelector('img');
        if (imgTag) {
            photoUrl = imgTag.getAttribute('src');
        }
    }
    return photoUrl;
}

function extractTweetDate(tweet) {
    const timeElement = tweet.querySelector('time');
    let tweetDate = null;
    if (timeElement) {
        tweetDate = timeElement.getAttribute('datetime'); 
    }
    return tweetDate;
}

function extractCommentCount(tweet) {
    const replyButton = tweet.querySelector('button[data-testid="reply"]');
    let commentCount = 0;
    if (replyButton) {
        const commentTextElement = replyButton.querySelector('div > div > span > span > span');
        if (commentTextElement && commentTextElement.innerText) {
            commentCount = parseInt(commentTextElement.innerText, 10);
        }
    }
    return commentCount;
}

function extractRetweetCount(tweet) {
    const retweetButton = tweet.querySelector('button[data-testid="retweet"]');
    let retweetCount = 0;
    if (retweetButton) {
        const retweetTextContainer = retweetButton.querySelector('div > div > span > span');
        if (retweetTextContainer && retweetTextContainer.innerText) {
            const retweetText = retweetTextContainer.innerText;
            retweetCount = parseInt(retweetText, 10) || 0;
        }
    }
    return retweetCount;
}

function extractViewCount(tweet) {
    const viewLink = tweet.querySelector('a[aria-label*="views"]');
    let viewCount = 0;
    if (viewLink) {
        const viewTextElement = viewLink.querySelector('div > div > span > span > span');
        if (viewTextElement && viewTextElement.innerText) {
            const viewText = viewTextElement.innerText;
            // Convert '19K' to 19000 and '1.2M' to 1200000, etc.
            if (viewText.endsWith('K')) {
                viewCount = parseFloat(viewText) * 1000;
            } else if (viewText.endsWith('M')) {
                viewCount = parseFloat(viewText) * 1000000;
            } else {
                viewCount = parseInt(viewText, 10);
            }
        }
    }
    return viewCount;
}

function userLikesTweet(tweet) {
    const likeButton = tweet.querySelector('button[data-testid="like"]');
    if (likeButton) {
        return false;
    }
    return true; 
}

function populateGlobalTweetMap() {
    const tweets = document.querySelectorAll("article");
    for (const tweet of tweets) {
        const textsDom = tweet.querySelectorAll("[data-testid=tweetText] > *");

        let tweetId = extractTweetId(tweet);
        let likes = extractLikes(tweet);
        let content = getContent(textsDom);
        let photo = extractTweetPhotoUrl(tweet);
        let date = extractTweetDate(tweet);
        let comments = extractCommentCount(tweet);
        let retweets = extractRetweetCount(tweet);
        let views = extractViewCount(tweet);
        let userLikesTheTweet = userLikesTweet(tweet);

        if (tweetId && content) {
            let tweetData = new Map();
            tweetData.set("content", content);
            if (photo) {
                tweetData.set("photo", photo);
            }
            tweetData.set("likes", likes);
            tweetData.set("date", date);
            tweetData.set("comments", comments);
            tweetData.set("retweets", retweets);
            tweetData.set("views", views);
            tweetData.set("userLikesTweet", userLikesTheTweet);

            globalTweetMap.set(tweetId, tweetData);
            console.log(globalTweetMap);
        }
    }
}

function sendDataToKinode() {
    if (globalTweetMap.size > 0) {
        fetch('http://localhost:8080/data:command_center:appattacc.os/populate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([...globalTweetMap])
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.success) {
                globalTweetMap.clear();
                console.log('Tweet map cleared after successful ingestion.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function ingest() {
    populateGlobalTweetMap();
    sendDataToKinode();
}

console.log("Running Kinode Extension"); 
ingest();
setInterval(ingest, 5000); 

