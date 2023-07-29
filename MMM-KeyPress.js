Module.register("MMM-KeyPress", {
    start: function () {
        Log.log("Starting module: " + this.name);
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            window.addEventListener("keydown", this.keypressHandler.bind(this));
        }
    },

    keypressHandler: function(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            var payload = {
                step: (event.key === "ArrowRight" ? 1 : -1)  // 1 to move forward, -1 to move backward
            };
            this.sendNotification('CX3_GLANCE_CALENDAR', payload);
        }
    }
});

