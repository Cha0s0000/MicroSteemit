# MicroSteemit  
![logo.png](https://steemitimages.com/DQmRQYxggESLwh62iWLieccpxkXror7VAwFZKfEYE2QfK4W/logo.png)  


## What is  MicroSteemit

**MicroSteemit is developed based on the wechat micro application which is maintained by the tencent company.**

> wechat micro application is an application that doesn't need to be downloaded and installed. It implements the dream of "reach within reach", and users scan or search can open the micro application through the wechat application. It also reflects the idea of "running away", and users don't have to worry about installing too many apps. Micro Applications will be ubiquitous, readily available, without installing uninstall. Suitable for life service offline shops and non-new low-frequency conversion. The micro application can realize seven functions such as message notification, offline scan code and public number association. Among them, the user can realize the mutual jump between the wechat public account and the micro application through wechat association.

In a word , MicroSteemit is an application which can be used without downloading while chatting with friends in wechat easily. Just by scanning the MicroSteemit QR code  can we commodiously surf on  the steemit community.     

Beta version :  

![](https://steemitimages.com/DQmYJ6UGa7KsA8P39XywjasopHuWMnkLDPEkKJVAYLy43jE/image.png)   

------

## Existing features right now

- Show informations of the steemit account in the info page , including steemit account name ,reputation ,balance,sbd_balance, vesting_shares, steem power ,delegated SP ,voting _power , created time ,keys and posting auth.
- Show posts in trending , hot , new ,created .
- Add sharing to friends function
- Show detail of the post  including the post content , voting number , comment number ,pending payout and comments detail
- Show steemit account voting history
- Show steemit account followers and following list
- Show steemit account ever posts
- Show steemit account feed post list
- Show steemit account comments history
- Show steemit account replies history
- Show steemit account transaction history
- Show trending tags 
- Searching the tags
- Show different posts of different tags 
- Login with different account
- Navigate to set current tag while viewing the post list
- Navigate to view the author profile
- Add favorite posts collection
- Show steem/sbd price market
- Setting the gesture password
- Setting up back-end server

---

## Existing  valid api on back-end server right now

### post modules:

- http://127.0.0.1:3000/post/get_discussions_by_trending?query=QUERY
- http://127.0.0.1:3000/post/get_discussions_by_created?query=QUERY
- http://127.0.0.1:3000/post/get_discussions_by_hot?query=QUERY
- http://127.0.0.1:3000/post/get_active_votes?author=AUTHOR&pernlink=PERMLINK
- http://127.0.0.1:3000/post/get_discussions_by_author_before_date?author=AUTHOR&startPermlink=startPermlink&beforeDate=beforeDate&limit=limit
- http://127.0.0.1:3000/post/get_discussions_by_comments?query=QUERY
- http://127.0.0.1:3000/post/get_content?author=AUTHOR&pernlink=PERMLINK
- http://127.0.0.1:3000/post/get_content_replies?author=AUTHOR&pernlink=PERMLINK
- http://127.0.0.1:3000/post/get_discussions_by_feed?query=QUERY   

### tag modules:

- http://127.0.0.1:3000/tag/get_trending_tags?afterTag=afterTag&limit=limit  

### account modules:

- http://127.0.0.1:3000/account/get_followers?following=following&startFollower=startFollower&followType=followType&limit=limit
- http://127.0.0.1:3000/account/get_following?follower=follower&startFollowing=startFollowing&followType=followType&limit=limit
- http://127.0.0.1:3000/account/get_follow_count?account=account
- http://127.0.0.1:3000/account/get_account_votes?voter=voter  

### general modules:

- http://127.0.0.1:3000/general/get_state
- http://127.0.0.1:3000/general/get_dynamic_global_properties

---

## Some screen shot

User page

![](https://cdn.steemitimages.com/DQmNMPqDkeuvrog1xHVQQoydTF1DJuxzWaREGPhB7p2rdsd/image.png)

![](https://cdn.steemitimages.com/DQmUMgFVJs6pVADGzGj4TpE8az2oPENFigezgwzVE2ecaRx/image.png)

---

market page:

![](https://cdn.steemitimages.com/DQmZtRUE3Zqhnm126RZbKqB2BsKCUk6zSPhbyyp3JAJhsGt/image.png)

![](https://cdn.steemitimages.com/DQmPeUWzuTukiUuEKAk23L5R9ehrEePXP2FnatPSy1yszH5/image.png)

---

posts page:

![](https://cdn.steemitimages.com/DQmNMyvjWnzgiYoYqj2NfmsXN8eutcEc14sNyAiKnXiagj8/image.png)

---

show trending tags:

![](https://cdn.steemitimages.com/DQmW8gKq4Crq6phmUPkKex7JM26pZEBDZr8FWAiGVt61Cbx/image.png)

---

search tags:

![](https://cdn.steemitimages.com/DQmZWThntLukLfUPzz9x4CYxwdCG8x5ufEARrdxno4jBnD5/image.png)

---

automatically identify tags:

![](https://cdn.steemitimages.com/DQmcwCiHEzG37t767brH6NN4DLgypaDjdiDyxWTk83kJxs1/image.png)

---

show posts of specific tag:

![](https://cdn.steemitimages.com/DQmabTD9ui6hQ3LAzDBDckmXxFtCWPhhH6ZFmRMPWuuHJK5/image.png)

---

show account profile:

![](https://cdn.steemitimages.com/DQmWrdhak4b88GKQ2wspXSVGzKrtc6R3dxzruN7FCdrL3G1/image.png)

---

show account feed:

![](https://cdn.steemitimages.com/DQmWQ1EPjx7rySm9ccV6heHE51uuDnkpnXEgW9dBiP8VQuN/image.png)

---

show comments history:

![](https://cdn.steemitimages.com/DQmdQBvWHPe2jb8dWkWvGdfSXvmDW9JeFBBFZQJutoa1iPJ/image.png)

---

show recent replies history:

![](https://cdn.steemitimages.com/DQmSBR4eq14qUj7Jm5HFAQQZB2gg28mdR6mNGbooWw8Erak/image.png)

---

show voting history:

![](https://cdn.steemitimages.com/DQmTX1yJjzccdXKY7Y1wuz5ByQanrGds7Jhn5KzbCzjp1tD/image.png)

---

setting gesture password:

![](https://cdn.steemitimages.com/DQmPjmd1Sk7LNuZtjJNGxDzQZ9KjTwVS1J1XXxjjRKUCW5Q/image.png)   

----

Account track:  

![](https://cdn.steemitimages.com/DQmdsD3X85Fe8geKBGhJ7WEURp9artFWngvBeEFTHsiRB64/image.png)   
![](https://cdn.steemitimages.com/DQmW2vSHaHhqqBLjHYnkEyUFti6fhZybEttwCAvkoEDhDBc/image.png)  
![](https://cdn.steemitimages.com/DQmXCWPv6w5Nk2kVEiwRQ1fhsa7V3ine2uN9ffLFgXZ1fVL/image.png)

---

### How to develop it 

- Download the wechat development tool [https://open.weixin.qq.com/](https://open.weixin.qq.com/)

- Download the project

  > git clone https://github.com/Cha0s0000/MicroSteemit.git

- Coding

  ![图片.png](https://cdn.utopian.io/posts/de5b9ebf546e6649ca0442ee334f77baf44a图片.png)
