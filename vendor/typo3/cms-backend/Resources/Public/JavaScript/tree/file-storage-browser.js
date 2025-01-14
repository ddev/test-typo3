/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __decorate=function(e,t,r,o){var i,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(s=(n<3?i(s):n>3?i(t,r,s):i(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};import{html,LitElement}from"lit";import{customElement,query}from"lit/decorators.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import"@typo3/backend/tree/tree-toolbar.js";import ElementBrowser from"@typo3/backend/element-browser.js";import LinkBrowser from"@typo3/backend/link-browser.js";import"@typo3/backend/element/icon-element.js";import{FileStorageTree}from"@typo3/backend/tree/file-storage-tree.js";let FileStorageBrowserTree=class extends FileStorageTree{createNodeContentAction(e){return this.settings.actions.includes("link")?html`
        <span class="node-action" @click="${()=>this.linkItem(e)}">
          <typo3-backend-icon identifier="actions-link" size="small"></typo3-backend-icon>
        </span>
      `:this.settings.actions.includes("select")?html`
        <span class="node-action" @click="${()=>this.selectItem(e)}">
          <typo3-backend-icon identifier="actions-link" size="small"></typo3-backend-icon>
        </span>
      `:super.createNodeContentAction(e)}linkItem(e){LinkBrowser.finalizeFunction("t3://folder?storage="+e.storage+"&identifier="+e.pathIdentifier)}selectItem(e){ElementBrowser.insertElement(e.recordType,e.identifier,e.name,e.identifier,!0)}};FileStorageBrowserTree=__decorate([customElement("typo3-backend-component-filestorage-browser-tree")],FileStorageBrowserTree);export{FileStorageBrowserTree};let FileStorageBrowser=class extends LitElement{constructor(){super(...arguments),this.activeFolder="",this.actions=[],this.selectActiveNode=e=>{const t=e.detail.nodes;e.detail.nodes=t.map((e=>(decodeURIComponent(e.identifier)===this.activeFolder&&(e.checked=!0),e)))},this.loadFolderDetails=e=>{const t=e.detail.node;if(!t.checked)return;const r=document.location.href+"&contentOnly=1&expandFolder="+t.identifier;new AjaxRequest(r).get().then((e=>e.resolve())).then((e=>{document.querySelector(".element-browser-main-content .element-browser-body").innerHTML=e}))}}firstUpdated(){this.activeFolder=this.getAttribute("active-folder")||""}createRenderRoot(){return this}render(){this.hasAttribute("tree-actions")&&this.getAttribute("tree-actions").length&&(this.actions=JSON.parse(this.getAttribute("tree-actions")));const e={dataUrl:top.TYPO3.settings.ajaxUrls.filestorage_tree_data,filterUrl:top.TYPO3.settings.ajaxUrls.filestorage_tree_filter,showIcons:!0,actions:this.actions};return html`
      <div class="tree">
        <typo3-backend-tree-toolbar .tree="${this.tree}"></typo3-backend-tree-toolbar>
        <div class="navigation-tree-container">
          <typo3-backend-component-filestorage-browser-tree class="tree-wrapper" .setup=${e} @tree:initialized=${()=>{this.tree.addEventListener("typo3:tree:node-selected",this.loadFolderDetails),this.tree.addEventListener("typo3:tree:nodes-prepared",this.selectActiveNode);this.querySelector("typo3-backend-tree-toolbar").tree=this.tree}}></typo3-backend-component-page-browser-tree>
        </div>
      </div>
    `}};__decorate([query(".tree-wrapper")],FileStorageBrowser.prototype,"tree",void 0),FileStorageBrowser=__decorate([customElement("typo3-backend-component-filestorage-browser")],FileStorageBrowser);export{FileStorageBrowser};