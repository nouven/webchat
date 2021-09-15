class InitTag {
  room(socket, info, parTag, obj) {
    const newTag = document.createElement("a");
    newTag.classList.add("sidebarChat-link");
    newTag.setAttribute("href", `#${obj._id}`);
    if (obj.unSeenMess == 0) {
      newTag.innerHTML = `
          <div class="sidebarChat">
          <div style="position: relative;">
            <img
              src=${obj.avatar}
              alt="Avatar" class="avatar inverted" />
              <div id="r${obj._id}" >
                <div class ="unseen__mess inverted">
                </div> 
                <div class="last_mess ">
                  ${obj.lastMess[0].name.slice(0,6)}: ${obj.lastMess[0].content.slice(0,9)} ...
                </div>
              </div>
          </div>
            <div class="sidebarChat__info">
              <h2 class="sidebarChat__info-name">${obj.name}</h2>
            </div>
          </div>`;
    } else {
      newTag.innerHTML = `
          <div class="sidebarChat">
          <div style="position: relative;">
            <img
              src=${obj.avatar}
              alt="Avatar" class="avatar inverted" />
              <div id="r${obj._id}" >
                <div class ="unseen__mess inverted">
                  ${obj.unSeenMess}
                </div> 
                <div class="last_mess">
                  ${obj.lastMess[0].name.slice(0,6)}: ${obj.lastMess[0].content.slice(0,9)} ...
                </div>
              </div>
          </div>
            <div class="sidebarChat__info">
              <h2 class="sidebarChat__info-name">${obj.name}</h2>
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
                <div id="r${obj.room_id}" >
                  <div class="friend__status__unSeenMess"></div>
                </div>
                <img src=${obj.avatar}  alt="Avatar" class="avatar inverted" />
                <div class="friend__status" id="f${obj._id}">
                  <div class="friend__status_time">
                  </div> 
                  <input type="number" value=${obj.lastTime} style="display:none">
                </div> 
              </div>
               <div class="sidebarChat__info">
                <h2 class="sidebarChat__info-name">${obj.name}</h2>
               </div>
      `;
    } else {
      newTag.innerHTML = `
              <div class= "friend__status-wrap">
                <div id="r${obj.room_id}" >
                  <div class="friend__status__unSeenMess">
                    ${obj.unSeenMess}
                  </div>
                </div>
                <img src=${obj.avatar}  alt="Avatar" class="avatar inverted" />
                <div class="friend__status" id="f${obj._id}">
                  <div class="friend__status_time">
                  </div> 
                  <input type="number" value=${obj.lastTime} style="display:none">
                </div> 
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
      info.friend_id = obj._id;
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
    setInterval(() => {
      let lastTime = newTag.querySelector("input").value;
      if (lastTime != 0) {
        let sTimeOff = Number.parseInt((Date.now() - lastTime) / 1000);
        let mthTimeOff = Number.parseInt(sTimeOff / (60 * 60 * 24 * 30));
        let dTimeOff = Number.parseInt(sTimeOff / (60 * 60 * 24));
        let hTimeOff = Number.parseInt(sTimeOff / (60 * 60));
        let mTimeOff = Number.parseInt(sTimeOff / 60);
        if (mthTimeOff != 0) {
          newTag.querySelector(
            `#f${obj._id}`
          ).firstElementChild.innerHTML = `Active ${mthTimeOff}mth ago`;
        } else if (dTimeOff != 0) {
          newTag.querySelector(
            `#f${obj._id}`
          ).firstElementChild.innerHTML = `Active ${dTimeOff}d ago`;
        } else if (hTimeOff != 0) {
          newTag.querySelector(
            `#f${obj._id}`
          ).firstElementChild.innerHTML = `Active ${hTimeOff}h ago`;
        } else if (mTimeOff != 0) {
          newTag.querySelector(
            `#f${obj._id}`
          ).firstElementChild.innerHTML = `Active ${mTimeOff}m ago`;
        } else {
          newTag.querySelector(
            `#f${obj._id}`
          ).firstElementChild.innerHTML = `Just now`;
        }
      }
    }, 3000);
  }
  //obj{info}
  info(socket, info, parTag, obj) {
    info.name = obj.name;
    info.avatar = obj.avatar;
    const newTag = document.createElement("div");
    // newTag.classList.add("sidebar__header-wrap");
    newTag.classList.add("sidebar__headerLeft");
    newTag.innerHTML = `
              <img src=${obj.avatar} alt="Avatar" class="avatar inverted" data-toggle="modal" data-target="#exampleModalCenterInfo"/>
              <!-- Modal -->
              <div class="modal fade" id="exampleModalCenterInfo" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">Update Avatar</h5>
                    </div>
                  <form action="/upload" method="post" enctype="multipart/form-data" id="form_chat">
                    <div class="modal-body">
                      <input type="file" name="avatar" id="file" />
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-primary" name="_id" value="${info._id}">Save changes</button>
                    </div>
                  </form>
                  </div>
                </div>
              </div>
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
    let date = new Date(obj.createdAt);
    let dateNow = new Date();
    if (date.getDate() - dateNow.getDate() < 0) {
      date = date.toDateString();
    } else {
      date = date.toLocaleTimeString();
    }
    // console.log(date);
    // console.log(Date.parse(date))
    // console.log(date.getDate().toString());
    // console.log(date.toLocaleDateString());
    if (obj._id != info._id) {
      newTag.innerHTML = `
          <div class="messages">
            <div class="messages__avt">
              <img src=${obj.avatar} class="avatar_onchat inverted" />
            </div>
            <span class="chat__name">${obj.name}</span>
            <div class="messages__content">
            <div class="content__sender">
              ${obj.content}<br>
            </div>
            </div>
            <div class="messages__time">
            <span class="chat__time">${date}</span>
            </div>
          </div>
        `;
    } else {
      newTag.classList.add("chat__receiver");
      newTag.innerHTML = `
      <div class="messages">
      <div class="messages__time messages__time-receiver">
        <span class="chat__time">${date}</span>
      </div>
      <div class="messages__content messages__content-receiver">
      <div class="content__sender">
        ${obj.content}<br>
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
    newTag.classList.add("friend__search");
    newTag.innerHTML = `
    <div class="user__info">
    <img src=${obj.avatar} class="avatar_onchat inverted" />
        <span style="color: #000">${obj.name}</span>
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
  showMember(socket, info, parTag, obj) {
    const newTag = document.createElement("div");
    newTag.setAttribute("class", "dropdown-item");
    newTag.classList.add("edit__dropdown");
    newTag.classList.add("room__members");
    newTag.innerHTML = `
    <div class="user__info">
    <img src=${obj.avatar} class="avatar_onchat inverted" />
        ${obj.name}
        </div>
      `;
    parTag.appendChild(newTag);
    // const addFriendBtn = newTag.querySelector("button");
    // addFriendBtn.addEventListener("click", (e) => {
    //   socket.emit("friendReq", {
    //     sender: info._id,
    //     receiver: obj._id,
    //   });
    // });
  }

  friendSearchResult(socket, info, parTag, obj) {
    const newTag = document.createElement("a");
    newTag.setAttribute("class", "dropdown-item");
    newTag.classList.add("edit__dropdown");
    newTag.classList.add("friend__search");
    newTag.innerHTML = `
    <div class="user__info">
    <img src=${obj.avatar} class="avatar_onchat inverted" />
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
        <img src=${obj.avatar} class="avatar inverted" />
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
  //user typing
}
