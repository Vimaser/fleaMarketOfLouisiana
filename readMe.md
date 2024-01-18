### FLEAMARKET OF LOUISIANA ###

* -working on it
** -near completion / have a working prototype
*** Done

Appealing Design: Reflect the vibrant, diverse atmosphere of a flea market in your design. Use colorful, engaging visuals and an easy-to-navigate layout.

Vendor Profiles: Create sections for vendor profiles, showcasing their products, history, and any unique stories. This personal touch can attract visitors to their stalls.

Interactive Map: Include an interactive map of the flea market layout. This helps visitors plan their visit and locate specific vendors or sections.

Event Calendar: Implement a calendar featuring special events, such as themed market days, live music, or other attractions. Keep it easy to update.

Social Media Integration: Embed social media feeds to show the latest posts and updates. This keeps the content dynamic and fresh.

Search Functionality: Include a search bar to help visitors quickly find vendors, products, or information on the site.

Newsletter Sign-Up: Add an option for visitors to sign up for newsletters for updates, special events, and promotions.

Responsive Design: Ensure the website is mobile-friendly, as many users will access it on their smartphones.

SEO Optimization: Optimize for search engines to increase visibility. Use relevant keywords related to flea markets and local attractions.

Accessibility: Make your website accessible to all users, including those with disabilities. This includes screen reader compatibility and alternative text for images.

Customer Reviews and Testimonials: Feature reviews and testimonials from both vendors and visitors.

Blog Section: Consider a blog to share news, vendor spotlights, and tips for flea market shoppers.

Contact Information: Clearly display contact information, including hours of operation, location with directions, and contact forms.

Local Culture Highlight: Since it's a local market, integrating elements of Louisiana's rich culture, music, and art can add a unique flair to the website.

# frontEnd Outline

Home.js: The landing page of your site, showcasing the flea market's highlights, upcoming events, and featured vendors.

Admin.js: A dashboard for site administrators to manage content, vendors, events, blog posts, etc.

Contact.js: A page with a contact form, address, map location, and other contact information.

Footer.js: A reusable component for the footer that includes contact info, navigation links, social media icons, and legal information.

***Login.js: A login page for the admin to access the backend dashboard.

**Index.js: The main entry point of your React application, typically used to set up routing and global styles.

Vendor.js: Individual vendor profiles or listings with details about their offerings and location in the flea market.

Events.js: A page dedicated to showcasing upcoming events at the flea market.

Blog.js: If you plan to include a blog for news, vendor spotlights, and flea market tips.

***FAQ.js: A Frequently Asked Questions page can be very useful for first-time visitors.

Gallery.js: A photo gallery showing the flea market's atmosphere, special events, and vendor products.

Map.js: An interactive map of the flea market, possibly integrating Google Maps API for better navigation and layout understanding.

SignUp.js: If you decide to allow vendors or regular visitors to create accounts, for receiving newsletters or special offers.

404.js: A custom "Page Not Found" component for handling invalid URLs.

**Header.js: A reusable component for the website's header, including the main navigation menu.

Testimonials.js: A section or page for customer and vendor testimonials.

PrivacyPolicy.js: If you're collecting any data (like emails for a newsletter), a page outlining your privacy policy might be necessary.

TermsAndConditions.js: Similar to PrivacyPolicy.js, particularly important if you're allowing transactions or sign-ups.

# backEnd Outline for firebase

**
Vendors: Contains documents for each vendor.
Fields: vendorID, name, description, productCategories, images, contactInformation, locationInMarket
**
Events: Information about upcoming and past events.
Fields: eventID, title, description, date, time, location, image, link
**
BlogPosts: For news, updates, and vendor spotlights.
Fields: postID, title, content, author, publishDate, featuredImage, tags
** Need to impliment CAPTCHA
Contact: Stores messages received from the contact form.
Fields: messageID, name, email, message, dateReceived.
**
FAQs: Frequently Asked Questions.
Fields: questionID, question, answer.
**
testimonialsCollection: Customer and vendor testimonials.
Fields: testimonialID, author, content, date.

galleryCollection: Images showcasing the market.
Fields: imageID, description, dateAdded, imageURL.

// Probably not adding the flowing
adminUsers: For managing admin logins if not using Firebase Authentication.
Fields: userID, username, email, password (hashed).

// Going to have to update the storage later! In the env for firebase image bucket!

/your-firebase-bucket/
    /vendors/
        /vendor1/
            image1.jpg
            image2.jpg
        /vendor2/
            image1.jpg
            image2.jpg


