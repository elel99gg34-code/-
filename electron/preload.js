'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/** Everything the renderer is allowed to reach. Nothing else is exposed. */
const api = {
  win: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    onState: (cb) => {
      const h = (_e, v) => cb(v);
      ipcRenderer.on('window:state', h);
      return () => ipcRenderer.removeListener('window:state', h);
    }
  },

  app: {
    info: () => ipcRenderer.invoke('app:info'),
    openPath: (which) => ipcRenderer.invoke('app:openPath', which),
    onMenu: (cb) => {
      const h = (_e, cmd) => cb(cmd);
      ipcRenderer.on('menu', h);
      return () => ipcRenderer.removeListener('menu', h);
    }
  },

  vault: {
    list: () => ipcRenderer.invoke('vault:list'),
    save: (id, project) => ipcRenderer.invoke('vault:save', { id, project }),
    load: (id) => ipcRenderer.invoke('vault:load', id),
    remove: (id) => ipcRenderer.invoke('vault:delete', id),
    rename: (id, next) => ipcRenderer.invoke('vault:rename', { id, next }),
    duplicate: (id) => ipcRenderer.invoke('vault:duplicate', id)
  },

  files: {
    exportProject: (name, json) => ipcRenderer.invoke('file:exportProject', { name, json }),
    importProject: () => ipcRenderer.invoke('file:importProject'),
    saveAudio: (suggested, ext, arrayBuffer, toRenders) =>
      ipcRenderer.invoke('file:saveAudio', { suggested, ext, data: arrayBuffer, toRenders: !!toRenders }),
    saveText: (suggested, ext, text) => ipcRenderer.invoke('file:saveText', { suggested, ext, text }),
    reveal: (p) => ipcRenderer.invoke('file:reveal', p)
  },

  ui: {
    confirm: (opts) => ipcRenderer.invoke('dialog:confirm', opts || {})
  }
};

contextBridge.exposeInMainWorld('riot', api);
