class InitTag {
  room(socket, info, parTag, obj){
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
      modal_add_member.setAttribute("style", "visibility: visible");
      form_typing_mess.setAttribute("style", "visibility: visible");
      chat_header_right.setAttribute('style', 'visibility: visible');
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
  friend(socket ,info, parTag, obj){
    const newTag = document.createElement('li');
    newTag.classList.add('friend__items');
    newTag.innerHTML=`
             <img
             src=${obj.avatar}  alt="Avatar" class="avatar" />
             <div class="sidebarChat__info">
              <h2 class="sidebarChat__info-name">${obj.name}</h2>
             </div>
    `;
    parTag.appendChild(newTag);
    newTag.addEventListener("click", (e) => {
      modal_add_member.style.display = 'none';
      form_typing_mess.setAttribute("style", "visibility: visible");
      chat_header_right.setAttribute('style', 'visibility: visible');
      //reset show_messages
      show_messages.innerHTML = "";
      const imgTag = chat_header.querySelector("#show_curr_room_img");
      const nameTag = chat_header.querySelector("#show_curr_room_name");
      imgTag.setAttribute("src", `${obj.avatar}`);
      nameTag.innerHTML = obj.name;
      socket.emit("onclick_friend", {
        _id_1: obj._id,
        _id_2: info._id,
      });
      
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
    newTag.addEventListener("mouseover", (e) => {
      newTag.querySelector(".chat__time").style.display = "block";
    });
    newTag.addEventListener("mouseout", (e) => {
      newTag.querySelector(".chat__time").style.display = "none";
    });
    parTag.insertBefore(newTag, parTag.children[0]);
  }
    //obj{name, avatar} of user,
    userSearchResult(socket, info, parTag, obj){
      const newTag = document.createElement('a');
      newTag.setAttribute("class", "dropdown-item");
      newTag.innerHTML = `
        <img src=${obj.avatar} class="avatar_onchat" />
        ${obj.name}
        <button type="button" class="btn btn-success">add</button>
      `;
      parTag.appendChild(newTag);
      const addFriendBtn = newTag.querySelector('button');
      addFriendBtn.addEventListener('click',(e)=>{
        socket.emit("friendReq",{
          sender: info._id,
          receiver:obj._id
        });
      });
    }

    friendSearchResult(socket, info, parTag, obj){
      const newTag = document.createElement('a');
      newTag.setAttribute("class", "dropdown-item");
      newTag.innerHTML = `
        <img src=${obj.avatar} class="avatar_onchat" />
        ${obj.name}
        <button type="button" class="btn btn-success">add</button>
      `;
      parTag.appendChild(newTag);
      const addBtn = newTag.querySelector('.btn-success');
      addBtn.addEventListener('click',(e)=>{
        newTag.style.display = 'none';
        socket.emit('add_to_room',{
          curRoom : info.curRoom,
          _id: obj._id
        })
      })
    }
    //obj{id,name, avatar};
  friendReq(socket, info, parTag, obj){
    const newTag = document.createElement('div');
    newTag.innerHTML = `
        <img src=${obj.avatar} class="avatar_onchat" />
        ${obj.name}
        <button type="button" class="btn btn-danger">delete</button>
        <button type="button" class="btn btn-success">accept</button>
    `;
    parTag.appendChild(newTag);
    const delete_btn = newTag.querySelector('.btn-danger');
    const accept_btn = newTag.querySelector('.btn-success');
    delete_btn.addEventListener('click', (e)=>{
      newTag.style.display = 'none';
      socket.emit("deleteFriendReq", {
        _id: info._id,
        data: obj._id,
      });
    })
    accept_btn.addEventListener('click', (e)=>{
      newTag.style.display = 'none';
      socket.emit("acceptFriendReq", {
        _id: info._id,
        data: obj._id,
      });
    })
    
  }
}