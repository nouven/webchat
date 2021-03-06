const socket = io();
const initTag = new InitTag();
const show_rooms = document.querySelector("#show_rooms");
const show_messages = document.querySelector("#show_messages");
const show_friends = document.querySelector("#show_friends");

//typing_mess
const form_typing_mess = document.querySelector("#form_typing_mess");
//typing_search_user
const search_user = document.querySelector("#search_user");
const search_user_result = document.querySelector("#search_user_result");
//modal_body_create_room
const input_create_room = document.querySelector("#input_create_room");
const btn_create_room = document.querySelector("#btn_create_room");
//modal_friend_reqs
const friend_reqs = document.querySelector("#friend_reqs");
const length_of_req = document.querySelector("#length_of_req");
//modal_add_member
const search_friend = document.querySelector("#search_friend");
const search_friend_result = document.querySelector("#search_friend_result");
const modal_add_member = document.querySelector(".modal_add_member");

//
const show_info = document.querySelector("#show_info");
const chat_header = document.querySelector("#chat_header");
const chat_header_right = document.querySelector("#chat_header_right");

const btn_show_members = document.querySelector("#btn_show_members");
const show_members = document.querySelector("#show_members");

//logout
$("#logout").click(() => {
  document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.reload();
});
// show_curr_room.style.display = 'none';
chat_header_right.style.display = "none";
form_typing_mess.style.display = "none";

const info = {
  _id: JSON.parse(user_id.value),
  friend_id: "",
  name: "",
  avatar: "",
  curRoom: "",
  befRoom: "",
  countUnseenMess:0,
  block: 0,
  unit: 16, 
};
show_messages.addEventListener('scroll',()=>{
    let scrollTop =  -parseInt(show_messages.scrollTop);
    if(scrollTop >= (((info.block+1)* 719) + ((info.unit-16) *67))){
      chat_header.querySelector('#loader').style.display ='block';
      setTimeout(()=>{
        chat_header.querySelector('#loader').style.display ='none';
      },1000)
      socket.emit('loadMore',{
          curRoom: info.curRoom,
          block: info.block,
          unit: info.unit
      })
      info.block++;
    }
})

//init
socket.emit("init", info._id);
//obj{info};
socket.on("initInfo", (obj) => {
  initTag.info(socket, info, show_info, obj);
});
//obj{room}
socket.on("initRoom", (obj) => {
  initTag.room(socket, info, show_rooms, obj);
});
//obj{message};
socket.on("initMess", (obj) => {
  initTag.mess(socket, info, obj, show_messages);
});
//obj{id, name, avatar} of friend
socket.on("initFriend", (obj) => {
  initTag.friend(socket, info, show_friends, obj);
});
//obj{name, avatar, _id} of user
socket.on("initSearchUserResult", (obj) => {
  while (search_user_result.firstChild) {
    search_user_result.removeChild(search_user_result.firstChild);
  }
  initTag.userSearchResult(socket, info, search_user_result, obj);
});
//obj{name, avatar, _id} of user
socket.on("initSearchFriendResult", (obj) => {
  while (search_friend_result.firstChild) {
    search_friend_result.removeChild(search_friend_result.firstChild);
  }
  initTag.friendSearchResult(socket, info, search_friend_result, obj);
});
socket.on("lengthOfReq", (data) => {
  length_of_req.innerHTML = data;
});
socket.on("initFriendReq", (obj) => {
  initTag.friendReq(socket, info, friend_reqs, obj);
});
//friend status{online-offline};
socket.on("online_status", (obj) => {
  if (obj._id_2 === info._id) {
    const friend_status =show_friends.querySelector(`#f${obj._id_1}`);
    friend_status.setAttribute("style", "background: rgb(49, 162, 76)");
    friend_status.firstElementChild.innerHTML="Active Now";
    friend_status.lastElementChild.value = 0;
    socket.emit("online_status_2", obj);
  }
});
socket.on("online_status_2", (obj) => {
  if (obj._id_2 === info._id) {
    const friend_status =show_friends.querySelector(`#f${obj._id_1}`);
    friend_status.setAttribute("style", "background: rgb(49, 162, 76)");
    friend_status.firstElementChild.innerHTML="Active Now";
    friend_status.lastElementChild.value = 0;
  }
});
socket.on("offline_status", (obj) => {
  if (obj._id_2 === info._id) {
    const friend_status = show_friends.querySelector(`#f${obj._id_1}`);
    friend_status.setAttribute("style", "background: #bcc0c4");
    friend_status.firstElementChild.innerHTML="Just Now";
    friend_status.lastElementChild.value = obj.lastTime;
  }
});
//show member of room
btn_show_members.addEventListener("click", () => {
  while (show_members.firstChild) {
    show_members.removeChild(show_members.firstChild);
  }
  socket.emit("show_member", {
    curRoom: info.curRoom,
  });
});
socket.on("show_member", (obj) => {
  initTag.showMember(socket, info, show_members, obj);
});

