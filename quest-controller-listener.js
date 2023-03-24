AFRAME.registerComponent('oculus-controller', {

  schema: {
    leftOculusControllerId: {
      type: 'string',
      default: "#left-oculus-controller"
    },
    rightOculusControllerId: {
      type: 'string',
      default: "#right-oculus-controller"
    },

  },

  init: function() {
    this.leftController = document.querySelector(this.leftOculusControllerId);
    this.rightController = document.querySelector(this.rightOculusControllerId);

    // initial values of the left controller buttons
    this.leftAxisX = 0;
    this.leftAxisY = 0;
    this.leftTrigger = {
      queuePress: false,
      queueRelease: false,
      pressed: false,
      released: false,
      pressing: false,
      value: 0
    };
    this.leftGrasp = {
      queuePress: false,
      queueRelease: false,
      pressed: false,
      released: false,
      pressing: false,
      value: 0
    };
    this.btnX = {
      queuePress: false,
      queueRelease: false,
      pressed: false,
      released: false,
      pressing: false,
    };
    this.btnY = {
      queuePress: false,
      queueRelease: false,
      pressed: false,
      released: false,
      pressing: false,
    };

    // initial values of the right controller buttons
    this.rightAxisX = 0;
    this.rightAxisY = 0;
    this.rightTrigger = {
      queuePress: false,
      queueRelease: false,
      pressed: false,
      released: false,
      pressing: false,
      value: 0
    };
    this.rightGrasp = {
      queuePress: false,
      queueRelease: false,
      pressed: false,
      released: false,
      pressing: false,
      value: 0
    };
    this.btnA = {
      queuePress: false,
      queueReleased: false,
      pressed: false,
      released: false,
      pressing: false,
    };
    this.btnB = {
      queuePress: false,
      queueReleased: false,
      pressed: false,
      released: false,
      pressing: false,
    };

    // event listeners
    let self = this;

    // left controller
    // thumbstick
    this.leftController.addEventListener('thumbstickmoved', function(event) {
      self.leftAxisX = event.detail.x;
      self.leftAxisY = event.detail.y;

      // thumbstick logging
      if (self.leftAxisY > 0.95) {
        console.log("DOWN");
      }
      if (self.leftAxisY < -0.95) {
        console.log("UP");
      }
      if (self.leftAxisX < -0.95) {
        console.log("LEFT");
      }
      if (self.leftAxisX > 0.95) {
        console.log("RIGHT");
      }
    });

    // trigger
    this.leftController.addEventListener('triggerdown', function(event) {
      self.leftTrigger.queuePress = true;
    });

    this.leftController.addEventListener('triggerUp', function(event) {
      self.leftTrigger.queueRelease = true;
    });

    this.leftController.addEventListener('triggerChanged', function(event) {
      self.leftTrigger.value = self.event.value;
    });

    // grasp
    this.leftController.addEventListener('graspdown', function(event) {
      self.leftGrasp.queuePress = true;
    });

    this.leftController.addEventListener('graspUp', function(event) {
      self.leftTrigger.queueRelease = true;
    });

    this.leftController.addEventListener('graspChanged', function(event) {
      self.leftGrasp.value = self.event.value;
    });

    // button X and Y
    this.leftController.addEventListener('xbuttonup', function(event) {
      self.btnX.queueRelease = true;
    });
    this.leftController.addEventListener('xbuttondown', function(event) {
      self.btnX.queuePress = true;
    });

    this.leftController.addEventListener('ybuttonup', function(event) {
      self.btnY.queueRelease = true;
    });
    this.leftController.addEventListener('ybuttondown', function(event) {
      self.btnY.queuePress = true;
    });

    // right controller
    this.rightController.addEventListener('thumbstickmoved', function(event) {
      self.rightAxisX = event.detail.x;
      self.rightAxisY = event.detail.y;

      // thumbstick logging
      if (event.detail.y > 0.95) {
        console.log("DOWN");
      }
      if (event.detail.y < -0.95) {
        console.log("UP");
      }
      if (event.detail.x < -0.95) {
        console.log("LEFT");
      }
      if (event.detail.x > 0.95) {
        console.log("RIGHT");
      }
    });

    this.rightController.addEventListener('triggerdown', function(event) {
      self.rightTrigger.queuePress = true;
    });

    this.rightController.addEventListener('triggerUp', function(event) {
      self.rightTrigger.queueRelease = true;
    });

    this.rightController.addEventListener('triggerChanged', function(event) {
      self.rightTrigger.value = self.event.value;
    });

    // grasp
    this.rightController.addEventListener('graspdown', function(event) {
      self.rightGrasp.queuePress = true;
    });

    this.rightController.addEventListener('graspUp', function(event) {
      self.rightTrigger.queueRelease = true;
    });

    this.righController.addEventListener('graspChanged', function(event) {
      self.rightGrasp.value = self.event.value;
    });

    // button A and B
    this.rightController.addEventListener('abuttonup', function(event) {
      self.btnA.queueRelease = true;
    });
    this.rightController.addEventListener('abuttondown', function(event) {
      self.btnA.queuePress = true;
    });

    this.rightController.addEventListener('Bbuttonup', function(event) {
      self.btnB.queueRelease = true;
    });
    this.rightController.addEventListener('bbuttondown', function(event) {
      self.btnB.queuePress = true;
    });
  },

  // function to change button states
  updateButtonState: function(stateObject) {
    // clear pressed/released data,
    //  because it is only true for one frame.
    stateObject.pressed = false;
    stateObject.released = false;

    // if button was recently pressed
    if (stateObject.queuePress && !stateObject.pressing) {
      stateObject.pressed = true;
      stateObject.pressing = true;
    }

    // if button was recently released:
    //   on first tick, pressing becomes false, 
    //   then on next tick, released becomes false. 
    if (stateObject.queueRelease) {
      stateObject.pressing = false;
      stateObject.released = true;
    }

    // data processed; clear queues
    stateObject.queuePress = false;
    stateObject.queueRelease = false;
  },

  tick: function() {
    this.updateButtonState(this.leftTrigger);
    this.updateButtonState(this.leftGrasp);

    this.updateButtonState(this.rightTrigger);
    this.updateButtonState(this.rightGrasp);

    this.updateButtonState(this.btnA);
    this.updateButtonState(this.btnB);
    this.updateButtonState(this.btnX);
    this.updateButtonState(this.btnY);
  }

});
