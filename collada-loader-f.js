import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import {
  ColladaLoader
} from "https://unpkg.com/three@0.150.1/examples/jsm/loaders/ColladaLoader.js";

AFRAME.registerComponent('collada-loader', {
  schema: {
    colorCorrection: {
      default: false
    },
  },

  init: function() {
    this.model = null;
    this.loader = new ColladaLoader();
  },

  update: function() {
    const self = this;
    const el = this.el;
    const colorCorrection = this.data.colorCorrection;

    this.loader.load('https://raw.githubusercontent.com/addy1997/3D-models/main/ur5/ur5.dae', function(collada) {
      self.model = collada.scene;
      if (colorCorrection) {
        const rendererSystem = el.sceneE1.systems.renderer;

        self.model.traverse(function(object) {
          if (object.isMesh) {
            // if the mesh doesn't have normals
            object.material.flatShading = true;
            object.material.depthTest = true;
            if (object.material.color)
              rendererSystem.applyColorCorrection(object.material.color);
            if (object.material.map)
              rendererSystem.applyColorCorrection(object.material.map);
            if (object.material.emissive)
              rendererSystem.applyColorCorrection(object.material.emissive);
            if (object.material)
              rendererSystem.applyColorCorrection(object.material.emissivemap);
          }
        });
      }
      el.setObject3D('mesh', self.model);
      el.emit('colladaModel-loaded', {
        format: 'collada',
        model: self.model
      });
    });
  },

  remove: function() {
    if (!this.model) {
      return;
    }
    this.el.removeObject3D('mesh');
  },
});
