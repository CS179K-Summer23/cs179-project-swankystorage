# Swanky Storage
## Web App
Craigslist style app where users can post listings of objects and find listings that others have posted. They can contact one another through a simple chat feature to sell/buy/ask about listings. 
## Team Members
- Jacob Cunningham: Jacob-Cunningham
- Shaike Mukul: ShaikeMukul
- Aarav Patel: aarav885
- Dale Eman: deman001
- Abdullah Chaudhry: ChauAbdul786
## Technologies
- JavaScript
- HTML/CSS
- React 
- React-Bootstrap
- Mongoose/MongoDB
## Major Features
- Account Sign Up/Log In: *40 Story Points*
- Create Listings: *40 Story Points*
  - Item
  - Price
  - Location
  - Pictures
  - Description
  - Favorite/Like/Save Button
- Display Listings: *40 Story Points*
- Filtering Listings: *40 Story Points*
- Chat: *40 Story Points*
- Search: *40 Story Points*
- Removing Listings: *20 Story Points*
- Favorited/Liked/Saved Listings : *40 Story Points*
- Remote Hosting: If time permits
- Light/Dark/High Contrast Mode: If time permits
## User Stories
- Create listings 
  - As a seller I want to create listings where I can describe my product.
- Display listings
  - As a buyer I want to view lists of listings to find products I want.
- Favorited Listings
  - As a buyer I want to save listings so I can come back to them later.
- Sign up
  - As a user I want to create an account so only I can manage my listings.
- Adding/removing categories by listing
  - As a buyer I want to sort listings by categories chosen by sellers.
- Chat
  - As a user I want to be able to chat with the person that is buying/selling from me.
- Search
  - As a buyer I want to be able to search for the specific item that I want.
- Removing listings
  - As a seller I want to remove my listings when my product has sold.
- Update listings
  - As a seller I want to update my listings to correct errors and/or update details about the posting.
- Optional / Out of Scope
  - Account Recovery
    - As a user I want to reset my password over Email.
  - Hosting
  - Light / Dark / High Contrast Mode

## To Run Locally
Open two terminals. Inside the first: 
```sh
cd client
npm i
npm start
```
Inside the second: 
```sh
cd mongo
npm i
node schema.js
```