//obj{curRoom, _id, unSeenMess}
socket.on("updateUnSeenMess", (obj) => {
  if (obj._id === info._id) {
    if(document.querySelector(`#r${obj.curRoom}`).querySelector('.last_mess')){
      document.querySelector(`#r${obj.curRoom}`).querySelector('.last_mess').innerHTML =    
        `${obj.lastMess[0].name.slice(0,6)}: ${obj.lastMess[0].content.slice(0,9)} ...`;
    };
    if (obj.curRoom != info.curRoom) {
      if (obj.unSeenMess != 0) {
        document.querySelector(`#r${obj.curRoom}`).firstElementChild.innerHTML = obj.unSeenMess;
        ++info.countUnseenMess;
        document.querySelector('#title').innerHTML= `(${info.countUnseenMess}) WebChat`
      }
    }else {
      document.querySelector(`#r${obj.curRoom}`).firstElementChild.innerHTML = "";
      socket.emit("updateUnSeenMess", {
        curRoom: obj.curRoom,
        _id: info._id,
      });
      ++info.unit;
    }
    if(obj.lastMess[0]._id != info._id){
      if(Notification.permission === "granted"){
        const title = `${obj.lastMess[0].name}: ${obj.lastMess[0].content}`;
        new Notification(title,{
          icon: './logowebchat.jpg'
        });
      }
    }
  }
});
//
//accep_friend_req
const typing = document.querySelector("#typing");
// typing_mess-submit;
// visibility: visible
//<<==============================>
const inputTextField = form_typing_mess.querySelector("input");
form_typing_mess.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputText = form_typing_mess.querySelector("input").value.trim();
  form_typing_mess.querySelector("input").value = "";
  if (inputText) {
    socket.emit("typing_mess-submit", {
      _id: info._id,
      name: info.name,
      avatar: info.avatar,
      content: inputText,
      curRoom: info.curRoom,
    });
  }
});
inputTextField.addEventListener("keydown", (e) => {
  socket.emit("typing_mess-keyup", {
    curRoom: info.curRoom,
  });
});
socket.on("typing", (obj) => {
  typing.style.display = "flex";
  setTimeout(() => {
    typing.style.display = "none";
  }, 2000);
});
// MAKE FRIEND<<====================================>
//search_user-onkey
search_user.addEventListener("keyup", (e) => {
  //remove all childNode
  while (search_user_result.firstChild) {
    search_user_result.removeChild(search_user_result.firstChild);
  }

  const result = search_user.value.toLowerCase();
  if (result) {
    socket.emit("search_user", {
      result: result,
      _id: info._id,
    });
  }
});
//friend_req
socket.on("friendReqTrue", (obj) => {
  if (obj.receiver === info._id) {
    socket.emit("friendReqTrue", obj);
  }
});
socket.on("acceptFriendReqTrue", (obj) => {
  if (obj.data === info._id) {
    socket.emit("acceptFriendReqTrue", obj);
  }
});

