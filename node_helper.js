const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'KEYPRESS_DETECTED') {
      let mode = null;
      
      if (payload === 'ArrowRight') {
        mode = 'MOVE_NEXT';
      } else if (payload === 'ArrowLeft') {
        mode = 'MOVE_PREV';
      }
      
      if (mode) {
        this.sendSocketNotification('GLANCE', {
          mode: mode,
          name: 'KeyPress_Module'  // Replace with your actual glance name
        });
      }
    }
  },
});
