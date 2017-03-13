var config = {

    "name" : "Fontface Ninja",
    "version" : "2.1.0",
    "isBeta" : false,
    "isDev" : false,
    "browser" : "Chrome",

    "api" : {
        "root" : "http://api.fontface.ninja/v1",
        "site" : "/sites",
        "auth" : {
            "check" : "/auth/check",
            "local" : "/auth/login",
            "facebook" : "/auth/loginFB" 
        },
        "fonts" : "/fonts",
        "extension" : {
            "populate" : "/extension/populate"
        }
    },

    "facebook": {
        "locale" : "en_US",
        "client_id" : "1345284285500668",
        "redirect_uri" : "https://www.facebook.com/connect/login_success.html",
        "version" : "v2.7"
    },

    "localStorage" : {
        keys : {
            config : "_ffn_config",
            session : "_ffn_token"
        }
    }

}