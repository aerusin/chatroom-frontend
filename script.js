// Fetch chatrooms from the backend
function fetchChatrooms() {
    fetch('http://localhost:3000/chatrooms')
    .then(response => response.json())
    .then(data => {
        const chatroomList = document.getElementById('chatroom-list');
        chatroomList.innerHTML = '';  // Clear previous list
        data.forEach(chatroom => {
            const listItem = document.createElement('li');
            listItem.textContent = chatroom.name;
            chatroomList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error fetching chatrooms:", error);
    });
}

// Call the function when the page loads
window.onload = fetchChatrooms;
