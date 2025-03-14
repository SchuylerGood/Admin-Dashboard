# Admin Dashboard
 
## How to run the app
1. Clone the repository
2. 'cd colonist-admin-dashboard'
3. Run `npm install`
4. Run `npm start`
5. Scan the QR code with the Expo Go app on your phone or press `w` to open the app in the browser.

## How to run in Expo Snack
go to: https://snack.expo.dev/AlYt9aSAVUUntUrg63S-o

fallback:

1. Go to https://snack.expo.dev/
2. Click on the three dots button next to projects on the left sidebar.
3. Click on `Import git repository`
4. Enter the repository URL `https://github.com/SchuylerGood/Admin-Dashboard`
5. Click on the `Show advanced options` button
6. For `folder path` enter `colonist-admin-dashboard`
7. For `branch name` enter `main`
8. Click on the `Import repository` button
9. Run the app on the right side bar, under `web`


## Required Features Implemented
| Required Feature | How it was implemented |
| ---------------- | --------------------- |
| Fetch and display users | Fetched users from the API and displayed them in a list. |
| Pagination with 20 users per page | Implemented pagination with 20 users per page, when the user scrolls to the bottom of the list, the next 20 users are fetched. |
| Add note to user | Add note button on each user card, when clicked, a modal appears with a text input and a save button. This saves the note for this session, and you can then click a show note button on the card to view or edit the note. |
| Sort users by date | Sort users based on ascending or descending order. |
| Filter users by country | Filter users by country using a dropdown with dynamic options based on the users in the list, also has All countries option. |

### Copy user to clipboard
Added a button that copies the user @username to the clipboard for easy user management.

**Reasoning:** This enhances the admins ability to manage users by allowing them to copy the user @username to the clipboard to other applications etc.

### Loading state
Added a loading state to the list of users, and a loading indicator to the bottom of the list.

**Reasoning:** This enhances the user experience by providing a loading state to the list of users, so if there is a long response time from the API, the user is not left wondering if the app is frozen.

### Username search bar
Added a search bar that filters users by username.

**Reasoning:** This enhances the user experience by providing a way to search for a specific user by username.

## Best Practices I should have implemented given more time
- Add unit tests
- Add error handling
- Add the API url into an env file