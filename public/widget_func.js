const sdk = window.sdk;
const BASEURL = "https://quranic.network";

// login the user
export function login_user(user, pass) {

        // set user_ID
        window.localStorage.setItem('user_id', user);
        // login with the username and the password to get access token
        const client = sdk.createClient(BASEURL);
        //
        client.login("m.login.password", {"user": user, "password": pass}).then((response) => {
            /// saving the access token
            const access_token = response.access_token;
            client.startClient();
            // getting the access token
            window.localStorage.setItem('access_token', access_token);

            // start the client
            client.once('sync', function(state, prevState, res) {
                console.log('state ----> ', state);
                getRooms();
              });

            // getting the room
            function getRooms() {
                var curr_tree = new Array();
                const rooms = client.getRooms();
                rooms.forEach(room => {
                //console.log(room)
                var myroom = {"name": room.name, "element_user": room.roomId, "id": room.roomId,"tags": ['معارف# '], "nodeType": 'simple'};
                    curr_tree[curr_tree.length] = myroom;
                 });
                const all_rooms = curr_tree
                window.localStorage.setItem('my_tree', JSON.stringify(all_rooms));
                return true;
            };

    }).catch((err) => {
                return false;
                });
    return true;
}

// TODO when the loigin does not work
export async function get_rooms_list(user='def_user', pass='def_pass') {

  var isLoggedIn = await login_user(user, pass)
  const tree = JSON.parse(window.localStorage.getItem('my_tree'));
  return tree;

};


function getRoombyName(room_name){
var rooms = get_rooms_list()
var roomId = ""
if (roomName != "") {
  for (var i=0; i <= rooms.length; i++){
    var room = rooms[i];
    if (room.name === roomName) {
      roomId = room.roomId;
      break;
    }
  };
}
  return roomId;
}


export async function send_message(roomIds, content_text) {

    const tok = window.localStorage.getItem('access_token')
    const client = sdk.createClient({
                    baseUrl: BASEURL,
                   accessToken: window.localStorage.getItem('access_token'),
                   userId: "@"+window.localStorage.getItem('user_id')+":"+BASEURL});

    //const content_text = prompt("لطفا پیام خود را وارد نمایید", "متن پیام...");

    // ============= send message function ===========================
    var content = {
      "body": content_text,
      "msgtype": "m.text"
    };
    roomIds.forEach(roomId => {
    client.sendEvent(roomId["element_user"], "m.room.message", content, "").then((res) => {
     // message sent successfully
    }).catch((err) => {
      console.log(err);
    });});

};

export function send_individual_message(rooms) {

    const content_text = prompt("لطفا پیام خود را وارد نمایید", "متن پیام...");
    var content = {
      "body": content_text,
      "msgtype": "m.text"
    };

    var final_users = new Array();
    const selected_roomIds= rooms.forEach(roomId => {roomId["element_user"]});
    console.log('selected_roomIds',selected_roomIds)
    var existing_rooms = get_rooms_list();
    existing_rooms.forEach(roomObj => {
    if (selected_roomIds.includes(roomObj.roomId)){
        var curr_members = roomObj.getJoinedMembers();
        curr_members.forEach(member => {
        if (!final_users.includes(member.roomId)){
           final_users[final_users.length] = member.roomId;
           client.sendEvent(member.roomId, "m.room.message", content, "").then((res) => {
            // message sent successfully
            }).catch((err) => {
            console.log(err);
            });
        }
    })}
    })
 };
