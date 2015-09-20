'use strict';

Polymer({
  is: 'facebook-login',
  properties: {

    /**
     * Whether to also act as a logout button.
     */
    logoutLink: {
      type: Boolean,
      value: false
    },

    /**
     * The app ID of your Facebook app. Create one at https://developers.facebook.com/apps/
     */
    appid: {
      type: String,
      value: ""
    },

    /**
     * The language of the button.
     */
    language: {
      type: String,
      value: 'en_US'
    },

    /**
     * Whether you want to set a cookie in order to allow the server to access the session.
     */
    cookie: {
      type: Boolean,
      value: true
    },

    /**
     * The `version` attribute specifies which FB API version should be used. Example 'v2.4'.
     */
    version: {
      type: String,
      value: 'v2.4'
    },

    /**
     * The scope that you want access to.
     * (see https://developers.facebook.com/docs/facebook-login/permissions/v2.3). Should be space delimited.
     */
    scope: {
      type: String,
      value: 'basic_info'
    },

    /**
     * The Graph API URL you want to access.
     */
    graphUrl: {
      type: String,
      value: '',
      observer: "_sendAutoApiRequest"
    },

    /**
     * The returned response of an API call.
     */
    graphResponse: {
      type: Object,
      value: {},
      notify: true
    },

    /**
     * The params sent to the Graph API.
     */
    graphParams: {
      type: Object,
      value: {},
      observer: "_sendAutoApiRequest"
    },

    /**
     * The HTTP method used for Graph API calls.
     */
    graphMethod: {
      type: String,
      value: 'get'
    },

    /**
     * If set, the element will make an automatic API call whenenver the graphUrl property changes.
     */
    autoApiCall: {
      type: Boolean,
      value: false
    },

    _commaDelimittedAppScope: String,

    _ready: {
      type: Boolean,
      value: false
    },

    _firstAutoApiCallSent: {
      type: Boolean,
      value: false
    },

  },

  /**
   * The 'go' method initiates an API call to the URL specified by the property 'graphUrl'.
   *
   * @method go
   */
  go() {

    if (this.graphUrl === '') {
      console.error("No URL specified. Specify the graph API URL using the graphURL attribute.");
      return;
    }

    if (!this._ready) {
      console.error("The Facebook SDK is not ready yet.");
      return;
    }

    FB.api(this.graphUrl, this.graphMethod, this.graphParams, (response) => {
      this.graphResponse = response;
      this.fire('graph-response', {
        response: response
      });
    });
  },

  ready() {

    if (!this.appid) {
      console.error("Missing attribute appID for Facebook Login Button");
      return;
    }

    this._commaDelimittedAppScope = this.scope.split(' ').join(',');

    let fbButton = document.createElement('div');
    fbButton.className = "fb-login-button";
    fbButton.setAttribute("onlogin", "FB.customCheckLoginState();");
    fbButton.setAttribute("data-scope", this._commaDelimittedAppScope);
    fbButton.setAttribute("data-auto-logout-link", this.logoutLink.toString());
    Polymer.dom(this.$['fb-login-container']).appendChild(fbButton);

    window.fbAsyncInit = () => {
      FB.init({
        appId: this.appid,
        cookie: this.cookie,
        xfbml: true,
        version: this.version
      });

      FB.getLoginStatus(response => {
        this._statusChangeCallback(response);
      });

      FB.XFBML.parse(this.$['fb-login-container']);

      FB.customCheckLoginState = () => {
        FB.getLoginStatus(response => {
          this._statusChangeCallback(response);
        });
      };

      this._ready = true;
      this.fire('ready');
    };

    if (typeof(FB) == 'undefined') {
      ((d, s, id) => {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=" +
          this.version + "&appId=" + this.appid;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  },

  _statusChangeCallback(response) {
    if (response.status === 'connected') {
      // Logged into app and Facebook.
      this.fire('signin-success', {
        response: response
      });
      // User is signed in, we can now initiate an API call if autoApiCall is used
      if (!this._firstAutoApiCallSent) {
        this._firstAutoApiCallSent = true;
        this.go();
      }

    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not into the app.
      this.fire('signin-not-authorized', {
        response: response
      });
      this.graphResponse = {};
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      this.fire('signin-not-logged-in', {
        response: response
      });
      this.graphResponse = {};
    }
  },

  _sendAutoApiRequest() {
    if (this.autoApiCall && this._firstAutoApiCallSent) {
      // The initial auto api call is sent from the login callback.
      // Only the ones after that should be sent from the observer
      this.go();
    }
  }

  /**
   * The `signin-success` event is fired if a user
   * signs in successfully.
   *
   * @event signin-success
   */

  /**
   * The `signin-not-authorized` event is fired if a
   * user is signed into Facebook but not into your app.
   *
   * @event signin-not-authorized
   */

  /**
   * The `signin-not-logged-in` event is fired if a
   * user is not signed into facebook.
   *
   * @event signin-not-logged-in
   */

  /**
   * The `graph-response` event is fired as soon as the response of an API call comes in.
   *
   * @event graph-response
   */

  /**
   * The `ready` event is fired as soon as the facebook SDK is ready.
   *
   * @event ready
   */

});