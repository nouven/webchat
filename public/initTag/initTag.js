class InitTag {
  room(socket, info, parTag, obj) {
    const newTag = document.createElement("a");
    newTag.classList.add("sidebarChat-link");
    newTag.setAttribute("href", `#${obj._id}`);
    if (obj.unSeenMess == 0) {
      newTag.innerHTML = `
          <div class="sidebarChat">
          <div style:"position: relative">
            <img
              src=${obj.avatar}
              alt="Avatar" class="avatar" />
              <div id="r${obj._id}" style="color:white;background-color: red; border-radius: 40% ; text-align:center; min-width: 20px;max-height: 20px; font-size: 12px;position: absolute;transform: translate(29px, -40px);font-weight: 1000; ">
              </div>
          </div>
            <div class="sidebarChat__info">
              <h2 class="sidebarChat__info-name">${obj.name}</h2>
              <p>Last Message</p>
            </div>
          </div>`;
    } else {
      newTag.innerHTML = `
          <div class="sidebarChat">
          <div style:"position: relative">
            <img
              src=${obj.avatar}
              alt="Avatar" class="avatar" />
              <div id="r${obj._id}" style="color:white;background-color: red; border-radius: 40% ; text-align:center; min-width: 20px;max-height: 20px; font-size: 12px;position: absolute;transform: translate(29px, -40px);font-weight: 1000; ">
              ${obj.unSeenMess}
              </div>
          </div>
            <div class="sidebarChat__info">
              <h2 class="sidebarChat__info-name">${obj.name}</h2>
              <p>Last Message</p>
            </div>
          </div>`;
    }
    parTag.appendChild(newTag);
    //onclick
    newTag.addEventListener("click", (e) => {
      modal_add_member.setAttribute("style", "visibility: visible");
      form_typing_mess.setAttribute("style", "visibility: visible");
      chat_header_right.setAttribute("style", "visibility: visible");
      //updata unSeenMess
      socket.emit("updateUnSeenMess", {
        curRoom: obj._id,
        _id: info._id,
      });
      //show current room
      info.befRoom = info.curRoom;
      info.curRoom = obj._id;
      if (info.befRoom != info.curRoom) {
        //reset show_messages
        show_messages.innerHTML = "";
        const imgTag = chat_header.querySelector("#show_curr_room_img");
        const nameTag = chat_header.querySelector("#show_curr_room_name");
        imgTag.setAttribute("src", `${obj.avatar}`);
        nameTag.innerHTML = obj.name;
        //show old message
        socket.emit("onclick_room", info);
      }
    });
  }

  //obj(id, name, avatar) of friend
  friend(socket, info, parTag, obj) {
    const newTag = document.createElement("li");
    newTag.classList.add("friend__items");
    if (obj.unSeenMess == 0) {
      newTag.innerHTML = `
              <div class= "friend__status-wrap">
                <div id="r${obj.room_id}" class="friend__status__unSeenMess">
                </div>
                <img src=${obj.avatar}  alt="Avatar" class="avatar" />
                <div class="friend__status" id="f${obj._id}"></div> 
              </div>
               <div class="sidebarChat__info">
                <h2 class="sidebarChat__info-name">${obj.name}</h2>
               </div>
      `;
    } else {
      newTag.innerHTML = `
              <div class= "friend__status-wrap">
                <div id="r${obj.room_id}" class="friend__status__unSeenMess">
                ${obj.unSeenMess}
                </div>
                <img src=${obj.avatar}  alt="Avatar" class="avatar" />
                <div class="friend__status" id="f${obj._id}"></div> 
              </div>
               <div class="sidebarChat__info">
                <h2 class="sidebarChat__info-name">${obj.name}</h2>
               </div>
      `;
    }
    parTag.appendChild(newTag);
    newTag.addEventListener("click", (e) => {
      modal_add_member.style.display = "none";
      form_typing_mess.setAttribute("style", "visibility: visible");
      chat_header_right.setAttribute("style", "visibility: visible");
      socket.emit("updateUnSeenMess", {
        curRoom: obj.room_id,
        _id: info._id,
      });
      //reset show_messages
      info.befRoom = info.curRoom;
      info.curRoom = obj.room_id;
      if (info.befRoom != info.curRoom) {
        //reset show_messages
        show_messages.innerHTML = "";
        const imgTag = chat_header.querySelector("#show_curr_room_img");
        const nameTag = chat_header.querySelector("#show_curr_room_name");
        imgTag.setAttribute("src", `${obj.avatar}`);
        nameTag.innerHTML = obj.name;
        //show old message
        socket.emit("onclick_room", info);
      }
    });
  }
  //obj{info}
  info(socket, info, parTag, obj) {
    info.name = obj.name;
    info.avatar = obj.avatar;
    const newTag = document.createElement("div");
    // newTag.classList.add("sidebar__header-wrap");
    newTag.classList.add("sidebar__headerLeft");
    newTag.innerHTML = `
              <img src=${obj.avatar} alt="Avatar" class="avatar" />
              <span class="sidebar__header-userName">${obj.name}</span>
        `;
    parTag.insertBefore(newTag, parTag.children[0]);
  }
  //obj{message};
  //     _id: String,
  //     name: String,
  //     content: String,
  mess(socket, info, obj, parTag) {
    const newTag = document.createElement("p");
    newTag.classList.add("chat__sender");
    if (obj._id != info._id) {
      newTag.innerHTML = `
          <div class="messages">
            <div class="messages__avt">
              <img src=${obj.avatar} class="avatar_onchat" />
            </div>
            <span class="chat__name">${obj.name}</span>
            <div class="messages__content">
            <div class="content__sender">
              ${obj.content}<br>
              <span class="chat__time">${obj.createdAt}</span>
            </div>
            </div>
          </div>
        `;
    } else {
      newTag.classList.add("chat__receiver");
      newTag.innerHTML = `
        <div class="messages">
          <div>
            <div class="content">
              ${obj.content}<br>
              <span class="chat__time">${obj.createdAt}</span>
            </div>
          </div>
        </div>
        `;
    }
    newTag.querySelector(".chat__time").style.display = "none";
    newTag.addEventListener("mouseover", (e) => {
      newTag.querySelector(".chat__time").style.display = "block";
    });
    newTag.addEventListener("mouseout", (e) => {
      newTag.querySelector(".chat__time").style.display = "none";
    });
    parTag.insertBefore(newTag, parTag.children[0]);
  }
  //obj{name, avatar} of user,
  userSearchResult(socket, info, parTag, obj) {
    const newTag = document.createElement("div");
    newTag.setAttribute("class", "dropdown-item");
    newTag.classList.add("edit__dropdown");
    newTag.innerHTML = `
    <div class="user__info">
    <img src=${obj.avatar} class="avatar_onchat" />
        ${obj.name}
        </div>
        <div>
          <button type="button" class="btn btn-success edit__btn">add</button>
        </div>
      `;
    parTag.appendChild(newTag);
    const addFriendBtn = newTag.querySelector("button");
    addFriendBtn.addEventListener("click", (e) => {
      socket.emit("friendReq", {
        sender: info._id,
        receiver: obj._id,
      });
    });
  }

  friendSearchResult(socket, info, parTag, obj) {
    const newTag = document.createElement("a");
    newTag.setAttribute("class", "dropdown-item");
    newTag.classList.add("edit__dropdown");
    newTag.innerHTML = `
    <div class="user__info">
    <img src=${obj.avatar} class="avatar_onchat" />
        ${obj.name}
        </div>
        <button type="button" class="btn btn-success edit__btn">add</button>
      `;
    parTag.appendChild(newTag);
    const addBtn = newTag.querySelector(".btn-success");
    addBtn.addEventListener("click", (e) => {
      newTag.style.display = "none";
      socket.emit("add_to_room", {
        curRoom: info.curRoom,
        _id: obj._id,
      });
    });
  }
  //obj{id,name, avatar};
  friendReq(socket, info, parTag, obj) {
    const newTag = document.createElement("div");
    newTag.classList.add("friendrqs");
    newTag.innerHTML = `
      <div class = "friendrqs__info">
        <img src=${obj.avatar} class="avatar" />
        <span style="font-size: 20px;margin-left: 6px;">
          ${obj.name}
        </span>
      </div>
        <div class="friendrqs__btn">
          <button type="button" class="btn btn-danger edit__btn">Delete</button>
          <button type="button" class="btn btn-success edit__btn">Accept</button>
        </div>
    `;
    parTag.appendChild(newTag);
    const delete_btn = newTag.querySelector(".btn-danger");
    const accept_btn = newTag.querySelector(".btn-success");
    delete_btn.addEventListener("click", (e) => {
      newTag.style.display = "none";
      socket.emit("deleteFriendReq", {
        _id: info._id,
        data: obj._id,
      });
    });
    accept_btn.addEventListener("click", (e) => {
      newTag.style.display = "none";
      socket.emit("acceptFriendReq", {
        _id: info._id,
        data: obj._id,
      });
    });
  }
}
