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
import flatpickr from"flatpickr";import ShortcutButtonsPlugin from"flatpickr/plugins/shortcut-buttons.min.js";import{DateTime}from"luxon";import ThrottleEvent from"@typo3/core/event/throttle-event.js";import"@typo3/backend/input/clearable.js";const ISO8601_UTC="ISO8601_UTC";class DateTimePicker{constructor(){this.format=(void 0!==opener?.top?.TYPO3?opener.top:top).TYPO3.settings.DateTimePicker.DateFormat}initialize(t){if(!(t instanceof HTMLInputElement)||void 0!==t.dataset.datepickerInitialized)return;let e=document.documentElement.lang;e&&"en"!==e?"ch"===e&&(e="zh"):e="default",t.dataset.datepickerInitialized="1",import("flatpickr/locales.js").then((()=>{this.initializeField(t,e)}))}initializeField(t,e){const a=this.getScrollEvent(),n=this.getDateOptions(t);n.locale=e,n.onOpen=[()=>{a.bindTo(document.querySelector(".t3js-module-body"))}],n.onClose=()=>{a.release()};const o=flatpickr(t,n);o.altInput instanceof HTMLInputElement&&o.input.addEventListener("typo3:internal:clear",(()=>{o.clear()})),o._input.addEventListener("change",(t=>{const e=t.target.value,a=o.parseDate(e,o.config.altFormat);o.setDate(a,!0)})),o._input.addEventListener("keyup",(t=>{"Escape"===t.key&&o.close()}))}getScrollEvent(){return new ThrottleEvent("scroll",(()=>{const t=document.querySelector(".flatpickr-input.active");if(null===t)return;const e=t.getBoundingClientRect(),a=t._flatpickr.calendarContainer.offsetHeight;let n,o;window.innerHeight-e.bottom<a&&e.top>a?(n=e.y-a-2,o="arrowBottom"):(n=e.y+e.height+2,o="arrowTop"),t._flatpickr.calendarContainer.style.top=n+"px",t._flatpickr.calendarContainer.classList.remove("arrowBottom","arrowTop"),t._flatpickr.calendarContainer.classList.add(o)}),15)}getDateOptions(t){const e=this.format,a=t.dataset.dateType,n=new Date,o={altFormat:"",allowInput:!0,altInput:!0,ariaDateFormat:"DDDD",dateFormat:ISO8601_UTC,defaultHour:n.getHours(),defaultMinute:n.getMinutes(),enableSeconds:!1,enableTime:!1,formatDate:(t,e)=>{const a=DateTime.fromJSDate(t);return e===ISO8601_UTC?a.toUTC().plus(60*a.offset*1e3).toISO({suppressMilliseconds:!0}):a.toFormat(e)},parseDate:(t,e)=>{if(e===ISO8601_UTC){const e=DateTime.fromISO(t,{zone:"utc"});if(!e.isValid)throw new Error("Invalid ISO8601 date: "+t);const a=e.toLocal();return a.minus(60*a.offset*1e3).toJSDate()}return DateTime.fromFormat(t,e).toJSDate()},onReady:(t,e,a)=>{void 0!==a.altInput&&(a.altInput.id=a.input.id,a.input.removeAttribute("id"),a.altInput.clearable(),void 0!==a.input.dataset.formengineInputName&&(a.altInput.dataset.formengineDatepickerRealInputName=a.input.dataset.formengineInputName),a.altInput.form.addEventListener("t3-formengine-postfieldvalidation",(t=>{t.detail.field===a.input&&a.altInput.classList.toggle("has-error",!t.detail.isValid)})))},onChange:(t,e,a)=>{a.input.dispatchEvent(new Event("formengine.dp.change"))},maxDate:"",minDate:"",minuteIncrement:1,noCalendar:!1,showMonths:1,monthSelectorType:a.startsWith("date")?"dropdown":"static",weekNumbers:!0,time_24hr:!Intl.DateTimeFormat(navigator.language,{hour:"numeric"}).resolvedOptions().hour12,plugins:[ShortcutButtonsPlugin({theme:"typo3",button:[{label:top.TYPO3.lang["labels.datepicker.today"]||"Today"}],onClick:(t,e)=>{e.setDate(new Date,!0)}})]};switch(a){case"datetime":o.altFormat=e[1],o.enableTime=!0;break;case"date":o.altFormat=e[0];break;case"time":o.altFormat="HH:mm",o.enableTime=!0,o.noCalendar=!0;break;case"timesec":o.altFormat="HH:mm:ss",o.enableSeconds=!0,o.enableTime=!0,o.noCalendar=!0;break;case"year":o.altFormat="yyyy"}return void 0!==t.dataset.dateMinDate&&(o.minDate=o.parseDate(t.dataset.dateMinDate,ISO8601_UTC),o.minDate.setSeconds(0)),void 0!==t.dataset.dateMaxDate&&(o.maxDate=o.parseDate(t.dataset.dateMaxDate,ISO8601_UTC),o.maxDate.setSeconds(59)),o}}export default new DateTimePicker;