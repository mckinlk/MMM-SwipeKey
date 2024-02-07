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
        var count = event.touches.length;
        this.touchEnd = (this.config.swipe == "x" ? event.changedTouches[0].screenX : event.changedTouches[0].screenY);
        this.handleSwipe(count);
    },

    handleSwipe: function(count) {
        var difference = this.touchEnd - this.touchStart;
        var threshold = this.config.threshold;  // You can adjust the threshold as required
        if (difference > threshold) {
            this.sendSwipeNotification("Back", count);
        } else if (difference < -threshold) {
            this.sendSwipeNotification("Forward", count);
        }
    },

    sendSwipeNotification: function(direction, count) {
        var whichway = (direction === "Forward" ? count : -1 * count) 
        this.sendNotification('CX3_GET_CONFIG', {
            callback: (before) => {
              this.sendNotification('CX3_SET_CONFIG', {
                monthIndex: (this.config.mode === "month" ? before.monthIndex  + whichway: before.monthIndex),
                weekIndex:  (this.config.mode === "week" ? before.weekIndex  + whichway: before.weekIndex),
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
                this.sendSwipeNotification("Forward", 1);
            }
            if (event.key === "ArrowLeft") {
                this.sendSwipeNotification("Back", 1);
            }
        } else {
            if (event.key === "ArrowDown") {
                this.sendSwipeNotification("Back", 1);
            }
            if (event.key === "ArrowUp") {
                this.sendSwipeNotification("Forward", 1);
            }
        }
    }
});
