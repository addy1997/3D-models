import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import {
  ColladaLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.119/examples/jsm/loaders/ColladaLoader.js';

AFRAME.registerComponent("collada-storm-trooper", {
  init: function() {
    var loader = new ColladaLoader();
    this.mixer = null;
    this.sbox = new THREE.Box3();
    this.el.sceneEl.object3D.add(
      new THREE.Box3Helper(this.sbox, 0x00ff00)
    );
    loader.load(
      "https://raw.githubusercontent.com/gftruj/webzamples/master/aframe/assets/models/stormtrooper/stormtrooper.dae",
      collada => {
        var animations = collada.animations;
        var root = collada.scene;
        var clip = animations[0];

        this.skinnedMesh = root.getObjectByName("Stormtrooper");
        root.traverse(function(node) {
          if (node.isSkinnedMesh) {
            node.frustumCulled = false;
          }
        });
        this.mixer = new THREE.AnimationMixer(root);
        var action = this.mixer.clipAction(clip).play();
        this.el.object3D.add(root);
      }
    );
  },
  tick: function(t, dt) {
    if (!this.mixer) return;
    this.mixer.update(dt / 1000);
    THREE.Box3Utils.fromSkinnedMesh(this.skinnedMesh, this.sbox);
  }
});
