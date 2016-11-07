curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
              {
                "title":"Hi, download veems!",
                "item_url":"http://getveems.com/",
                "image_url":"https://scontent.fhfa1-1.fna.fbcdn.net/v/t1.0-9/14910348_1269616276430682_7205925205365739623_n.png?oh=cd05d673ed7a164d739a3a232db99e5a&oe=58CCE6F4",
                "subtitle":"Click button or wrime a message",
                "buttons":[
                  {
                    "type":"web_url",
                    "title":"View Website",
                    "url":"http://getveems.com"
                  },
                  {
                    "type":"postback",
                    "title":"Bot command",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD"
                  }
                ]
              }
            ]
          }
        }
      }
    }
  ]
}' "https://graph.facebook.com/v2.6/483332995195420/thread_settings?access_token=EAATEuE8IUAEBAOsZC8OrcuvLblxnzG2agJTioKP39GXJx9BZB5m6Gt6rvoIl1kirk1aF8b7ugEp8TfyhDOHeQeTZCmwS0BegjAgp16ZBmvakqrYMtJZCZAfwZBZA1qlnIrWMVRZBWShWbTGO81txRnQ8ZBMNvlofe5Yjl4ajtAvWd31wZDZD"

