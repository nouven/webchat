class InitTag{

    // const roomId = room.id;
    // const avatar = room.avatar;
    // const name = room.name;
    //obj{rom};
    initRoom(socket,info, parTag, obj, show_curr_room, show_messages, form_typing_mess){
        const newTag = document.createElement('a');
        newTag.setAttribute('href', `#${obj.id}`);
        newTag.innerHTML =`
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
        newTag.addEventListener('click',(e)=>{
          form_typing_mess.setAttribute('style',"visibility: visible");
          //show current room 
          info.befRoom = info.curRoom;
          info.curRoom = obj.id;
          if(info.befRoom != info.curRoom){
            //reset show_messages
            show_messages.innerHTML = '';
            const imgTag = show_curr_room.querySelector('#show_curr_room_img');
            const nameTag = show_curr_room.querySelector('#show_curr_room_name');
            imgTag.setAttribute('src',`${obj.avatar}`);
            nameTag.innerHTML = obj.name;
            //show old message
            socket.emit('onclick_room',info);
          }
        })
    }
    //obj{info}
    initInfo(socket , info , parTag,obj){
        info.name = obj.name;
        const newTag = document.createElement('div');
        newTag.innerHTML = `
           <div class="sidebar__headerRight">
           <img
             src=${obj.avatar}
             alt="Avatar" class="avatar" />
             <span>${obj.name}</span>
             <button type="button" class="btn btn-outline-primary">
               <i class="fas fa-ellipsis-v "></i>
             </button>
           </div>
        `;
        parTag.appendChild(newTag);
    }
    //obj{message};
//     userId: String,
//     name: String,
//     content: String,
    initMess(socket, info, obj, parTag){
      console.log(obj);
      const newTag = document.createElement('div');
      if(obj._id!= info._id){
        newTag.innerHTML = `
          <p class="chat__sender">
            <span class="chat__name">${obj.name}</span>
            ${obj.content}
            <span class="chat__time"></span>
          </p>
        `;
      }else{
        newTag.innerHTML = `
          <p class="chat__receiver chat__sender">
            <span class="chat__name">${obj.name}</span>
            ${obj.content}
            <span class="chat__time"></span>
          </p>
        `;
      }
      parTag.appendChild(newTag);
    }
}