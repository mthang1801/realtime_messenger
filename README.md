# realtime_messenger


# Install 
1. npm i 

2. bower i 

3. sudo systemctl start mongodb

4. source sh/env.sh 

5. npm run dev

================= Plaining upgrade for project messenger ============
1- create index for mongodb
2- fix alert for auth-page
3- fix @media (min-width:500) and (max-width:768): scroll form
4- update search feature for contact
5- #see-all-notifications when click not show modal, have to config in initialConfigure at main.js
6- need to fix "seen" at group chat 
7- remove conversation , when remove convesation, both side will be removed, need to fix that only one side who request remove conversation, another one will be remain
====================== Tips And Tricks ==========================


//chặn không cho người dùng click chuột nhiều lần khi submit form
$("body").on("submit","form", function(){
    $(this).on("submit", function(){
      return false ;
    });
    return true;
  })

** truy vấn $.get() thì bên server trả về req.query
** truy vấn $.put hoặc $post thì bên server trả về req.body

//get data khi scroll xuống cuối trang , đồng thời thanh cuộn cuộn đúng vị trí phần tử cuối cùng khi chưa lấy dữ liệu thêm xuống
$(this).scrollTop() + $(this)[0].clientHeight - 40;
scrollHeight : độ cao tính từ phần tử đầu tiên đến phần tử cuối cùng( biến cố định)
clientHeihgt: độ cao của element (box) (biến cố định)
scrollTop() : khoảng cách mà thanh cuộn (scroll) có thể trượt (scroll) từ phần tử đầu đến phần tử cuối ( càng trượt xuống thì khoảng cách càng lớn)
=> công thức: để thanh cuộn có thể đặt tại vị trí cuối thì  : ( scrollHeight - clientHeight <= scrollTop() + ?px )  [? : tính cả padding nên cần cộng thêm] 

** để chèn thêm dữ liệu vào object item đã tồn tại trong mongoose , cần phải thêm {strict : false} ở schema , và khi findOneAndUpdate cần thêm option {upsert:true}
VD: let contactSchema = new mongoose.Schema({
      userId : String , 
      contactId : String , 
      status : {type : Boolean, default : false},
      createdAt : {type : Number, default : Date.now},
      blockList : [{type : String, default : null }],
      updatedAt : {type : Number, default : null},
      deletedAt : {type : Number, default : null}
    }, {strict : false});
        ví dụ  muốn thêm msgUpdatedAt ta làm như sau : 
     updateContactStatusAsTrueAndCreateTimeMessage(userId, contactId){
    return this.findOneAndUpdate(
      {"userId" : userId, "contactId" : contactId},
      {"status" : true, updatedAt : Date.now(), "msgUpdatedAt": Date.now()},
      { new: true, upsert: true}).exec();
  },
       Lưu ý: khi lấy dữ liệu xuống, thay vì contact.msgUpdatedAt thì ta dùng : contact.get("msgUpdatedAt")

======================================================================
#config database environment variables
export DB_CONNECT=mongodb
export DB_HOST=localhost
export DB_PORT=27017
export DB_NAME=messenger
export DB_USER=""
export DB_PASSWORD=""

#config host and port environment for server
export APP_HOST=localhost
export APP_PORT=3000

#config admin email
export MAIL_USER=***
export MAIL_PASS=***
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587

#config login facebook
export FB_APP_ID=564805340774728
export FB_APP_SECRET=5079294686743f66b58b567a9e5356b9
export FB_CALLBACK_URL=https://localhost:3000/auth/facebook/callback

#config login google+
export GG_APP_ID=519432788476-lv9bi1joqjgtdaj2fnsncppalfprieje.apps.googleusercontent.com
export GG_APP_SECRET=KzkCrWbZw6hvvCh93Xg8hRBy
export GG_CALLBACK_URL=https://localhost:3000/auth/google/callback

#saltRounds
export SALT_ROUNDS=10

#config session
export SESSION_KEY=express.sid
export SESSION_SECRET==***

#set get limit
export LIMIT_NOTIFICATIONS=10
export LIMIT_CONVERSATIONS=7
export LIMIT_MESENGERS=30