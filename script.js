const firebaseConfig = {
  apiKey: "AIzaSyDxEBhRKMLIjlkCRulYgLGCH-HLEn5XX_M",
  authDomain: "chat-room-145d6.firebaseapp.com",
  databaseURL: "https://chat-room-145d6-default-rtdb.firebaseio.com",
  projectId: "chat-room-145d6",
  storageBucket: "chat-room-145d6.appspot.com",
  messagingSenderId: "988840498256",
  appId: "1:988840498256:web:88f63ee4f8a725c7472d55",
  measurementId: "G-1Y488ZZZG3",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

firebase.auth().onAuthStateChanged((user) => {
  const loggedInContent = document.getElementById("logged-in-content");
  const loggedOutContent = document.getElementById("logged-out-content");

  if (user) {
    loggedInContent.classList.remove("hidden");
    loggedOutContent.classList.add("hidden");
  } else {
    loggedInContent.classList.add("hidden");
    loggedOutContent.classList.remove("hidden");
  }
});

document.getElementById("loginButton").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
    })
    .catch((error) => {
      document.getElementById("authError").textContent = error.message;
    });
});

document.getElementById("signupButton").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      document.getElementById("authError").textContent = error.message;
    });
});

document.getElementById("logoutButton").addEventListener("click", () => {
  firebase.auth().signOut();
});

const appState = {
  currentRoomID: null,
};

const roomsRef = db.ref("rooms");

roomsRef.on("value", (snapshot) => {
  const roomsData = snapshot.val();
  if (roomsData) {
    const rooms = Object.keys(roomsData);
    displayRooms(rooms);
  }
});

const displayRooms = (rooms) => {
  console.log(rooms);
  const roomsList = document.getElementById("joinable-rooms");
  rooms.forEach((room) => {
    const roomElement = document.createElement("p");
    roomElement.textContent = room;
    roomElement.addEventListener("click", () => {
      joinRoom(room);
      console.log(room);
    });
    roomsList.appendChild(roomElement);
  });
};

const checkRoom = () => {
  const roomID = document.getElementById("room-id").value.trim();
  const roomRef = db.ref("rooms/" + roomID);
  db.ref("rooms")
    .once("value")
    .then((snapshot) => {
      console.log(Object.keys(snapshot.val()));
    });
  roomRef.once("value").then((snapshot) => {
    if (snapshot.exists()) {
      document.getElementById(
        "room-status"
      ).textContent = `You are now in room ${roomID}`;
      joinRoom(roomID);
    } else {
      document.getElementById("room-status").textContent = "Room not found!";
    }
  });
};

const joinRoom = (roomID) => {
  appState.currentRoomID = roomID;
  document.getElementById("homepage").classList.add("hidden");
  const roomRef = db.ref("rooms/" + roomID);
  document.getElementById("room-display").classList.remove("hidden");
  document.getElementById(
    "room-header"
  ).textContent = `Welcome to Room ${roomID}`;
  const messagesRef = db.ref("rooms/" + roomID + "/messages");
  messagesRef.on("child_added", (snapshot) => {
    console.log(snapshot.val());
    const messageData = snapshot.val();
    displayMessage(messageData);
  });
};

const displayMessage = (messageData) => {
  const chatWindow = document.getElementById("room-messages");
  const messageElement = document.createElement("p");
  const date = new Date(messageData.timestamp);
  const timeString = date.toLocaleTimeString();

  messageElement.textContent = `${timeString} - ${
    firebase.auth().currentUser.email
  } - ${messageData.message}`;
  chatWindow.appendChild(messageElement);
};

const generateID = () => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createRoom = () => {
  const roomID = generateID();
  const roomRef = db.ref("rooms/" + roomID);
  roomRef
    .set({
      messages: {
        message: "No messages yet",
      },
    })
    .then(() => {
      console.log("Room has been created!");
    })
    .catch((error) => {
      console.error();
    });
};

const sendMessage = () => {
  const messageRef = db.ref("rooms/" + appState.currentRoomID + "/messages");
  const message = document.getElementById("message-input").value.trim();
  console.log("firebae", firebase.auth());
  messageRef.push({
    user: firebase.auth().currentUser.email,
    message: message,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  });
  document.getElementById("message-input").value = "";
};
