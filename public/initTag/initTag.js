class InitTag {
  // const roomId = room.id;
  // const avatar = room.avatar;
  // const name = room.name;
  //obj{rom};
  initRoom(
    socket,
    info,
    parTag,
    obj,
    show_curr_room,
    show_messages,
    form_typing_mess
  ) {
    const newTag = document.createElement("a");
    newTag.classList.add("sidebarChat-link");
    newTag.setAttribute("href", `#${obj._id}`);
    newTag.innerHTML = `
          <div class="sidebarChat">
            <img
              src=${obj.avatar}
              alt="Avatar" class="avatar" />
            <div class="sidebarChat__info">
              <h2 class="sidebarChat__info-name">${obj.name}</h2>
              <p>Last Message</p>
            </div>
          </div>`;
    parTag.appendChild(newTag);
    //onclick
    newTag.addEventListener("click", (e) => {
      form_typing_mess.setAttribute("style", "visibility: visible");
      //show current room
      info.befRoom = info.curRoom;
      info.curRoom = obj._id;
      if (info.befRoom != info.curRoom) {
        //reset show_messages
        show_messages.innerHTML = "";
        const imgTag = show_curr_room.querySelector("#show_curr_room_img");
        const nameTag = show_curr_room.querySelector("#show_curr_room_name");
        imgTag.setAttribute("src", `${obj.avatar}`);
        nameTag.innerHTML = obj.name;
        //show old message
        socket.emit("onclick_room", info);
      }
    });
  }
  //obj{info}
  initInfo(socket, info, parTag, obj) {
    info.name = obj.name;
    info.avatar = obj.avatar;
    const newTag = document.createElement("div");
    newTag.classList.add("sidebar__header-wrap");
    newTag.innerHTML = `
              <div class="sidebar__header-container">
              <div class="sidebar__headerLeft">
              <img src=${obj.avatar} alt="Avatar" class="avatar" />
              <span class="sidebar__header-userName">${obj.name}</span>
              </div>
              <div class="sidebar__headerRight">
             <button type="button" class="btn btn-outline-primary">
               <i class="fas fa-ellipsis-v "></i>
             </button>
           </div>
           </div>
        `;
    parTag.appendChild(newTag);
  }
  //obj{message};
  //     _id: String,
  //     name: String,
  //     content: String,
  initMess(socket, info, obj, parTag) {
    const newTag = document.createElement("div");
    if (obj._id != info._id) {
      newTag.innerHTML = `
          <p class="chat__sender">
            <img src=${obj.avatar} class="avatar_onchat" />
            <span class="chat__name">${obj.name}</span>
            ${obj.content}<br>
            <span class="chat__time">${obj.createdAt}</span>
          </p>
        `;
    } else {
      newTag.innerHTML = `
          <p class="chat__receiver chat__sender">
            <span class="chat__name"></span>
            ${obj.content}<br>
            <span class="chat__time">${obj.createdAt}</span>
          </p>
        `;
    }
    newTag.querySelector(".chat__time").style.display = "none";
    newTag.addEventListener("click", (e) => {
      newTag.querySelector(".chat__time").style.display = "block";
      console.log("clicked");
    });
    parTag.insertBefore(newTag, parTag.children[0]);
  }
<<<<<<< HEAD
    //obj{name, avatar} of user,
    initSearchResult(socket, info, parTag, obj){
      const newTag = document.createElement('a');
      newTag.setAttribute("class", "dropdown-item");
      newTag.innerHTML = `
        <img src=${obj.avatar} class="avatar_onchat" />
        ${obj.name}
      `;
      parTag.appendChild(newTag);
    }
=======
>>>>>>> fe1c21624ce84635e41482c7c8ea24430a9ed572
}
