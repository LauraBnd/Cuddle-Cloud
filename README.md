<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="scholarly.css">
    <title>Documentation</title>
</head>
<body>
  <h1>Cuddle Cloud Childcare Manager Software Requirements Specification</h1>
  <h2>Abstract</h2>
    <p><a href="#introduction" class="links">1. Introduction</a></p>
      <ul style="list-style-type: none;">
      <li><a href="#scope" class="links">1.1 Product Scope</a></li>
      <li><a href="#references" class="links">1.2 References</a></li>
      </ul>
      <p><a href="#overall-description" class="links">2. Overall Description</a></p>
      <ul style="list-style-type: none;">
        <li><a href="#description" class="links">2.1 Product Functions</a></li>
        <li><a href="#classes" class="links">2.2 User Classes and Characteristics</a></li>
        <li><a href="#Environment" class="links">2.3 Operating Environment</a></li>
        </ul>
      <p><a href="#interfaces" class="links">3. User Interfaces</a></p>
      <p><a href="#system" class="links">4. System Features</a></p>
      <ul style="list-style-type: none;">
        <li><a href="#pre" class="links">4.1 Pre-Authentication</a></li>
        <li><a href="#auth" class="links">4.2 Authentication</a></li>
        <li><a href="#forgot" class="links">4.3 Forgot Password</a></li>
        <li><a href="#admin" class="links">4.4 Administrator Page</a></li>
        <li><a href="#prof" class="links">4.5 Profile</a></li>
        <li><a href="#sch" class="links">4.6 Schedules </a></li>
        <li><a href="#med" class="links">4.7 Medical History</a></li>
        <li><a href="#gall" class="links">4.8 Photo Gallery</a></li>
        <li><a href="#fr" class="links">4.9 Friends</a></li>
        <li><a href="#new" class="links">4.10 News Feed</a></li>
        <li><a href="#uni" class="links">4.11 Universal feature</a></li>
        </ul>

  <h2 id="introduction">1. Introduction</h2>
  <h3 id="scope">1.1 Product Scope</h3>
  <div>Cuddle Cloud is a comprehensive web application designed to facilitate the management of resources related to child care for families and couples. It offers a centralized platform for tracking various aspects of a child's development:</div>
  <ol type="1">
    <li><strong>Feeding and Sleep Schedule Management:</strong> Users can easily record and track their child's feeding and sleep schedules, helping to establish routines and identify patterns.</li>
    <li><strong>Multimedia Resource Storage:</strong> Cuddle Cloud allows users to upload and store photos, videos, audio recordings, and other multimedia resources capturing memorable moments and milestones in their child's development.</li>
    <li><strong>Medical History Tracking:</strong> The application enables users to maintain a comprehensive record of their child's medical history, including vaccinations, illnesses, and growth milestones.</li>
    <li><strong>Social Relationship Management:</strong> Users can document and track their child's interactions with other children, such as cousins, classmates and friends, fostering a sense of community and social integration.</li>
    <li><strong>Chronological Timeline:</strong> FamilyCare Connect presents a chronological view of the most significant moments and events in a child's life, providing users with a visually appealing and organized overview of their child's journey.</li>
    <li><strong>Sharing Capabilities:</strong> Users can share the most significant moments captured within the application with friends and family via social media platforms or RSS news feeds, fostering connections and promoting engagement.</li>
  </ol>
  <h3 id="references">1.2 References</h3>
  <div>
    <ol type="1">
      <li><a href="https://gencraft.com/generate">Logo generator</a></li>
      <li><a href="https://www.youtube.com/watch?v=p1GmFCGuVjw&t=957s">Youtube Tutorial for navbar and Login form</a></li>
      <li><a href="https://www.youtube.com/watch?v=jCnldI4uIDE&t=2s">Youtube Tutorial for two forms next to each other</a></li>
      <li><a href="https://www.w3schools.com/howto/howto_css_portfolio_gallery.asp">Portofoliu</a></li>

    </ol>
  </div>
  <h2 id="overall-description">2. Overall Description</h2>
  <h3 id="description">2.1 Product Functions</h3>
  <div>
    <p><strong>1. User Authentication and Authorization:</strong><p>
    <ul style="list-style-type:disc;">
      <li>Allow users to register and log in.</li>
      <li>Implement role-based access control to ensure appropriate access levels for different users.</li>
    </ul>
    <p><strong>2. Child Profile Management:</strong></p>
    <ul style="list-style-type: disc;">
    <li>Enable users to create and manage profiles for their child, including basic information, medical records and social relationships.</li></ul>
    <p><strong>3. Feeding and Sleep Schedule Tracking:</strong></p>
    <ul style="list-style-type: disc;">
      <li>Provide functionality for users to record and monitor feeding and sleep schedules for their child.</li>
      <li>Allow users to view historical data and analyze patterns in feeding and sleep habits.</li>
    </ul>
    <p><strong>4. Multimedia Resource Storage:</strong></p>
    <ul style="list-style-type:disc">
    <li>Allow users to upload, store, and organize photos, videos, audio recordings and other multimedia resources related to their child's development.</li>
  </ul>
  <p><strong>5. Chronological Timeline View:</strong></p>
    <ul style="list-style-type:disc;">
      <li>Present a chronological timeline view of the most significant moments and events captured for each child.</li>
      <li>Enable users to navigate through the timeline and view details of individual events.</li>
    </ul>
    <p><strong>6. Sharing Capabilities:</strong></p>
    <ul style="list-style-type: disc;">
    <li>Implement features for users to share selected moments and milestones with friends and family via social media platforms or RSS news feeds.</li></ul>
    <p><strong>7. Social Relationship Management:</strong><p>
    <ul style="list-style-type: disc;">
      <li>Provide tools for users to manage and maintain social relationships within the application.</li>
    </ul>
  </div>
  <h3 id="classes">2.2 User Classes and Characteristics</h3>

    <p><strong>1. Primary Caregivers:</strong></p>
    <ul style="list-style-type:disc;">
      <li><strong>Characteristics:</strong> Primary caregivers, such as parents or guardians, who are directly responsible for the day-to-day care of the child.</li>
      <li><strong>Frequency of Use:</strong> High, as they will interact with the application regularly to manage various aspects of child care.</li>
      <li><strong>Subset of Product Functions:</strong> Access to all features of the application, including child profile management, scheduling, multimedia storage, and social relationship management.</li>
      <li><strong>Technical Expertise:</strong> Varied, ranging from novice users to those comfortable with technology.</li>
      <li><strong>Security or Privilege Levels:</strong> Full access to all features and information related to their child's care.</li>
      <li><strong>Educational Level or Experience:</strong> Varied, but typically possess basic to intermediate computer literacy skills.</li>
    </ul>
    <p><strong>2. Unauthenticated Users:</strong></p>
    <ul style="list-style-type:disc;">
      <li><strong>Characteristics:</strong> People who access the website for the first time or who don't want to create an account.</li>
      <li><strong>Frequency of Use:</strong>Low, as they cannot access the program's functions and can only view certain pages. </li>
      <li><strong>Subset of Product Functions:</strong> Access to description about the website, it's services and contact information.</li>
      <li><strong>Technical Expertise:</strong> Varied, ranging from novice users to those comfortable with technology.</li>
      <li><strong>Security or Privilege Levels:</strong> Reduced access to features.</li>
      <li><strong>Educational Level or Experience:</strong> Varied, but typically possess basic to intermediate computer literacy skills.</li>
    </ul>
    <p><strong>3. Administrator:</strong></p>
    <ul style="list-style-type: disc;">
      <li><strong>Characteristics:</strong> Administrators are responsible for managing the overall operation and maintenance of the FamilyCare Connect application.</li>
      <li><strong>Frequency of Use:</strong> Moderate, typically involved in system setup, user management, and addressing technical issues.</li>
      <li><strong>Subset of Product Functions:</strong>Access to administrative features such as user management, system configuration, and troubleshooting tools.</li>
      <li><strong>Technical Expertise:</strong> High, with proficiency in system administration and troubleshooting.</li>
      <li><strong>Security or Privilege Levels:</strong> Highest level of access, with privileges to manage all aspects of the application, including user accounts and system settings.</li>
      <li><strong>Educational Level or Experience:</strong> High level of technical expertise and experience in system administration and software management.</li>
    </ul>
    <h3 id="Environment">2.3 Operating Environment</h3>
    <ul style="list-style-type: disc;">
    <li>PHP</li>
    <li>JavaScript</li>
    <li>MySql</li>
    </ul>
    <h2 id="interfaces">3. User Interfaces</h2>
    <div>
      <img src="image/435716422_1383938952257210_1307534988191005796_n.jpg" alt="signup" style="width:30%">
      <img src="image/435839906_432681856108016_2501675966333852418_n.jpg" alt="service" style="width:30%">
      <img src="image/435866099_2291037544434237_4292032989379291306_n.jpg" alt="login" style="width:30%">
      <img src="image/436313957_1204464803848652_7202023773948660693_n.jpg" alt="home" style="width:30%">
      <img src="image/436805701_1164520844973593_8810712353433486695_n.jpg" alt="contact" style="width:30%">
      <img src="image/436805706_926703659248943_1504558874547141726_n.jpg" alt="profile" style="width:30%">
    </div>
    <div>
      <p>The images above are the first ideas for the interface of the website. From the beginning the color pallette was light purple and light yellow</p>
      <p>The login and sign up forms are in the middle of the page over a colorful background.</p>
      <p>The profile page has a tab on the left. Instead of two different tabs for feeding and sleeping schedules we decided to make a universal one, where the user can add them both and also any other activity like activities or school.</p>
      <p>The medical page has a form for the user to introduce data about sicknesses and on the right of that the inputs are shown in little colored boxes. There is a "Show Medical Files" with which the user may see the previous ones in chronological order.</p>
      <p>The friends tab shows the profile of other children, a button to search for a user and one to view your own friendship code.</p>
      <p>The News Feed was added after the initial planning. There the photos and videos are shown one below the other with two buttons to add photos and videos and to add captions.</p>
      <p>The gallery was first put inside the profile next to the description. Ultimately it was made its own tab where the  user can view all photos, add some and post them on other social media platforms.</p>

    </div>
    <h2 id="system">4. System Features</h2>
    <p id="pre"><strong>1. Pre-Authentication:</strong></p>
    <p>Multiple pages showcasing a short description of the website, services and contact info.</p>
    <p id="auth"><strong>2. Authentication:</strong></p>
    <ul style="list-style-type: disc;"> 
    <li>A registration form that asks for inputs a username, email and a password (the password is hidden, but there is the "show password" button implemented in javascript that allows to see password). Below there are two links, one that takes the client back to the home page and the other to the login form for people with accounts. The Sign Up button takes you directly to the profile page, in the future it will create an account that will be saved in the database and create a unique page for each new client. </li>
    <li>A login form that asks for inputs the username and password ("show password" option implemented). Below there are links to redirect you back to the home page, to the sign up form and to a "Forgot password" page. The administration login is now a link that takes you to the administrator page, but it will be implement as a unique set of username and password from the database.</li>
  </ul>
  <p id="forgot"><strong>3. Forgot Password</strong></p>
  <ul style="list-style-type: disc;">
  <li>The Forgot Password page has a form that asks for username and email as inputs. Upon introducing them, the user will get a code that they will be able to use to change their password.</li>
  </ul>
    <p id="admin"><strong>4. Administrator Page</strong></p>
    <ul style="list-style-type: disc;">
      <li>The administrator page offers two options, first to freeze a user's account and the second to delete a user's photo. Right now they are implemented as two forms with the backend implementation to follow.</li>
      <li>Sign Out button that takes you back to the home page.</li>
    </ul>
    <p id="prof"><strong>5. Profile Tab</strong></p>
    <ul style="list-style-type: disc;">
    <li>The profile tab has the Sing Out button that takes you back to the home page. The profile has a tab implemented that allows the user to switch between the funtions.</li>
    <li>The profile option shows a picture of the child, as well as a small description. The site will give the user the option to enter and modify the information at any time. The age will be calculated based on the birthdate introduced by the user.</li>
    <li>A button that will give the user the option to change their info, such as username, password and email.</li>
    </ul>
    <p id="sch"><strong>6. Schedule Tab</strong></p>
    <ul style="list-style-type: disc;">
      <li>The schedule tab displays a table with the days of the week and hours, with the possibility for the user to enter and modify the program at any time. The table acts as both feeding and eating schedule, as well as any other activity that the parent decides to enter. For a nicer aspect and easier accessibility for the user, the table is split between "Day" and "Night" options implemented with two buttons. The "Day" option gives access to the table hours 10-23, and "Night" option the rest of them. When the user opens the tab, the "Day" table is opened by default for easier access. </li>
      <li>Below the table there is a form that allows to enter details about activities, with the input options being the date, the type of activity (such as nap, feeding, school, play-time...) and also details about the activity. The inputs from this form will be displayed on it's right as little blocks in chronological order.</li>
      <li>For responsiveness, the table will elongate and show the hours with the 5 input spaces for each day of the week.</li>
    </ul>
    <p id="med"><strong>7. Medical History Tab</strong></p>
    <ul style="list-style-type: disc;">
    <li>The Medical History tab displays additional info about the child, such as full name, blood type, parent's name etc. The parent's will be able to enter and modify this info at any time.</li>
    <li>Above this description section, there are 2 buttons. One that will let the parent upload medical files about the child and the second one that will redirect the user to the page with all of their uploaded files, shown in chronological order.</li>
    <li>Below the description section, there is a form where the parent can introduce information about the child's scikness, such as starting date, ending date, symptoms, treatment and any other details. The inputs from this form will be displayed in little cases on the right of the form in chronological order.</li>
    </ul>
    <p id="gall"><strong>8. Photo Gallery Tab</strong></p>
    <ul style="list-style-type: disc;">
    <li>The photo gallery has a "Post photo" button that allows the user to upload photos or video that will be shown on the page. The user will be able to choose whether they want their image to be shown smaller, next to 3 other photos on one row or bigger to cover the whole space.</li>
    <li>The photos can have titles and also captions underneath.</li>
    <li>For responsiveness purpose, the gallery will change layout based on screen type, larger screens will have two types of photos: the small ones in groups of 4 in one row and the big ones, but smaller screen will display each photo one below the other for nicer aspect.</li>
    <li>There will be 3 buttons for the user to use to post their picture on instagram, facebook or twitter. They will be given the option to upload either a file from their device or one from the photo gallery. The buttons will be displayed at the end of the tab bar, right now they are placed at the end of the page until further implementation.</li>
    </ul>
    <p id="fr"><strong>9. Friends Tab</strong></p>
    <ul style="list-style-type: disc;">
    <li>Right on the upper side of the page there are 2 popups, one that allows the user to view it's friendship code and one to search for another user, based on the friendship code. After backend implementation, the user will be able to add a friends through his code and then they will be able to view each other photos in the news feed and comment on the other's post.</li>
    <li>Below the popus, the user can see their friends and the small description that they added on their profile.</li>  
  </ul>
  <p id="new"><strong>10. News Feed</strong></p>
  <ul style="list-style-type: disc;">
    <li>On the news feed the parent will be able to see other children posts, but only if they are friends. For easier display, we added post with images and videos from accounts that are not in the friend's list for a more accessible showcase.</li>
    <li>On the news feed users will be able to view photos and videos of friends as well as their username and captions. After further implementation, they will also be able to add comments below the posts.</li>
    <li>As well as viewing posts, the users will be able to make posts of their own with photos, videos or just text, with the possibility of tagging their friends in the post.</li>
    <li>In the future, if a person tags a friend in their post, the unshared friends list of the tagged person will be able to see the post.</li> 
  </ul>
  <p id="uni"><strong>11. Universal feature</strong></p>
  <ul style="list-style-type: disc;">
    <li>The sign out button will take the user back to the home page.</li>
    <li>All pages have a colorful aspect, with different backgrounds and a shared color pallette for nicer aspect.</li>
    <li>All pages have the Cuddle Cloud logo on the left corner of the page or in the upper middle (for login, forgot password and registration pages)</li>
    <li>A fixed navbar is shown on all pages. The pre-authentification navbar has the redirection to the home, contact, services and sign in pages and the profile one has the sign out button on the navbar.</li>
  </ul>

</body>
</html>
