Module.register("MMM-SwipeKey", {
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

    touchStartX: 0,
    touchEndX: 0,

    touchStartHandler: function(event) {
        this.touchStartX = event.changedTouches[0].screenX;
    },

    touchEndHandler: function(event) {
        this.touchEndX = event.changedTouches[0].screenX;
        this.handleSwipe();
    },

    handleSwipe: function() {
        var difference = this.touchEndX - this.touchStartX;
        var threshold = 50;  // You can adjust the threshold as required

        if (difference > threshold) {
            this.sendSwipeNotification("ArrowLeft");
        } else if (difference < -threshold) {
            this.sendSwipeNotification("ArrowRight");
        }
    },

    sendSwipeNotification: function(direction) {
        var whichway = (direction === "ArrowRight" ? 1 : -1)
        this.sendNotification('CX3_GET_CONFIG', {
            callback: (before) => {
              this.sendNotification('CX3_SET_CONFIG', {
                monthIndex: before.monthIndex + whichway,
                callback: (after) => {
                  setTimeout(() => { this.sendNotification('CX3_RESET') }, 60*1000) //reset after 60 sec, async
                }
              })
            }
          })        
    },

    keypressHandler: function(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            this.sendSwipeNotification(event.key);
        }
    }
});
