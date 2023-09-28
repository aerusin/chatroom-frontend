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
      document.getElementById("homepage").classList.add("hidden");
      joinRoom(roomID);
    } else {
      document.getElementById("room-status").textContent = "Room not found!";
    }
  });
};

const joinRoom = (roomID) => {};

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