***
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
***


```JavaScript
// Uploading
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const storage = getStorage();
const storageRef = ref(storage, 'vendors/vendor1/image1.jpg');

// 'file' is a Blob or File object representing the image
uploadBytes(storageRef, file).then((snapshot) => {
  console.log('Uploaded a blob or file!');
});
```

```JavaScript
// Retrieving
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const storage = getStorage();
const pathReference = ref(storage, 'vendors/vendor1/image1.jpg');

getDownloadURL(pathReference)
  .then((url) => {
    // Insert url into an <img> tag to "download"
  })
  .catch((error) => {
    // Handle any errors
  });
```

# devNotes

Decided on Flickr API for vendor images to save on data storage.

# Achievements:
Core Functionalities: You've made significant progress in implementing core functionalities like vendor profiles, event management, FAQs, and blog editing. These are crucial for the user experience and content management of your website.

Dynamic Content Handling: You've implemented dynamic sections like upcoming events and vendor highlights, which are key to keeping the website engaging and up-to-date.

Authentication and User Roles: You've set up user authentication and differentiated functionalities based on user roles (Admin and Vendor), ensuring security and appropriate access control.

Responsive Components: You've worked on various components like Home.js, Vendor.js, FAQs.js, and others, focusing on creating a functional and navigable structure for your site.

Areas to Focus on:
Design and User Experience: While the functional backbone is shaping up, focusing on design aspects to make the website visually appealing and user-friendly is crucial.

Testing and Debugging: Ensure all functionalities are thoroughly tested. Fix bugs and issues like the 'undefined name' error in Home.js for a smooth user experience.

Finalizing Features: Complete any pending features like the interactive map, social media integration, and newsletter sign-up.

SEO and Accessibility: Optimize your website for search engines and ensure it's accessible to all users, including those with disabilities.

Content and Local Culture Integration: Populate the site with engaging content and infuse elements of Louisiana's rich culture to enhance its uniqueness.

Review and Refine: Go through each page and feature to refine the details, ensuring consistency in design and functionality.

Given Your Timeline:
With a week left, it's important to prioritize. First, address any critical functional issues or bugs.
Next, focus on user interface improvements and content population.
Allocate time for final testing and adjustments based on feedback.
Suggestion:
Create a detailed checklist of pending tasks and prioritize them based on importance and the time required.
If certain features are not critical for launch, consider implementing them in a future update to ensure you meet your deadline with a robust and functional core website.

# To-Do List for Monday:
1. Review Current Progress:

Quickly go over the work you've completed so far to refresh your memory.
Check any pending pull requests or issues if you're using version control like Git.

2. Home.js - Featured Vendors Section:

Implement functionality to allow an admin to select and feature specific vendors.
Ensure this section dynamically updates based on the admin's selection.\

***DONE***

3. Vendor.js - Admin Editing Capability:

Modify the Vendor profile editing functionality to allow admins to edit other vendors' profiles.
Test the feature to ensure it works seamlessly and securely.

***DONE***

4. Finalize Event Management:

Review the event adding, editing, and deleting functionalities.
Ensure all event-related features are fully functional and bug-free.

***DONE***

5. Review User Role Management:

Double-check that all role-based functionalities (like editing blogs, FAQs, etc.) are working correctly.
Ensure that unauthorized users can't access or perform admin/vendor-specific operations.

***DONE***

6. Start Responsive Design Implementation:

Begin making your website mobile-friendly if not already done.
Focus on key pages like Home.js and Vendor.js initially.

*not done, but started*

7. Prepare a Testing Plan:

Outline a plan for thorough testing of the website, including functional and responsive design testing.

***DONE***

8. Set Aside Time for Bug Fixes:

Allocate a specific time slot to address any bugs or issues you might encounter.

***DONE*** BUT there's always more bugs somewhere!

9. Document Any New Features or Changes:

Update your project documentation to reflect any new features or significant changes made.

***Working on interactive map, will probably drop because time constraints and general fustration converting an excel map with roughly 500 plus cells into an interactive map with CSS styling and functionality to tell if it's open or not... That and the deadline is by Sunday and this is mainly a bonus feature.

# To-Do List for Thurday-Friday:

5:47 PM
Wednesday, January 17, 2024 (CST)

Working on Thursday, but I can begin CSS. Site is functional and testing is alomst complete. I still need to set up Vendor links to their facebook, website, and embedding images on the VendorPage. This was a large project for a single person to knock out in two weeks, but I'm proud of it!

Need to have images resized!