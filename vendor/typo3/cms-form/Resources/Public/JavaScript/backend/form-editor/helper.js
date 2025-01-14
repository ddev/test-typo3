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
import $ from"jquery";let formEditorApp=null,configuration=null;const defaultConfiguration={domElementClassNames:{active:"active",buttonCollectionElementRemove:"formeditor-inspector-collection-element-remove-button",buttonFormEditor:"formeditor-button",disabled:"disabled",hidden:"hidden",icon:"formeditor-icon",sortableHover:"sortable-hover"},domElementDataAttributeNames:{elementIdentifier:"data-element-identifier-path",identifier:"data-identifier",template:"data-template-name",templateProperty:"data-template-property"},domElementSelectorPattern:{bracesWithKey:"[{0}]",bracesWithKeyValue:'[{0}="{1}"]',class:".{0}",id:"#{0}",keyValue:'{0}="{1}"'}};function getFormEditorApp(){return formEditorApp}function getUtility(){return getFormEditorApp().getUtility()}function assert(e,t,r){return getFormEditorApp().assert(e,t,r)}export function setConfiguration(e){return assert("object"===$.type(e),'Invalid parameter "partialConfiguration"',1478950623),configuration=$.extend(!0,defaultConfiguration,e),this}export function buildDomElementSelectorHelper(e,t){let r;assert(!getUtility().isUndefinedOrNull(configuration.domElementSelectorPattern[e]),'Invalid parameter "patternIdentifier" ('+e+")",1478801251),assert("array"===$.type(t),'Invalid parameter "replacements"',1478801252),r=configuration.domElementSelectorPattern[e];for(let e=0,n=t.length;e<n;++e)r=r.replace("{"+e+"}",t[e]);return r}export function getDomElementSelector(e,t){return assert(!getUtility().isUndefinedOrNull(configuration.domElementSelectorPattern[e]),'Invalid parameter "selectorIdentifier" ('+e+")",1478372374),buildDomElementSelectorHelper(e,t)}export function getDomElementClassName(e,t){let r;return assert(!getUtility().isUndefinedOrNull(configuration.domElementClassNames[e]),'Invalid parameter "classNameIdentifier" ('+e+")",1478803906),r=configuration.domElementClassNames[e],t&&(r=getDomElementSelector("class",[r])),r}export function getDomElementIdName(e,t){let r;return assert(!getUtility().isUndefinedOrNull(configuration.domElementIdNames[e]),'Invalid parameter "domElementIdNames" ('+e+")",1479251518),r=configuration.domElementIdNames[e],t&&(r=getDomElementSelector("id",[r])),r}export function getDomElementDataAttributeValue(e){return assert(!getUtility().isUndefinedOrNull(configuration.domElementDataAttributeValues[e]),'Invalid parameter "dataAttributeValueIdentifier" ('+e+")",1478806884),configuration.domElementDataAttributeValues[e]}export function getDomElementDataAttribute(e,t,r){return assert(!getUtility().isUndefinedOrNull(configuration.domElementDataAttributeNames[e]),'Invalid parameter "dataAttributeIdentifier" ('+e+")",1478808035),getUtility().isUndefinedOrNull(t)?configuration.domElementDataAttributeNames[e]:(r=r||[],getDomElementSelector(t,[configuration.domElementDataAttributeNames[e]].concat(r)))}export function getDomElementDataIdentifierSelector(e){return getDomElementDataAttribute("identifier","bracesWithKeyValue",[getDomElementDataAttributeValue(e)])}export function getTemplate(e){return getUtility().isUndefinedOrNull(configuration.domElementDataAttributeValues[e])||(e=getDomElementDataAttributeValue(e)),$(getDomElementDataAttribute("template","bracesWithKeyValue",[e]))}export function getTemplatePropertyDomElement(e,t){return $(getDomElementDataAttribute("templateProperty","bracesWithKeyValue",[e]),$(t))}export function bootstrap(e){formEditorApp=e}