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

![图片.png](https://cdn.utopian.io/posts/de5b9ebf546e6649ca0442ee334f77baf44a图片.png)

---

market page:

![图片.png](https://cdn.utopian.io/posts/3ff83348712393a55f5c84ab9c2ddbe6cc12图片.png)

---

posts page:

![图片.png](https://cdn.utopian.io/posts/1481a9f72d52a74c7b9ac6c1da1303124360图片.png)

---

show trending tags:

![图片.png](https://cdn.utopian.io/posts/fa28a450ab6b1f7dc5c3342acbc37b39c0c9图片.png)

---

search tags:

![图片.png](https://cdn.utopian.io/posts/d6a583ec779226188a1a4e99ab64b4167291图片.png)

---

automatically identify tags:

![图片.png](https://cdn.utopian.io/posts/5b54e755250838ce0415cf55306328bb917d图片.png)

---

show posts of specific tag:

![图片.png](https://cdn.utopian.io/posts/1fb1af365a39fb5b6e56555175e59691fe8c图片.png)

---

show account profile:

![图片.png](https://cdn.utopian.io/posts/cacc2933d66d447848abe4c4c81f194c1ef8图片.png)

---

show account feed:

![图片.png](https://cdn.utopian.io/posts/d83c2a7e4b4a314487e803cc303261f2b376图片.png)

---

show comments history:

![图片.png](https://cdn.utopian.io/posts/53b3922801fb584f1a8ead196df8098e0670图片.png)

---

show recent replies history:

![图片.png](https://cdn.utopian.io/posts/03cc5c8e3d966b18b256312dec733f5d014e图片.png)

---

show voting history:

![图片.png](https://cdn.utopian.io/posts/315c0b3f4ea11ef2e156723d8e29a52f7af2图片.png)

---

show witness voting and transaction history:

![图片.png](https://cdn.utopian.io/posts/1260d9076f0ab3d88dcc9645cec95fa3a63a图片.png)

---

setting gesture password:

![图片.png](https://cdn.utopian.io/posts/f1914b03df643d88aacf3a5ce72501d5a9d2图片.png)

---

### How to develop it 

- Download the wechat development tool [https://open.weixin.qq.com/](https://open.weixin.qq.com/)

- Download the project

  > git clone https://github.com/Cha0s0000/MicroSteemit.git

- Coding

  ![图片.png](https://cdn.utopian.io/posts/de5b9ebf546e6649ca0442ee334f77baf44a图片.png)
