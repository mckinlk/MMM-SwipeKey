Module.register("MMM-SwipeKey", {
    // Default module configuration
    defaults: {
        mode: "week",
        swipe: "y",
        threshold: 200,
    },
    start: function () {
        Log.log("Starting module: " + this.name);
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            window.addEventListener("keydown", this.keypressHandler.bind(this));
            window.addEventListener("touchstart", this.touchStartHandler.bind(this));
            window.addEventListener("touchend", this.touchEndHandler.bind(this));
        }
    },

    touchStart: 0,
    touchEnd: 0,

    touchStartHandler: function(event) {
        this.touchStart = (this.config.swipe == "x" ? event.changedTouches[0].screenX : event.changedTouches[0].screenY);
    },

    touchEndHandler: function(event) {
        this.touchEnd = (this.config.swipe == "x" ? event.changedTouches[0].screenX : event.changedTouches[0].screenY);
        this.handleSwipe();
    },

    handleSwipe: function() {
        var difference = this.touchEnd - this.touchStart;
        var threshold = this.config.threshold;  // You can adjust the threshold as required
        if (this.config.swipe === "x"){
            if (difference > threshold) {
                this.sendSwipeNotification("Back");
            } else if (difference < -threshold) {
                this.sendSwipeNotification("Forward");
            }
        } else {
            if (difference > threshold) {
                this.sendSwipeNotification("Forward");
            } else if (difference < -threshold) {
                this.sendSwipeNotification("Back");
            }            
        }
    },

    sendSwipeNotification: function(direction) {
        var whichway = (direction === "Forward" ? 1 : -1) 
        this.sendNotification('CX3_GET_CONFIG', {
            callback: (before) => {
              this.sendNotification('CX3_SET_CONFIG', {
                monthIndex: (this.config.mode === "month" ? before.monthIndex : before.weekIndex) + whichway,
                callback: (after) => {
                  setTimeout(() => { this.sendNotification('CX3_RESET') }, 60*1000) //reset after 60 sec, async
                }
              })
            }
          })        
    },

    keypressHandler: function(event) {
        if (this.config.swipe === "x"){
            if (event.key === "ArrowRight") {
                this.sendSwipeNotification("Forward");
            }
            if (event.key === "ArrowLeft") {
                this.sendSwipeNotification("Back");
            }
        } else {
            if (event.key === "ArrowDown") {
                this.sendSwipeNotification("Forward");
            }
            if (event.key === "ArrowUp") {
                this.sendSwipeNotification("Back");
            }
        }
    }
});