//CREATE ROOM <====================================================>
//modal_create_room
btn_create_room.addEventListener("click", () => {
  let input = input_create_room.value.trim();
  input_create_room.value = "";
  if (input != "") {
    socket.emit("create_room", {
      name: input,
      user: info._id,
    });
  }
});

//add friend into room<===========================================>
//search_friend-onkey
search_friend.addEventListener("keyup", (e) => {
  //remove all childNode
  while (search_friend_result.firstChild) {
    search_friend_result.removeChild(search_friend_result.firstChild);
  }

  const result = search_friend.value.toLowerCase();
  if (result) {
    socket.emit("search_friend", {
      curRoom: info.curRoom,
      result: result,
      _id: info._id,
    });
  }
});
//obj{curRoom, _id}
socket.on("add_to_room_true", (obj) => {
  if (obj._id === info._id) {
    socket.emit("add_to_room_true", obj);
  }
});
//video call
var peer = new Peer({
  key: "peerjs",
  host: "peerserverwebchat.herokuapp.com",
  secure: true,
  port: 443,
});
peer.on("open", (id) => {
  socket.emit("initPeer", {
    userId: info._id,
    peerId: id,
  });
});
$("#btn_video_call").click(() => {
  socket.emit("calling", {
    userId: info._id,
    friendId: info.friend_id,
  });
});
socket.on("calling", (peerId) => {
  const id = peerId.peerId;
  openStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) => {
      playStream("remoteStream", remoteStream);
    });
  });
});
//answer
socket.on("answerCall", (obj) => {
  if (obj._id === info._id) {
    $("#answer_call_header").empty();
    const newTag = document.createElement("div");
    newTag.classList.add("friendrqs");
    newTag.innerHTML = `
                    <div class="chat-bubble-calling"  >
                      <div class="typing" >
                        <div class="typing-name">
                           <div> <img src=${obj.avatar} class="avatar" /> </div>
                           <div class="videocall-info"> 
                           <div class="callname"> ${obj.name} is calling </div>
                           </div>
                        </div>
                        <div class="dot-wrap">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        </div>
                      </div>
                    </div>

            `;
    $("#answer_call_header").append(newTag);
    $("#answer_call").modal("show");
  }
});
$("#btn_deny_the_call").click(() => {
  $("#answer_call").modal("hide");
});
peer.on("call", (call) => {
  $("#btn_accept_the_call").click(() => {
    $("#answer_call").modal("hide");
    openStream().then((stream) => {
      call.answer(stream);
      playStream("localStream", stream);
      call.on("stream", (remoteStream) => {
        playStream("remoteStream", remoteStream);
      });
    });
  });
});
$("#destroy_video_call").click(() => {
  stopStreamedVideo('localStream');
  stopStreamedVideo('remoteStream');
});


function openStream() {
  const config = { audio: true, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;

  var playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise
      .then((_) => {
        // Automatic playback started!
        // Show playing UI.
      })
      .catch((error) => {
        // Auto-play was prevented
        // Show paused UI.
      });
  }
}
function stopStreamedVideo(videoElem) {
  const video= document.getElementById(videoElem);
  const stream = video.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });

  video.srcObject = null;
}

// $('#btn_video_call').click(()=>{
// $('#modal_video_call').modal('show');
// })

setTimeout(()=>{
  if(info.countUnseenMess != 0){
    document.querySelector('#title').innerHTML= `(${info.countUnseenMess}) WebChat`
  }else{
    document.querySelector('#title').innerHTML= ` WebChat`
  }
},1000)
setInterval(()=>{
  document.querySelector('#title').innerHTML= ` WebChat`
  if(info.countUnseenMess !=0){
      setTimeout(()=>{
        document.querySelector('#title').innerHTML= `(${info.countUnseenMess}) WebChat`
      },1500)
  }
},3000);

setTimeout(()=>{
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {});
  }},2000)